import { expect, test } from "bun:test";

// Importing ./env validates `process.env` at module load; tests/setup.ts pins
// the required variables first. Each test below passes an explicit source to
// `parseEnv`, so these process-level values never reach an assertion.
const { parseEnv } = await import("@/shared/lib/env");

function buildValidEnv(overrides: Record<string, string | undefined> = {}) {
  return {
    NODE_ENV: "development",
    DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    NEON_AUTH_BASE_URL: "https://auth.example.com",
    NEON_AUTH_COOKIE_SECRET: "a".repeat(32),
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    RESEND_API_KEY: "re_test",
    EMAIL_FROM: "EFlow <noreply@example.com>",
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

test("requires a Resend API key, because email delivery is load-bearing", () => {
  // Arrange — the Neon Auth send.magic_link webhook is the only path that
  // delivers password-reset and verification mail once it is subscribed.
  const source = buildValidEnv({ RESEND_API_KEY: undefined });

  // Act
  const act = () => parseEnv(source);

  // Assert
  expect(act).toThrow(/RESEND_API_KEY/);
});

test("requires an absolute app URL, because email links are built from it", () => {
  // Arrange — a relative value would resolve against Neon's hosted domain and
  // send password-reset links off-site.
  const source = buildValidEnv({ NEXT_PUBLIC_APP_URL: undefined });

  // Act
  const act = () => parseEnv(source);

  // Assert
  expect(act).toThrow(/NEXT_PUBLIC_APP_URL/);
});

test("rejects a sender address with no email in it", () => {
  // Arrange
  const source = buildValidEnv({ EMAIL_FROM: "EFlow" });

  // Act
  const act = () => parseEnv(source);

  // Assert
  expect(act).toThrow(/EMAIL_FROM/);
});
