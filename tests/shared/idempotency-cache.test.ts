import { describe, expect, test } from "bun:test";

const { IdempotencyCache } = await import("@/shared/lib/email/idempotency-cache");

describe("IdempotencyCache", () => {
  test("claims an id only the first time", () => {
    // Arrange
    const cache = new IdempotencyCache();

    // Act
    const first = cache.claim("event-1");
    const second = cache.claim("event-1");

    // Assert
    expect(first).toBe(true);
    expect(second).toBe(false);
  });

  test("treats distinct ids as distinct work", () => {
    // Arrange
    const cache = new IdempotencyCache();

    // Act / Assert
    expect(cache.claim("event-1")).toBe(true);
    expect(cache.claim("event-2")).toBe(true);
  });

  test("re-claims a released id so a provider retry is not swallowed", () => {
    // Arrange — Neon re-delivers with the same id after a 5xx; if the failed
    // attempt kept its claim, the retry would be dropped as a duplicate.
    const cache = new IdempotencyCache();
    cache.claim("event-1");

    // Act
    cache.release("event-1");

    // Assert
    expect(cache.claim("event-1")).toBe(true);
  });

  test("forgets an id once its ttl elapses", async () => {
    // Arrange — a 1ms ttl, then wait past it.
    const cache = new IdempotencyCache(1);
    cache.claim("event-1");
    await Bun.sleep(5);

    // Act
    const result = cache.claim("event-1");

    // Assert
    expect(result).toBe(true);
  });

  test("evicts the least recently claimed entry past the size cap", () => {
    // Arrange
    const cache = new IdempotencyCache(60_000, 2);
    cache.claim("a");
    cache.claim("b");

    // Act — this third claim overflows the cap and drops "a".
    cache.claim("c");

    // Assert — probe the survivors first, because claiming an absent id
    // inserts it and can itself trigger an eviction.
    expect(cache.claim("b")).toBe(false);
    expect(cache.claim("c")).toBe(false);
    expect(cache.claim("a")).toBe(true);
  });
});