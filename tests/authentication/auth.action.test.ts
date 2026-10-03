import { beforeEach, expect, mock, spyOn, test } from "bun:test";

import { Prisma } from "../../prisma/generated";

// `revalidatePath` requires the Next.js request context, which is absent in unit tests.
mock.module("next/cache", () => ({ revalidatePath: mock() }));

type Outcome<T = unknown> = {
  data: T;
  error: { code?: string; message: string } | null;
};

const signOutMock = mock(
  async (): Promise<Outcome> => ({
    data: null,
    error: null,
  }),
);

const signUpEmailMock = mock(
  async (
    _body: unknown,
  ): Promise<Outcome<{ user: { id: string; emailVerified: boolean } } | null>> => ({
    data: { user: { id: "usr_123", emailVerified: true } },
    error: null,
  }),
);

const signInEmailMock = mock(
  async (_body: unknown): Promise<Outcome> => ({
    data: { user: { id: "usr_123" } },
    error: null,
  }),
);

const sendVerificationEmailMock = mock(
  async (_body: unknown): Promise<Outcome> => ({
    data: null,
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
    signIn: { email: signInEmailMock },
    sendVerificationEmail: sendVerificationEmailMock,
    deleteUser: deleteUserMock,
  },
}));

const createUserMock = mock(
  async (_args: unknown): Promise<unknown> => ({
    id: "usr_123",
  }),
);

// Availability pre-check. `null` is the common case: the address is free.
const findUserMock = mock(async (_args: unknown): Promise<unknown> => null);

mock.module("@/db/prisma", () => ({
  db: {
    user: { create: createUserMock, findUnique: findUserMock },
  },
}));

const {
  resendVerificationEmail,
  signUpWithEmail,
  signInWithEmail,
  signOut,
} = await import("@/features/authentication/applications/auth.action");

const validSignUp = {
  name: "Di Yoan",
  email: "diyoan@example.com",
  password: "supersecret",
};

const validSignIn = {
  email: "diyoan@example.com",
  password: "supersecret",
};

// Call history is process-wide for this file; each test asserts its own.
beforeEach(() => {
  signUpEmailMock.mockClear();
  signInEmailMock.mockClear();
  sendVerificationEmailMock.mockClear();
  createUserMock.mockClear();
  deleteUserMock.mockClear();
  signOutMock.mockClear();
  findUserMock.mockClear();
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

test("routes to check-inbox when Neon withholds the session pending verification", async () => {
  // Arrange: verification is required, so sign-up succeeds with no session.
  // Neon signals this in the payload, never as an error.
  signUpEmailMock.mockResolvedValueOnce({
    data: { user: { id: "usr_123", emailVerified: false } },
    error: null,
  });

  // Act
  const result = await signUpWithEmail(validSignUp);

  // Assert: onboarding would bounce straight back to sign-in with no session.
  expect(result).toEqual({
    success: true,
    message: "Account created. Check your inbox to verify your email.",
    redirectTo: "/auth/check-inbox",
  });
  // The local row still lands, so the address is not retried as new forever.
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

test("refuses a duplicate sign-up before the provider is asked to mint an identity", async () => {
  // Arrange: this app already holds a row for the address. Reaching Neon would
  // accept the sign-up and leave an identity nothing can delete — the account
  // has no session, so the compensating delete answers Unauthorized.
  findUserMock.mockResolvedValueOnce({ id: "usr_existing" });

  // Act
  const result = await signUpWithEmail(validSignUp);

  // Assert: no identity is minted, so there is nothing to orphan.
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error).toBe("Email already exists");
    expect(result.statusCode).toBe(400);
  }
  expect(signUpEmailMock).not.toHaveBeenCalled();
  expect(createUserMock).not.toHaveBeenCalled();
  expect(deleteUserMock).not.toHaveBeenCalled();
});

test("sends an unconfirmed sign-in back to check-inbox and re-sends the link", async () => {
  // Arrange: the provider recognises the account but withholds the session.
  // Neon only re-sends on its own when its `sendOnSignIn` option is enabled,
  // which this app cannot observe.
  signInEmailMock.mockResolvedValueOnce({
    data: null,
    error: { code: "EMAIL_NOT_VERIFIED", message: "Email not verified" },
  });

  // Act
  const result = await signInWithEmail(validSignIn);

  // Assert: a dead end for the user, not a rejection.
  expect(result).toEqual({
    success: true,
    message: "Please verify your email address before signing in.",
    redirectTo: "/auth/check-inbox",
  });
  expect(sendVerificationEmailMock).toHaveBeenCalledTimes(1);
  expect(sendVerificationEmailMock).toHaveBeenCalledWith(
    expect.objectContaining({ email: "diyoan@example.com" }),
  );
});

test("still redirects to check-inbox when the re-send itself fails", async () => {
  // Arrange
  signInEmailMock.mockResolvedValueOnce({
    data: null,
    error: { code: "EMAIL_NOT_VERIFIED", message: "Email not verified" },
  });
  sendVerificationEmailMock.mockResolvedValueOnce({
    data: null,
    error: { message: "smtp unavailable" },
  });
  const logSpy = spyOn(console, "error").mockImplementation(() => {});

  try {
    // Act
    const result = await signInWithEmail(validSignIn);

    // Assert: delivery trouble is not the user's problem, and the screen they
    // land on still has a manual resend button.
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.redirectTo).toBe("/auth/check-inbox");
    }
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("smtp unavailable"),
    );
  } finally {
    logSpy.mockRestore();
  }
});

test("does not re-send when the sign-in problem is the password", async () => {
  // Arrange: a wrong password must never trigger a verification email, or the
  // action becomes a mail gun pointed at addresses an attacker supplies.
  signInEmailMock.mockResolvedValueOnce({
    data: null,
    error: { code: "INVALID_EMAIL_OR_PASSWORD", message: "Invalid email or password" },
  });

  // Act
  const result = await signInWithEmail(validSignIn);

  // Assert
  expect(result.success).toBe(false);
  expect(sendVerificationEmailMock).not.toHaveBeenCalled();
});

