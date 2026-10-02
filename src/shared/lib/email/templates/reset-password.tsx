import { renderEmailLayout } from "../email-layout";
import type { EmailContent } from "../types";

interface ResetPasswordTemplateProps {
  readonly name: string | null;
  /** Absolute link into this app carrying the raw reset token. */
  readonly resetUrl: string;
  readonly expiresInMinutes: number;
}

/**
 * "Reset your password" email for the `send.magic_link` /
 * `forget-password` webhook event.
 */
export function resetPasswordTemplate(
  props: ResetPasswordTemplateProps,
): EmailContent {
  const { name, resetUrl, expiresInMinutes } = props;
  const greeting = name ? `Hi ${name},` : "Hi,";

  return {
    subject: "Reset your EFlow password",
    html: renderEmailLayout({
      previewText: "Use this link to choose a new EFlow password.",
      heading: "Reset your password",
      children: (
        <>
          <p style={PARAGRAPH_STYLE}>{greeting}</p>
          <p style={PARAGRAPH_STYLE}>
            We received a request to reset the password for this account. Choose
            a new one using the button below.
          </p>
        </>
      ),
      action: { label: "Reset my password", href: resetUrl },
      footnote: `This link expires in ${expiresInMinutes} minutes and can only be used once. If you did not request a reset, no action is needed — your password stays unchanged.`,
    }),
    text: [
      greeting,
      "",
      "We received a request to reset the password for this account.",
      "",
      `Reset your password: ${resetUrl}`,
      "",
      `This link expires in ${expiresInMinutes} minutes and can only be used once.`,
      "",
      "If you did not request a reset, no action is needed.",
    ].join("\n"),
  };
}

const PARAGRAPH_STYLE = { margin: "0 0 16px" } as const;