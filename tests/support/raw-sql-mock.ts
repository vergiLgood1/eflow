import { mock } from "bun:test";

/**
 * The suite's single source for raw-SQL behaviour.
 *
 * Bun's `mock.module` is process-wide and first-evaluation-wins, so every file
 * that registers `@/db/prisma` effectively defines the `db` that *all* files see.
 * That works only while each file's mock happens to carry every method some other
 * file's code touches — which is why `$queryRaw` belongs here rather than in one
 * file: `shared/lib/rate-limit.ts` counts through it, and no individual feature
 * test has any reason to know that.
 *
 * The default is "under the limit", so a test that is not about rate limiting
 * does not have to configure anything.
 */
export const queryRawMock = mock(
  async (..._args: unknown[]): Promise<{ count: number }[]> => [{ count: 1 }],
);

export const executeRawMock = mock(async (..._args: unknown[]): Promise<number> => 0);

/** Spread into any `@/db/prisma` registration so `$queryRaw` is never missing. */
export const RAW_SQL_MOCKS = {
  $queryRaw: queryRawMock,
  $executeRaw: executeRawMock,
} as const;

/**
 * Fixed caller address. `rate-limit.ts` reads it through `next/headers`, which
 * only exists inside a request scope, so unit tests have to supply one.
 */
export const TEST_CALLER_IP = "203.0.113.7";

mock.module("next/headers", () => ({
  headers: async () =>
    new Headers({ "x-forwarded-for": `${TEST_CALLER_IP}, 70.41.3.18` }),
}));