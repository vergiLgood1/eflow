import { beforeEach, expect, mock, spyOn, test } from "bun:test";

// `revalidatePath` requires the Next.js request context, absent in unit tests.
mock.module("next/cache", () => ({ revalidatePath: mock() }));

const getSessionMock = mock(
  async (): Promise<unknown> => ({
    data: { user: { id: "usr_123", email: "diyoan@example.com" } },
  }),
);

// Order matters: provider removal only works while the session is still
// valid, so it must run before the sign-out sweep.
const callOrder: string[] = [];

const signOutMock = mock(async (): Promise<unknown> => {
  callOrder.push("signOut");
  return { error: null };
});

const deleteUserMock = mock(async (): Promise<unknown> => {
  callOrder.push("providerDelete");
  return { error: null };
});

// Mock the leaf the SDK client lives in (the same leaf every guard test
// mocks) so the real requireUser(), endProviderSession() and
// removeProviderUser() all run against one controllable session.
mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: {
    getSession: getSessionMock,
    signOut: signOutMock,
    deleteUser: deleteUserMock,
  },
}));

const deleteMock = mock(async (_args: unknown): Promise<unknown> => {
  callOrder.push("localDelete");
  return { id: "usr_123" };
});

mock.module("@/db/prisma", () => ({
  db: { user: { delete: deleteMock } },
}));

const { deleteAccount } = await import("./account.action");

// Call history is process-wide for this file; each test asserts its own.
beforeEach(() => {
  deleteMock.mockClear();
  signOutMock.mockClear();
  deleteUserMock.mockClear();
  getSessionMock.mockClear();
  callOrder.length = 0;
});

test("deletes locally, then removes the provider user before signing out", async () => {
  // Act
  const result = await deleteAccount({
    confirmEmail: "DiYoan@Example.com ",
  });

  // Assert: local row first, provider removal while the session is still
  // valid, cookie sweep last.
  expect(deleteMock).toHaveBeenCalledWith({ where: { id: "usr_123" } });
  expect(deleteUserMock).toHaveBeenCalledTimes(1);
  expect(signOutMock).toHaveBeenCalledTimes(1);
  expect(callOrder).toEqual(["localDelete", "providerDelete", "signOut"]);
  expect(result).toEqual({
    success: true,
    message: "Account deleted successfully",
    redirectTo: "/auth/sign-in",
  });
});

test("confirms the session email before touching either store", async () => {
  // Act
  const result = await deleteAccount({
    confirmEmail: "someone-else@example.com",
  });

  // Assert: a forged confirmation never reaches local or provider deletes.
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error).toBe("Confirmation email does not match this account");
  }
  expect(deleteMock).not.toHaveBeenCalled();
  expect(deleteUserMock).not.toHaveBeenCalled();
});

test("still reports success when provider cleanup fails", async () => {
  // Arrange: local delete works, provider removal breaks.
  deleteUserMock.mockRejectedValueOnce(new Error("provider unreachable"));
  const logSpy = spyOn(console, "error").mockImplementation(() => {});

  try {
    // Act
    const result = await deleteAccount({
      confirmEmail: "diyoan@example.com",
    });

    // Assert: the user asked for deletion, and it happened; the orphan is
    // logged with its id rather than surfacing as a false failure.
    expect(deleteMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: true,
      message: "Account deleted successfully",
      redirectTo: "/auth/sign-in",
    });
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("usr_123"));
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("provider unreachable"),
    );
  } finally {
    logSpy.mockRestore();
  }
});

test("still reports success when sign-out fails after deletion", async () => {
  // Arrange: endProviderSession swallows sign-out errors internally.
  signOutMock.mockRejectedValueOnce(new Error("cookie jar closed"));
  const logSpy = spyOn(console, "error").mockImplementation(() => {});

  try {
    // Act
    const result = await deleteAccount({
      confirmEmail: "diyoan@example.com",
    });

    // Assert: deletion must not roll back because the cookie could not clear.
    expect(deleteMock).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    expect(logSpy).toHaveBeenCalled();
  } finally {
    logSpy.mockRestore();
  }
});
