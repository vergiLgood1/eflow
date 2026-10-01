import { beforeEach, expect, mock, spyOn, test } from "bun:test";

import { Prisma } from "../../../../prisma/generated";

// `revalidatePath` requires the Next.js request context, which is absent in unit tests.
mock.module("next/cache", () => ({ revalidatePath: mock() }));

type Outcome<T = unknown> = { data: T; error: { message: string } | null };

const signOutMock = mock(
  async (): Promise<Outcome> => ({
    data: null,
    error: null,
  }),
);

const signUpEmailMock = mock(
  async (
    _body: unknown,
  ): Promise<Outcome<{ user: { id: string } } | null>> => ({
    data: { user: { id: "usr_123" } },
    error: null,
  }),
);

const removeUserMock = mock(
  async (_body: { userId: string }): Promise<Outcome> => ({
    data: null,
    error: null,
  }),
);

mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: {
    signOut: signOutMock,
    signUp: { email: signUpEmailMock },
    admin: { removeUser: removeUserMock },
  },
}));

const createUserMock = mock(
  async (_args: unknown): Promise<unknown> => ({
    id: "usr_123",
  }),
);

mock.module("@/db/prisma", () => ({
  db: { user: { create: createUserMock } },
}));

const { signUpWithEmail, signOut } = await import("./auth.action");

const validSignUp = {
  name: "Di Yoan",
  email: "diyoan@example.com",
  password: "supersecret",
};

// Call history is process-wide for this file; each test asserts its own.
beforeEach(() => {
  signUpEmailMock.mockClear();
  createUserMock.mockClear();
  removeUserMock.mockClear();
  signOutMock.mockClear();
});

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

test("sign-up completes when the provider accepts and the local row lands", async () => {
  // Act
  const result = await signUpWithEmail(validSignUp);

  // Assert: no compensation for a flow that never failed.
  expect(result).toEqual({
    success: true,
    redirectTo: "/workspaces/onboarding",
  });
  expect(createUserMock).toHaveBeenCalledTimes(1);
  expect(removeUserMock).not.toHaveBeenCalled();
});

test("rolls the provider user back when the local row insert fails", async () => {
  // Arrange: the local write dies after the provider already minted an id.
  createUserMock.mockRejectedValueOnce(new Error("database unavailable"));

  // Act
  const result = await signUpWithEmail(validSignUp);

  // Assert: cleanup runs, and the original failure is what the user sees.
  expect(removeUserMock).toHaveBeenCalledWith({ userId: "usr_123" });
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error).toBe("database unavailable");
  }
});

test("keeps the original sign-up error when provider cleanup also fails", async () => {
  // Arrange: local write fails, then the compensating delete fails too.
  createUserMock.mockRejectedValueOnce(new Error("database unavailable"));
  removeUserMock.mockRejectedValueOnce(new Error("provider unreachable"));
  const logSpy = spyOn(console, "error").mockImplementation(() => {});

  try {
    // Act
    const result = await signUpWithEmail(validSignUp);

    // Assert: the orphan is logged for a human, never surfaced instead of
    // the error that explains the actual sign-up failure.
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("database unavailable");
    }
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("usr_123"));
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("provider unreachable"),
    );
  } finally {
    logSpy.mockRestore();
  }
});

test("treats a duplicate-email race as a conflict and still cleans up", async () => {
  // Arrange: both sign-ups passed the provider check; the unique index wins.
  createUserMock.mockRejectedValueOnce(
    new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "7.8.0",
    }),
  );

  // Act
  const result = await signUpWithEmail(validSignUp);

  // Assert
  expect(removeUserMock).toHaveBeenCalledWith({ userId: "usr_123" });
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error).toBe("Email already exists");
    expect(result.statusCode).toBe(400);
  }
});

test("never touches the database when the provider rejects sign-up", async () => {
  // Arrange
  signUpEmailMock.mockResolvedValueOnce({
    data: null,
    error: { message: "User already exists" },
  });

  // Act
  const result = await signUpWithEmail(validSignUp);

  // Assert: nothing was created, so nothing needs compensating.
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error).toBe("User already exists");
  }
  expect(createUserMock).not.toHaveBeenCalled();
  expect(removeUserMock).not.toHaveBeenCalled();
});
