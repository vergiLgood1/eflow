import { expect, test } from "bun:test";

// Importing ./env validates `process.env` at module load, so pin the required
// variables first to keep this file independent of a local .env.
process.env.DATABASE_URL ??= "postgresql://user:pass@localhost:5432/eflow-test";
process.env.NEON_AUTH_BASE_URL ??= "https://auth.example.com";
process.env.NEON_AUTH_COOKIE_SECRET ??= "a".repeat(32);

const { parseEnv } = await import("@/shared/lib/env");

function buildValidEnv(overrides: Record<string, string | undefined> = {}) {
  return {
    NODE_ENV: "development",
    DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    NEON_AUTH_BASE_URL: "https://auth.example.com",
    NEON_AUTH_COOKIE_SECRET: "a".repeat(32),
    ...overrides,
  };
}

test("accepts a complete environment and defaults NODE_ENV", () => {
  // Arrange
  const source = buildValidEnv({ NODE_ENV: undefined });

  // Act
  const result = parseEnv(source);

  // Assert
  expect(result.NODE_ENV).toBe("development");
  expect(result.DATABASE_URL).toBe("postgresql://user:pass@localhost:5432/db");
});

test("throws naming every missing required variable", () => {
  // Act
  const act = () => parseEnv({});

  // Assert
  expect(act).toThrow(/DATABASE_URL/);
});

test("rejects a Neon Auth cookie secret shorter than the SDK minimum", () => {
  // Arrange
  const source = buildValidEnv({ NEON_AUTH_COOKIE_SECRET: "too-short" });

  // Act
  const act = () => parseEnv(source);

  // Assert
  expect(act).toThrow(/NEON_AUTH_COOKIE_SECRET/);
});

test("falls back to development for an unrecognized NODE_ENV", () => {
  // Arrange
  const source = buildValidEnv({ NODE_ENV: "staging" });

  // Act
  const result = parseEnv(source);

  // Assert
  expect(result.NODE_ENV).toBe("development");
});

test("rejects a malformed Neon Auth base URL", () => {
  // Arrange
  const source = buildValidEnv({ NEON_AUTH_BASE_URL: "not-a-url" });

  // Act
  const act = () => parseEnv(source);

  // Assert
  expect(act).toThrow(/NEON_AUTH_BASE_URL/);
});
