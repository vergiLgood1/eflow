import { env } from "@/shared/lib/env";

/**
 * Builds an absolute URL on this app's own origin.
 *
 * Neon Auth resolves a relative redirect target against its own hosted domain
 * instead of the caller's, so every redirect handed to it must be absolute.
 * Passing `"/auth/reset-password"` produces a link that lands on
 * `*.neonauth.*.neon.tech` and dead-ends there, which is exactly the bug this
 * helper exists to prevent.
 *
 * The base path is preserved (unlike `new URL(path, base)`), so a deployment
 * hosted under a sub-path keeps working.
 */
export function buildAppUrl(path: string): string {
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

/**
 * Builds the link a verification email points at.
 *
 * The link deliberately targets **Neon Auth's** hosted `verify-email` endpoint
 * rather than this app: that is where the token is actually validated. Neon
 * consumes the token and then redirects to `redirectPath` on this app, so the
 * app never has to verify a token itself. On failure Neon appends
 * `?error=<CODE>` to that redirect.
 */
export function buildVerificationUrl(params: {
  readonly token: string;
  readonly redirectPath: string;
}): string {
  const { token, redirectPath } = params;

  const url = new URL(`${env.NEON_AUTH_BASE_URL.replace(/\/+$/, "")}/verify-email`);
  url.searchParams.set("token", token);
  url.searchParams.set("callbackURL", buildAppUrl(redirectPath));

  return url.toString();
}