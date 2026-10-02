/**
 * Route constants shared by server actions, route handlers, and client
 * components.
 *
 * Kept apart from `auth-urls.ts`, which imports the validated environment and
 * so cannot be pulled into a client component.
 */

/** Interstitial shown when an account still has to confirm its email address. */
export const CHECK_INBOX_PATH = "/auth/check-inbox";

/** Page the verification email returns the user to once Neon has verified. */
export const VERIFY_EMAIL_REDIRECT_PATH = "/auth/verify-email";

/** Page carrying the raw reset token, consumed by the existing reset form. */
export const RESET_PASSWORD_PATH = "/auth/reset-password";

/** Query flag the verify-email page sets to announce success on sign-in. */
export const EMAIL_VERIFIED_FLAG = "verified";