import "dotenv/config";
import { z } from "zod";

/**
 * Environment variables required to boot the server runtime.
 *
 * Auth and database credentials are mandatory because the app cannot verify a
 * session or reach Postgres without them; anything that degrades a single
 * optional feature (Stripe billing, the public app URL) stays optional so a
 * missing value fails at that feature's boundary instead of crashing the app.
 */
const envSchema = z.object({
  // Tolerate unknown values (e.g. a platform-injected "staging") so env
  // validation never becomes a new boot failure; the app only branches on
  // "development" vs "production" anyway.
  NODE_ENV: z.enum(["development", "test", "production"]).catch("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL must be a connection string"),
  NEON_AUTH_BASE_URL: z.url("NEON_AUTH_BASE_URL must be a valid URL"),
  // The Neon Auth SDK signs session cookies with this secret and rejects
  // anything shorter than 32 characters, so enforce it here too and fail fast.
  NEON_AUTH_COOKIE_SECRET: z
    .string()
    .min(32, "NEON_AUTH_COOKIE_SECRET must be at least 32 characters"),
  // Required (not optional) because transactional email builds absolute links:
  // Neon Auth resolves a relative `redirectTo` against its own hosted domain,
  // so password-reset and verification links would dead-end off-site.
  NEXT_PUBLIC_APP_URL: z.url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  // Transactional email is delivered through Resend. Required rather than
  // optional because Neon Auth treats `send.otp` / `send.magic_link` as
  // *blocking*: if our webhook cannot deliver, the auth flow fails outright.
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  // Full "Name <address>" sender. Must use a domain verified in Resend.
  EMAIL_FROM: z
    .string()
    .min(3, "EMAIL_FROM must be a valid sender address")
    .refine((value) => /@/.test(value), {
      message: "EMAIL_FROM must contain an email address",
    }),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates a raw environment record and returns a typed view of it.
 *
 * @throws Error naming every invalid variable when the environment is incomplete.
 */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid environment configuration — ${details}`);
  }

  return result.data;
}

/**
 * Typed, validated environment. Import this instead of reading `process.env`
 * so a misconfigured deployment fails at boot rather than at first request.
 *
 * Server-only: the browser build cannot see `DATABASE_URL` or the cookie
 * secret, so importing this module from client code would always throw.
 */
export const env = parseEnv(process.env);
