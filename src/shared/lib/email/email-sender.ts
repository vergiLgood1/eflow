import { env } from "@/shared/lib/env";

import { createResendEmailProvider } from "./email-provider";
import type { EmailMessage, EmailProvider, EmailSendResult } from "./types";

/**
 * Provider handle, built once per process. The Resend SDK is stateless, so
 * there is nothing to reuse beyond the client itself.
 */
let provider: EmailProvider | null = null;

function getProvider(): EmailProvider {
  provider ??= createResendEmailProvider(env.RESEND_API_KEY);
  return provider;
}

/**
 * Delivers a transactional email.
 *
 * Never throws: a delivery failure is returned as
 * `{ status: "failed" }` so callers decide whether it is fatal. Neon Auth
 * retries blocking webhook events, and its retry handler is an HTTP 5xx —
 * callers that must be retried should rethrow or return a non-2xx response.
 *
 * The recipient is logged in full because these addresses are already known to
 * the user and are the only way to correlate a failure with a Resend message
 * id; the subject and body are not logged.
 */
export async function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
  const result = await getProvider().send(message);

  if (result.status === "failed") {
    console.error(
      `Failed to send "${message.subject}" to ${message.to}: ${result.reason}`,
    );
    return result;
  }

  return result;
}