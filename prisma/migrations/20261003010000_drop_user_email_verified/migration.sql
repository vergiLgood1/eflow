-- Drop `users.emailVerified`, which nothing has ever written.
--
-- The provider owns email confirmation: `proxy.ts` reads `emailVerified` off the
-- Neon Auth session, and sign-up reads it off the `signUp.email` payload. This
-- column was never populated -- not by `registerUser`, nor by the
-- `send.magic_link` webhook, which is the only event this app subscribes to --
-- so it was a nullable field that could only ever be NULL. Leftover from the
-- pre-Neon-Auth schema, where a local `verification` model existed.
ALTER TABLE "users" DROP COLUMN "emailVerified";
