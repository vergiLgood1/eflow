import { sendEmail } from "@/shared/lib/email/email-sender";
import { IdempotencyCache } from "@/shared/lib/email/idempotency-cache";
import { resetPasswordTemplate } from "@/shared/lib/email/templates/reset-password";
import { verifyEmailTemplate } from "@/shared/lib/email/templates/verify-email";
import type { EmailContent } from "@/shared/lib/email/types";

import { buildAppUrl, buildVerificationUrl } from "./auth-urls";
import {
  RESET_PASSWORD_PATH,
  VERIFY_EMAIL_REDIRECT_PATH,
} from "./auth-routes";
import {
  EMAIL_LINK_EXPIRY_MINUTES,
  type NeonAuthEmailWebhook,
} from "../types/auth-webhook.schema";

const processedEvents = new IdempotencyCache();

/**
 * Turns a `send.magic_link` webhook into a branded Resend email.
 *
 * Neon skips its own delivery once this event is subscribed, so throwing here
 * is the only way to make it retry — and it retries up to 3 times, which is
 * what we want when Resend is briefly unavailable.
 *
 * Only `send.magic_link` is handled. `send.otp` is deliberately not
 * subscribed: OTP codes need a code-entry UI this app does not have, and an
 * unsubscribed event is still delivered by Neon's own provider, so users are
 * never left without an email.
 */
export async function dispatchNeonAuthEmail(
  event: NeonAuthEmailWebhook,
): Promise<void> {
  if (!processedEvents.claim(event.event_id)) {
    console.info(
      `Skipping duplicate Neon Auth email event ${event.event_id} for ${event.user.email}`,
    );
    return;
  }

  const content = buildEmailContent(event);

  if (!content) {
    console.info(
      `No email template for ${event.event_data.link_type} (event ${event.event_id}); nothing sent`,
    );
    return;
  }

  const result = await sendEmail({
    to: event.user.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
    tags: [
      { name: "category", value: event.event_data.link_type },
      { name: "app", value: "eflow" },
    ],
  });

  if (result.status === "failed") {
    // Release the id so Neon's retry is not swallowed as a duplicate.
    processedEvents.release(event.event_id);
    throw new Error(`Resend delivery failed: ${result.reason}`);
  }

  console.info(
    `Sent ${event.event_data.link_type} email to ${event.user.email} (Resend id ${result.id})`,
  );
}

function buildEmailContent(
  event: NeonAuthEmailWebhook,
): EmailContent | null {
  const { link_type: linkType, token } = event.event_data;
  const name = event.user.name ?? null;

  if (linkType === "email-verification") {
    return verifyEmailTemplate({
      name,
      verificationUrl: buildVerificationUrl({
        token,
        redirectPath: VERIFY_EMAIL_REDIRECT_PATH,
      }),
      expiresInMinutes: EMAIL_LINK_EXPIRY_MINUTES,
    });
  }

  if (linkType === "forget-password") {
    const resetUrl = new URL(buildAppUrl(RESET_PASSWORD_PATH));
    resetUrl.searchParams.set("token", token);

    return resetPasswordTemplate({
      name,
      resetUrl: resetUrl.toString(),
      expiresInMinutes: EMAIL_LINK_EXPIRY_MINUTES,
    });
  }

  // "sign-in" belongs to the Magic Link plugin, which this app does not enable.
  return null;
}