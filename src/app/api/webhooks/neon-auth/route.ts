import { NextResponse, type NextRequest } from "next/server";

import { dispatchNeonAuthEmail } from "@/features/authentication/lib/neon-auth-email-dispatch";
import {
  verifyNeonWebhookSignature,
  WebhookSignatureError,
} from "@/features/authentication/lib/neon-auth-webhook-signature";
import { neonAuthEmailWebhookSchema } from "@/features/authentication/types/auth-webhook.schema";

// Signature verification uses node:crypto, and the handler must read the raw
// body itself; the default Node runtime is the only one that does both cleanly.
export const runtime = "nodejs";

// Neon Auth retries with the same body; nothing here is per-user stateful.
export const dynamic = "force-dynamic";

/**
 * Receives Neon Auth email events and delivers them through Resend.
 *
 * Once this endpoint is subscribed to `send.magic_link`, Neon stops sending
 * those emails itself — so an unreachable handler means no password-reset or
 * verification email at all. The 5xx returns below are therefore load-bearing:
 * they are what triggers Neon's retry, and a 2xx here means "delivered".
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  try {
    await verifyNeonWebhookSignature(rawBody, request.headers);
  } catch (error) {
    if (error instanceof WebhookSignatureError) {
      console.error("Rejected Neon Auth webhook:", error.message);
      // 400, not 401: an unverifiable delivery will never become verifiable, so
      // retrying it would just burn the attempt budget.
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    throw error;
  }

  const payload = parsePayload(rawBody);
  if (!payload.success) {
    console.error("Rejected Neon Auth webhook with unexpected payload:", payload.error);
    return NextResponse.json({ error: "Unexpected payload" }, { status: 400 });
  }

  if (payload.data.event_type !== "send.magic_link") {
    return NextResponse.json({ received: true });
  }

  try {
    await dispatchNeonAuthEmail(payload.data);
  } catch (error) {
    // Retryable: Neon re-delivers up to 3 times inside a 15s window.
    console.error("Neon Auth email dispatch failed:", error);
    return NextResponse.json({ error: "Delivery failed" }, { status: 503 });
  }

  return NextResponse.json({ received: true });
}

function parsePayload(rawBody: string) {
  let json: unknown;

  try {
    json = JSON.parse(rawBody);
  } catch {
    return { success: false as const, error: "Body is not valid JSON" };
  }

  return neonAuthEmailWebhookSchema.safeParse(json);
}