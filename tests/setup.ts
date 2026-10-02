/**
 * Deterministic environment for the whole unit-test suite.
 *
 * `bun test` reads the developer's real `.env` through `dotenv/config`, so any
 * test that transitively imports `@/shared/lib/env` would otherwise inherit
 * local machine state. That failure mode is worse than it looks: `@/shared/lib/env`
 * throws at module load, so one variable missing from a developer's `.env` takes
 * down every test file in the suite rather than the one file that needed it.
 *
 * Assignments are unconditional so no test can read — or accidentally send mail
 * with — a real credential. `dotenv` never overwrites a variable that is already
 * set, so these values win even though `env.ts` loads dotenv afterwards.
 */

process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/eflow-test";
process.env.NEON_AUTH_BASE_URL = "https://auth.example.com";
process.env.NEON_AUTH_COOKIE_SECRET = "a".repeat(32);
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.RESEND_API_KEY = "re_test_key";
process.env.EMAIL_FROM = "EFlow <noreply@example.com>";