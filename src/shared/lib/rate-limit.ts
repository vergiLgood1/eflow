import { createHash } from "node:crypto";

import { db } from "@/db/prisma";
import { AppError } from "@/shared/lib/error";
import { headers } from "next/headers";

/** How often a stale row is swept, as a fraction of calls (1-in-N). */
const CLEANUP_ODDS = 50;

/** Rows untouched for this long can no longer affect any decision. */
const RETENTION_MS = 24 * 60 * 60 * 1000;

/**
 * Fixed-window rate limiter, counted in Postgres.
 *
 * The obvious alternative — a `Map` in module scope, like
 * `email/idempotency-cache.ts` — is wrong here. That cache tolerates a miss
 * because the cost of the miss is one duplicate email. The cost of a miss here
 * is an unmetered mail relay, and on a serverless platform the number of live
 * instances is not something this app controls, so a per-process counter is
 * multiplied by the very concurrency an attacker brings. The database is the
 * only counter all instances share.
 *
 * One row per key, overwritten in place, so the table is bounded by the number
 * of distinct keys rather than by request volume.
 *
 * Fails **closed**: if the counter cannot be read, the guarded action does not
 * run. These actions exist to send mail, so an unavailable limiter is an
 * abuse-control outage and must not silently become an open relay.
 *
 * @throws {AppError} 429 when the key is over its limit.
 */
export async function assertWithinRateLimit(input: {
  /** Namespaced so two limits on the same value cannot collide. */
  readonly scope: string;
  /** Stable identifier within the scope. Hashed if it is user-supplied. */
  readonly identifier: string;
  readonly limit: number;
  readonly windowMs: number;
}): Promise<void> {
  const key = `${input.scope}:${input.identifier}`;
  const now = Date.now();

  void sweepStaleRows(now);

  try {
    const rows = await db.$queryRaw<{ count: number }[]>`
      INSERT INTO "rate_limits" ("key", "windowStart", "count")
      VALUES (${key}, ${new Date(now)}, 1)
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN "rate_limits"."windowStart" < ${new Date(now - input.windowMs)}
            THEN 1
          ELSE "rate_limits"."count" + 1
        END,
        "windowStart" = CASE
          WHEN "rate_limits"."windowStart" < ${new Date(now - input.windowMs)}
            THEN ${new Date(now)}
          ELSE "rate_limits"."windowStart"
        END
      RETURNING "count"
    `;

    if ((rows[0]?.count ?? 0) > input.limit) {
      throw new AppError(
        "Too many attempts. Please wait a few minutes and try again.",
        429,
        "RATE_LIMITED",
      );
    }
  } catch (error) {
    // Re-thrown untouched: the 429 is a decision, not a failure of the counter.
    if (error instanceof AppError) throw error;

    console.error("Rate limit counter unavailable; refusing the action:", error);
    throw new AppError(
      "We could not process your request. Please try again.",
      503,
      "RATE_LIMIT_UNAVAILABLE",
    );
  }
}

/**
 * Hashes a value into a rate-limit key.
 *
 * Callers pass email addresses, and the throttle table is the one place an
 * operator could read every address anyone has probed. Hashing keeps addresses
 * out of it while still making the key stable, which is all a counter needs.
 */
export function hashIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

/**
 * Best-effort caller address, from the proxy's forwarding header.
 *
 * Returns `"unknown"` when the header is absent or unparseable. That collapses
 * such callers onto one shared bucket, which is the safe direction to fail: it
 * limits them, it does not exempt them.
 */
export async function getCallerIp(): Promise<string> {
  const forwarded = (await headers()).get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();

  return first || "unknown";
}

/**
 * Deletes windows old enough that no live limit can consult them again.
 *
 * Fire-and-forget and rate-limited by `CLEANUP_ODDS`: without it the table grows
 * by one row per distinct key forever, since a key is overwritten only when that
 * same key is seen again.
 */
function sweepStaleRows(now: number): void {
  if (Math.random() > 1 / CLEANUP_ODDS) return;

  try {
    db.$executeRaw`
      DELETE FROM "rate_limits" WHERE "windowStart" < ${new Date(now - RETENTION_MS)}
    `.catch((error: unknown) => {
      console.error("Rate limit sweep failed:", error);
    });
  } catch (error) {
    // Housekeeping must never be able to fail the action it is protecting.
    console.error("Rate limit sweep could not run:", error);
  }
}