import { renderEmailLayout } from "../email-layout";
import type { EmailContent } from "../types";

interface VerifyEmailTemplateProps {
  /** `null` when the provider does not know the user's name. */
  readonly name: string | null;
  /** Absolute Neon Auth verification link carrying the raw token. */
  readonly verificationUrl: string;
  readonly expiresInMinutes: number;
}

/**
 * "Confirm your email address" email for the `send.magic_link` /
 * `email-verification` webhook event.
 */
export function verifyEmailTemplate(
  props: VerifyEmailTemplateProps,
): EmailContent {
  const { name, verificationUrl, expiresInMinutes } = props;
  const greeting = name ? `Hi ${name},` : "Hi,";

  return {
    subject: "Verify your email address",
    html: renderEmailLayout({
      previewText: "Confirm your email address to finish setting up EFlow.",
      heading: "Verify your email address",
      children: (
        <>
          <p style={PARAGRAPH_STYLE}>{greeting}</p>
          <p style={PARAGRAPH_STYLE}>
            Confirm this address to finish setting up your EFlow account. This
            step stops anyone else from signing up with your email.
          </p>
        </>
      ),
      action: { label: "Verify my email", href: verificationUrl },
      footnote: `This link expires in ${expiresInMinutes} minutes. If it has expired, request a new one from the sign-in page.`,
    }),
    text: [
      greeting,
      "",
      "Confirm this address to finish setting up your EFlow account.",
      "",
      `Verify your email: ${verificationUrl}`,
      "",
      `This link expires in ${expiresInMinutes} minutes.`,
      "",
      "If you did not sign up for EFlow, you can ignore this email.",
    ].join("\n"),
  };
}

const PARAGRAPH_STYLE = { margin: "0 0 16px" } as const;