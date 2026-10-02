import { afterAll, describe, expect, spyOn, test } from "bun:test";
import { generateKeyPairSync, sign } from "node:crypto";

// NEON_AUTH_BASE_URL and the cookie secret are pinned by tests/setup.ts.
const { verifyNeonWebhookSignature } = await import(
  "@/features/authentication/lib/neon-auth-webhook-signature"
);

const KEY_ID = "test-key-1";

// No encodings, so these stay KeyObjects and publicKey.export() is available.
const { privateKey, publicKey } = generateKeyPairSync("ed25519");

const jwk = { ...publicKey.export({ format: "jwk" }), kid: KEY_ID };

/**
 * Reproduces Neon's detached-JWS construction.
 *
 * The double base64url encoding is the part that is easy to get wrong, so this
 * deliberately mirrors the documented algorithm rather than reusing any of the
 * code under test.
 */
function signDelivery(rawBody: string, timestamp = Date.now().toString()) {
  const header = Buffer.from(
    JSON.stringify({ alg: "EdDSA", typ: "JWS", kid: KEY_ID }),
  ).toString("base64url");

  const encodedBody = Buffer.from(rawBody, "utf8").toString("base64url");
  const signaturePayload = Buffer.from(
    `${timestamp}.${encodedBody}`,
    "utf8",
  ).toString("base64url");

  const signature = sign(
    null,
    Buffer.from(`${header}.${signaturePayload}`, "utf8"),
    privateKey,
  );

  return {
    headers: new Headers({
      "x-neon-signature": `${header}..${Buffer.from(signature).toString("base64url")}`,
      "x-neon-signature-kid": KEY_ID,
      "x-neon-timestamp": timestamp,
    }),
  };
}

// The module under test fetches Neon's JWKS over the network; only that one
// request is stubbed, so every other assertion still runs against real crypto.
// `Object.assign` carries over `fetch`'s `preconnect` property so the stub
// satisfies the whole global type without a type assertion.
const originalFetch = globalThis.fetch;
const stubJwksFetch = Object.assign(
  async (input: unknown) => {
    if (!String(input).endsWith("/.well-known/jwks.json")) {
      throw new Error(`Unexpected network call during the test: ${String(input)}`);
    }

    return Response.json({ keys: [jwk] });
  },
  { preconnect: originalFetch.preconnect },
);

const fetchSpy = spyOn(globalThis, "fetch").mockImplementation(stubJwksFetch);

afterAll(() => {
  fetchSpy.mockRestore();
});

describe("verifyNeonWebhookSignature", () => {
  test("accepts a correctly signed delivery", async () => {
    // Arrange
    const rawBody = JSON.stringify({ event_type: "send.magic_link" });
    const { headers } = signDelivery(rawBody);

    // Act
    const act = verifyNeonWebhookSignature(rawBody, headers);

    // Assert
    await expect(act).resolves.toBeUndefined();
  });

  test("rejects a body mutated after signing", async () => {
    // Arrange — this is the whole point of signing the raw bytes.
    const { headers } = signDelivery(JSON.stringify({ email: "a@example.com" }));

    // Act
    const act = verifyNeonWebhookSignature(
      JSON.stringify({ email: "attacker@example.com" }),
      headers,
    );

    // Assert
    await expect(act).rejects.toThrow(/signature is invalid/i);
  });

  test("rejects a delivery whose timestamp was swapped", async () => {
    // Arrange — signing at `Date.now()` and then re-reading the clock can land
    // in the same millisecond, which would make the forged delivery byte-identical
    // to the real one. Offset deterministically instead, and keep the swap inside
    // the freshness window so the age check cannot be what rejects it.
    const rawBody = JSON.stringify({ event_type: "send.magic_link" });
    const signedAt = Date.now();
    const { headers } = signDelivery(rawBody, signedAt.toString());
    headers.set("x-neon-timestamp", (signedAt + 1_000).toString());

    // Act — the signature no longer covers the new timestamp.
    const act = verifyNeonWebhookSignature(rawBody, headers);

    // Assert
    await expect(act).rejects.toThrow(/signature is invalid/i);
  });

  test("rejects a replay older than five minutes", async () => {
    // Arrange
    const rawBody = JSON.stringify({ event_type: "send.magic_link" });
    const stale = (Date.now() - 6 * 60 * 1000).toString();
    const { headers } = signDelivery(rawBody, stale);

    // Act
    const act = verifyNeonWebhookSignature(rawBody, headers);

    // Assert
    await expect(act).rejects.toThrow(/too old/i);
  });

  test("rejects a missing signature header", async () => {
    // Act
    const act = verifyNeonWebhookSignature("{}", new Headers());

    // Assert
    await expect(act).rejects.toThrow(/missing/i);
  });

  test("rejects a non-detached JWS", async () => {
    // Arrange — a compact JWS with a payload segment must not be accepted.
    const rawBody = "{}";
    const { headers } = signDelivery(rawBody);
    const signature = headers.get("x-neon-signature") ?? "";
    headers.set("x-neon-signature", signature.replace("..", ".eyJ9."));

    // Act
    const act = verifyNeonWebhookSignature(rawBody, headers);

    // Assert
    await expect(act).rejects.toThrow(/detached/i);
  });

  test("rejects an unknown key id", async () => {
    // Arrange
    const rawBody = "{}";
    const { headers } = signDelivery(rawBody);
    headers.set("x-neon-signature-kid", "some-other-key");

    // Act
    const act = verifyNeonWebhookSignature(rawBody, headers);

    // Assert
    await expect(act).rejects.toThrow(/No JWKS key matches/i);
  });
});