import { beforeEach, expect, mock, spyOn, test } from "bun:test";

// `revalidatePath` requires the Next.js request context, absent in unit tests.
mock.module("next/cache", () => ({ revalidatePath: mock() }));

const getSessionMock = mock(
  async (): Promise<unknown> => ({
    data: { user: { id: "usr_123", email: "diyoan@example.com" } },
  }),
);

const signOutMock = mock(async (): Promise<unknown> => ({ error: null }));

const removeUserMock = mock(
  async (_body: { userId: string }): Promise<unknown> => ({ error: null }),
);

// Mock the leaf the SDK client lives in (the same leaf every guard test
// mocks) so the real requireUser(), endProviderSession() and
// removeProviderUser() all run against one controllable session.
mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: {
    getSession: getSessionMock,
    signOut: signOutMock,
    admin: { removeUser: removeUserMock },
  },
}));

const deleteMock = mock(
  async (_args: unknown): Promise<unknown> => ({
    id: "usr_123",
  }),
);

mock.module("@/db/prisma", () => ({
  db: { user: { delete: deleteMock } },
}));

const { deleteAccount } = await import("./account.action");

// Call history is process-wide for this file; each test asserts its own.
beforeEach(() => {
  deleteMock.mockClear();
  signOutMock.mockClear();
  removeUserMock.mockClear();
  getSessionMock.mockClear();
});

test("deletes locally, signs out, then removes the provider user", async () => {
  // Act
  const result = await deleteAccount({
    confirmEmail: "DiYoan@Example.com ",
  });

  // Assert: local row first, provider housekeeping after it.
  expect(deleteMock).toHaveBeenCalledWith({ where: { id: "usr_123" } });
  expect(signOutMock).toHaveBeenCalledTimes(1);
  expect(removeUserMock).toHaveBeenCalledWith({ userId: "usr_123" });
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
  expect(removeUserMock).not.toHaveBeenCalled();
});

test("still reports success when provider cleanup fails", async () => {
  // Arrange: local delete works, sign-out works, provider removal breaks.
  removeUserMock.mockRejectedValueOnce(new Error("provider unreachable"));
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
