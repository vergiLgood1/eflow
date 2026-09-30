import { expect, mock, test } from "bun:test";

// `revalidatePath` requires the Next.js request context, which is absent in unit tests.
mock.module("next/cache", () => ({ revalidatePath: mock() }));

type SignOutOutcome = { data: unknown; error: { message: string } | null };

const signOutMock = mock(async (): Promise<SignOutOutcome> => ({
  data: null,
  error: null,
}));

mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: { signOut: signOutMock },
}));

const { signOut } = await import("./auth.action");

test("returns the sign-in route when signing out succeeds", async () => {
  // Act
  const result = await signOut();

  // Assert
  expect(signOutMock).toHaveBeenCalledTimes(1);
  expect(result).toEqual({ success: true, redirectTo: "/auth/sign-in" });
});

test("reports failure when the auth provider rejects sign-out", async () => {
  // Arrange
  signOutMock.mockResolvedValueOnce({
    data: null,
    error: { message: "Invalid session" },
  });

  // Act
  const result = await signOut();

  // Assert
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error).toBe("Invalid session");
  }
});
