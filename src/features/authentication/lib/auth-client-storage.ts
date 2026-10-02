/**
 * Client-safe keys for values handed across a redirect.
 *
 * Deliberately separate from `auth-urls.ts`, which imports the validated
 * environment and therefore cannot be pulled into a client component.
 */

/**
 * sessionStorage key holding the address awaiting email confirmation.
 *
 * sessionStorage rather than a query string: the address is personal data, and
 * `?email=` would persist it in browser history, server logs, and any
 * `Referer` header on a later navigation.
 */
export const PENDING_VERIFICATION_EMAIL_KEY =
  "eflow:pending-verification-email";