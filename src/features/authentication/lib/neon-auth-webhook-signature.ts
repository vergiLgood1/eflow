import { createPublicKey, verify } from "node:crypto";

import { env } from "@/shared/lib/env";

/**
 * Ed25519 signs the message itself with no separate digest step, which
 * node:crypto expresses as a `null` algorithm.
 *
 * Do not "simplify" this to `"ed25519"`: that is rejected as an unknown digest
 * by Bun's node:crypto, and this project runs on Bun.
 */
const SIGNATURE_ALGORITHM = null;

/** Reject replays of a captured delivery older than this. */
const MAX_SIGNATURE_AGE_MS = 5 * 60 * 1000;

/** Keep the JWKS document warm; refresh only on an unknown key id. */
const JWKS_CACHE_TTL_MS = 60 * 60 * 1000;

/**
 * A JWKS entry. The index signature mirrors `node:crypto`'s own `JsonWebKey`,
 * which is what `createPublicKey({ format: "jwk" })` accepts.
 */
interface JsonWebKey {
  readonly kid?: string;
  readonly kty?: string;
  readonly crv?: string;
  readonly [key: string]: unknown;
}

interface JwksDocument {
  readonly keys?: readonly JsonWebKey[];
}

/** In-flight and cached JWKS fetches, keyed by nothing — there is one issuer. */
let cachedKeys: { keys: readonly JsonWebKey[]; expiresAt: number } | null = null;

export class WebhookSignatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebhookSignatureError";
  }
}

/**
 * Verifies a Neon Auth webhook delivery.
 *
 * The signature is a detached JWS (`header..signature`) over
 * `timestamp + "." + base64url(rawBody)`, base64url-encoded a second time to
 * satisfy RFC 7515 compact serialisation. Note the double encoding — it is the
 * single easiest part of this contract to get wrong.
 *
 * @param rawBody The exact request bytes. Parsing and re-serialising first
 *   breaks verification, because JSON key order and whitespace are not
 *   guaranteed to survive a round trip.
 * @param headers The incoming request headers.
 * @throws WebhookSignatureError when the delivery cannot be trusted.
 */
export async function verifyNeonWebhookSignature(
  rawBody: string,
  headers: Headers,
): Promise<void> {
  const signature = headers.get("x-neon-signature");
  const keyId = headers.get("x-neon-signature-kid");
  const timestamp = headers.get("x-neon-timestamp");

  if (!signature || !keyId || !timestamp) {
    throw new WebhookSignatureError(
      "Missing X-Neon-Signature, X-Neon-Signature-Kid, or X-Neon-Timestamp",
    );
  }

  assertTimestampIsFresh(timestamp);

  const publicKey = await resolvePublicKey(keyId);
  const { signingInput, signatureBytes } = parseDetachedJws({
    detachedJws: signature,
    timestamp,
    rawBody,
  });

  // node:crypto narrows both `data` and `signature` to ArrayBufferView for a
  // `null` algorithm, so the base64url signature must be decoded to a Buffer.
  const isValid = verify(
    SIGNATURE_ALGORITHM,
    Buffer.from(signingInput, "utf8"),
    publicKey,
    signatureBytes,
  );

  if (!isValid) {
    throw new WebhookSignatureError("Neon webhook signature is invalid");
  }
}

function assertTimestampIsFresh(timestamp: string): void {
  const issuedAtMs = Number(timestamp);
  if (!Number.isFinite(issuedAtMs)) {
    throw new WebhookSignatureError("X-Neon-Timestamp is not a unix timestamp");
  }

  if (Date.now() - issuedAtMs > MAX_SIGNATURE_AGE_MS) {
    throw new WebhookSignatureError("Neon webhook timestamp is too old");
  }
}

/**
 * Splits a detached JWS into the exact bytes Neon signed and the raw signature.
 *
 * The signing input is `header + "." + base64url(timestamp + "." +
 * base64url(rawBody))` — base64url applied twice, which is what makes the
 * timestamp part of the signed message while still satisfying RFC 7515 compact
 * serialisation.
 */
function parseDetachedJws(params: {
  readonly detachedJws: string;
  readonly timestamp: string;
  readonly rawBody: string;
}): { readonly signingInput: string; readonly signatureBytes: Buffer } {
  const { detachedJws, timestamp, rawBody } = params;
  const [header, payload, signatureSegment, ...rest] = detachedJws.split(".");

  if (!header || !signatureSegment || rest.length > 0) {
    throw new WebhookSignatureError(
      "X-Neon-Signature is not a detached JWS (expected header..signature)",
    );
  }

  if (payload !== "") {
    throw new WebhookSignatureError(
      "X-Neon-Signature is not detached: expected an empty payload segment",
    );
  }

  const encodedBody = Buffer.from(rawBody, "utf8").toString("base64url");
  const signaturePayload = Buffer.from(
    `${timestamp}.${encodedBody}`,
    "utf8",
  ).toString("base64url");

  return {
    signingInput: `${header}.${signaturePayload}`,
    signatureBytes: Buffer.from(signatureSegment, "base64url"),
  };
}

async function resolvePublicKey(keyId: string) {
  const keys = await loadJwks();
  const jwk = keys.find((candidate) => candidate.kid === keyId);

  if (!jwk) {
    // An unknown kid usually means Neon rotated its signing key. Drop the cache
    // so the next attempt refetches, then give up for this delivery.
    cachedKeys = null;
    throw new WebhookSignatureError(`No JWKS key matches kid ${keyId}`);
  }

  return createPublicKey({ key: jwk, format: "jwk" });
}

async function loadJwks(): Promise<readonly JsonWebKey[]> {
  if (cachedKeys && cachedKeys.expiresAt > Date.now()) {
    return cachedKeys.keys;
  }

  const response = await fetch(
    `${env.NEON_AUTH_BASE_URL.replace(/\/+$/, "")}/.well-known/jwks.json`,
    { signal: AbortSignal.timeout(5_000) },
  );

  if (!response.ok) {
    throw new WebhookSignatureError(
      `Failed to fetch Neon Auth JWKS (${response.status})`,
    );
  }

  const document = (await response.json()) as JwksDocument;
  const keys = document.keys ?? [];

  if (keys.length === 0) {
    throw new WebhookSignatureError("Neon Auth JWKS document contains no keys");
  }

  cachedKeys = { keys, expiresAt: Date.now() + JWKS_CACHE_TTL_MS };

  return keys;
}