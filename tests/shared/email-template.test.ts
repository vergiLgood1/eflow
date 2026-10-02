import { describe, expect, test } from "bun:test";

import { resetPasswordTemplate } from "@/shared/lib/email/templates/reset-password";
import { verifyEmailTemplate } from "@/shared/lib/email/templates/verify-email";

const EXPIRY_MINUTES = 15;

describe("verifyEmailTemplate", () => {
  test("carries the verification link in the button, the body text and the subject", () => {
    // Arrange
    const verificationUrl =
      "https://auth.example.com/verify-email?token=abc123&callbackURL=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fverify-email";

    // Act
    const content = verifyEmailTemplate({
      name: "Di Yoan",
      verificationUrl,
      expiresInMinutes: EXPIRY_MINUTES,
    });

    // Assert — Resend clients pick either the button or the raw link, so both
    // must carry the token.
    expect(content.html).toContain(
      `href="${verificationUrl.replace(/&/g, "&amp;")}"`,
    );
    expect(content.text).toContain(verificationUrl);
    expect(content.subject).toBe("Verify your email address");
  });

  test("falls back to a nameless greeting", () => {
    // Act
    const content = verifyEmailTemplate({
      name: null,
      verificationUrl: "https://auth.example.com/verify-email?token=abc123",
      expiresInMinutes: EXPIRY_MINUTES,
    });

    // Assert
    expect(content.text).toStartWith("Hi,\n");
  });

  test("escapes a display name that contains markup", () => {
    // Arrange — the name comes from the identity provider, not from us.
    const content = verifyEmailTemplate({
      name: "<script>alert(1)</script>",
      verificationUrl: "https://auth.example.com/verify-email?token=abc123",
      expiresInMinutes: EXPIRY_MINUTES,
    });

    // Assert — the raw tag must never reach the HTML body.
    expect(content.html).not.toContain("<script>");
    expect(content.html).toContain("&lt;script&gt;");
  });
});

describe("resetPasswordTemplate", () => {
  test("carries the reset link and its single-use warning", () => {
    // Arrange
    const resetUrl = "http://localhost:3000/auth/reset-password?token=tok_9";

    // Act
    const content = resetPasswordTemplate({
      name: "Di Yoan",
      resetUrl,
      expiresInMinutes: EXPIRY_MINUTES,
    });

    // Assert
    expect(content.html).toContain(`href="${resetUrl}"`);
    expect(content.text).toContain(resetUrl);
    expect(content.html).toContain("can only be used once");
  });

  test("keeps the plaintext fallback free of markup", () => {
    // Act
    const content = resetPasswordTemplate({
      name: "Di Yoan",
      resetUrl: "http://localhost:3000/auth/reset-password?token=tok_9",
      expiresInMinutes: EXPIRY_MINUTES,
    });

    // Assert
    expect(content.text).not.toContain("<");
    expect(content.text).toContain(`This link expires in ${EXPIRY_MINUTES} minutes`);
  });
});