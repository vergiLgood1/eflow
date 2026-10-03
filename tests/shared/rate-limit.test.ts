import { beforeEach, expect, mock, spyOn, test } from "bun:test";

import {
  executeRawMock,
  queryRawMock,
  TEST_CALLER_IP,
} from "../support/raw-sql-mock";

mock.module("@/db/prisma", () => ({
  db: { $queryRaw: queryRawMock, $executeRaw: executeRawMock },
}));

const { assertWithinRateLimit, getCallerIp, hashIdentifier } = await import(
  "@/shared/lib/rate-limit"
);

const budget = {
  scope: "verification-resend:address",
  identifier: "abc",
  limit: 3,
  windowMs: 60_000,
};

beforeEach(() => {
  queryRawMock.mockClear();
  queryRawMock.mockResolvedValue([{ count: 1 }]);
  executeRawMock.mockClear();
});

test("allows a request inside the limit", async () => {
  // Arrange
  queryRawMock.mockResolvedValueOnce([{ count: 3 }]);

  // Act / Assert: reaching the limit exactly is still allowed.
  await assertWithinRateLimit(budget);
});

test("refuses the request that exceeds the limit", async () => {
  // Arrange
  queryRawMock.mockResolvedValueOnce([{ count: 4 }]);

  // Act
  const attempt = assertWithinRateLimit(budget);

  // Assert
  await expect(attempt).rejects.toMatchObject({
    statusCode: 429,
    code: "RATE_LIMITED",
  });
});

test("reports an over-limit decision as 429 rather than as a broken counter", async () => {
  // Arrange: the 429 is thrown inside the same try that catches database
  // failures, so it has to be re-thrown untouched or the caller cannot tell a
  // rate limit from an outage.
  queryRawMock.mockResolvedValueOnce([{ count: 99 }]);

  // Act
  const attempt = assertWithinRateLimit(budget);

  // Assert
  await expect(attempt).rejects.toMatchObject({ code: "RATE_LIMITED" });
});

test("fails closed when the counter cannot be read", async () => {
  // Arrange: these actions exist to send mail, so an unavailable limiter must
  // not quietly become an open relay.
  queryRawMock.mockRejectedValueOnce(new Error("connection terminated"));
  const logSpy = spyOn(console, "error").mockImplementation(() => {});

  try {
    // Act
    const attempt = assertWithinRateLimit(budget);

    // Assert
    await expect(attempt).rejects.toMatchObject({
      statusCode: 503,
      code: "RATE_LIMIT_UNAVAILABLE",
    });
    expect(logSpy).toHaveBeenCalled();
  } finally {
    logSpy.mockRestore();
  }
});

test("counts in one atomic statement so concurrent callers cannot race past", async () => {
  // Act
  await assertWithinRateLimit(budget);

  // Assert: a read-then-write would let two simultaneous requests both observe
  // count=limit-1 and both be admitted.
  expect(queryRawMock).toHaveBeenCalledTimes(1);
});

test("keeps addresses out of the throttle table", async () => {
  // Act
  const hashed = hashIdentifier("victim@example.com");

  // Assert: the table is the one place an operator could read every address an
  // attacker has probed.
  expect(hashed).not.toContain("victim");
  expect(hashed).toMatch(/^[0-9a-f]{32}$/);
  expect(hashIdentifier("victim@example.com")).toBe(hashed);
});

test("reads the caller's address from the left-most forwarding entry", async () => {
  // Act
  const ip = await getCallerIp();

  // Assert: that is the originating client, not the nearest proxy hop.
  expect(ip).toBe(TEST_CALLER_IP);
});