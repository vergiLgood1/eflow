import { describe, expect, test } from "bun:test";

// NEXT_PUBLIC_APP_URL is pinned to http://localhost:3000 by tests/setup.ts.
const { buildAppUrl, buildVerificationUrl } = await import(
  "@/features/authentication/lib/auth-urls"
);

describe("buildAppUrl", () => {
  test("returns an absolute URL, never a bare path", () => {
    // Neon Auth resolves a relative redirectTo against its own hosted domain,
    // so the reset link would dead-end on *.neonauth.*.neon.tech instead of
    // reaching the app. This assertion is the regression guard for that bug.
    const result = buildAppUrl("/auth/reset-password");

    expect(result).toBe("http://localhost:3000/auth/reset-password");
    expect(result.startsWith("http")).toBe(true);
  });

  test("normalises a missing leading slash", () => {
    expect(buildAppUrl("auth/sign-in")).toBe("http://localhost:3000/auth/sign-in");
  });
});

describe("buildVerificationUrl", () => {
  test("targets Neon Auth, not the app, because Neon owns token validation", () => {
    const result = new URL(
      buildVerificationUrl({
        token: "tok_123",
        redirectPath: "/auth/verify-email",
      }),
    );

    expect(result.origin).toBe("https://auth.example.com");
    expect(result.pathname).toBe("/verify-email");
    expect(result.searchParams.get("token")).toBe("tok_123");
  });

  test("sets callbackURL to an absolute app URL so the return trip lands here", () => {
    const result = new URL(
      buildVerificationUrl({
        token: "tok_123",
        redirectPath: "/auth/verify-email",
      }),
    );

    const callbackUrl = result.searchParams.get("callbackURL");

    expect(callbackUrl).toBe("http://localhost:3000/auth/verify-email");
    // The exact failure mode observed in production: a relative callbackURL
    // resolves against the Neon host.
    expect(callbackUrl?.startsWith("/")).toBe(false);
  });

  test("percent-encodes a token containing reserved characters", () => {
    const result = new URL(
      buildVerificationUrl({
        token: "a/b+c=d&e",
        redirectPath: "/auth/verify-email",
      }),
    );

    expect(result.searchParams.get("token")).toBe("a/b+c=d&e");
  });
});