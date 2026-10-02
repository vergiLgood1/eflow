import { env } from "@/shared/lib/env";
import { Resend } from "resend";

import type { EmailMessage, EmailProvider, EmailSendResult } from "./types";

/** Hard cap on how long a delivery attempt may take. */
const SEND_TIMEOUT_MS = 10_000;

/**
 * Resend-backed {@link EmailProvider}.
 *
 * Resend signals failure in two places: a thrown error (network, auth) and a
 * 2xx response carrying an `error` field. Both are folded into
 * {@link EmailSendResult} here so callers have one failure shape.
 */
export function createResendEmailProvider(apiKey: string): EmailProvider {
  const resend = new Resend(apiKey);

  return {
    async send(message: EmailMessage): Promise<EmailSendResult> {
      try {
        const response = await resend.emails.send(
          {
            from: env.EMAIL_FROM,
            to: message.to,
            subject: message.subject,
            html: message.html,
            text: message.text,
            tags: message.tags?.map((tag) => ({
              name: tag.name,
              value: tag.value,
            })),
          },
          // Neon gives a blocking webhook 15s total across all retries, so the
          // attempt itself must not hang waiting on Resend.
          { signal: AbortSignal.timeout(SEND_TIMEOUT_MS) },
        );

        if (response.error) {
          return {
            status: "failed",
            reason: response.error.message || "Resend rejected the request",
          };
        }

        const id = response.data?.id;
        if (!id) {
          return { status: "failed", reason: "Resend returned no message id" };
        }

        return { status: "sent", id };
      } catch (error) {
        return {
          status: "failed",
          reason:
            error instanceof Error
              ? error.message
              : "Unknown Resend delivery failure",
        };
      }
    },
  };
}