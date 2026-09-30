-- AlterTable
-- The app never authenticated against this column: credentials live in the Neon
-- Auth instance, so `users.password` held a duplicate bcrypt hash that could
-- only ever leak (it was returned by `select`-less Prisma updates).
ALTER TABLE "users" DROP COLUMN "password";
