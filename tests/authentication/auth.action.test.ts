import { beforeEach, expect, mock, spyOn, test } from "bun:test";

import { Prisma } from "../../prisma/generated";

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

const deleteUserMock = mock(
  async (): Promise<Outcome> => ({
    data: null,
    error: null,
  }),
);

mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: {
    signOut: signOutMock,
    signUp: { email: signUpEmailMock },
    deleteUser: deleteUserMock,
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

const { signUpWithEmail, signOut } =
  await import("@/features/authentication/applications/auth.action");

const validSignUp = {
  name: "Di Yoan",
  email: "diyoan@example.com",
  password: "supersecret",
};

// Call history is process-wide for this file; each test asserts its own.
beforeEach(() => {
  signUpEmailMock.mockClear();
  createUserMock.mockClear();
  deleteUserMock.mockClear();
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
  expect(deleteUserMock).not.toHaveBeenCalled();
});

test("rolls the provider user back and hides raw database errors", async () => {
  // Arrange: the local write dies after the provider already minted an id.
  createUserMock.mockRejectedValueOnce(new Error("database unavailable"));
  const logSpy = spyOn(console, "error").mockImplementation(() => {});

  try {
    // Act
    const result = await signUpWithEmail(validSignUp);

    // Assert: compensation runs, and the browser sees a message written for
    // users — the driver's wording only reaches the server log.
    expect(deleteUserMock).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(
        "Failed to create your account. Please try again.",
      );
      expect(result.statusCode).toBe(500);
    }
    expect(logSpy).toHaveBeenCalledWith(
      "Sign-up failed while creating the local user row:",
      expect.any(Error),
    );
  } finally {
    logSpy.mockRestore();
  }
});

test("keeps the safe sign-up message when provider cleanup also fails", async () => {
  // Arrange: local write fails, then the compensating delete fails too.
  createUserMock.mockRejectedValueOnce(new Error("database unavailable"));
  deleteUserMock.mockRejectedValueOnce(new Error("provider unreachable"));
  const logSpy = spyOn(console, "error").mockImplementation(() => {});

  try {
    // Act
    const result = await signUpWithEmail(validSignUp);

    // Assert: the orphan and both raw errors are logged for a human, while
    // the response keeps the user-facing message.
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(
        "Failed to create your account. Please try again.",
      );
    }
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("usr_123"));
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("provider unreachable"),
    );
    expect(logSpy).toHaveBeenCalledWith(
      "Sign-up failed while creating the local user row:",
      expect.any(Error),
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

  // Assert: the friendly AppError passes through untouched.
  expect(deleteUserMock).toHaveBeenCalledTimes(1);
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
  expect(deleteUserMock).not.toHaveBeenCalled();
});
