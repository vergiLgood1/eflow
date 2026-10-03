-- Fixed-window counter backing the pre-authentication email senders
-- (`resendVerificationEmail`, `forgotPassword`), which are network-reachable and
-- would otherwise let anyone email-bomb an address or drain the Resend quota.
CREATE TABLE "rate_limits" (
  "key" TEXT NOT NULL,
  "windowStart" TIMESTAMP(3) NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("key")
);
