import { expect, mock, test } from "bun:test";

import { Prisma } from "../../prisma/generated";

type CreateArgs = { data?: unknown };

const createMock = mock(
  async (_args: CreateArgs): Promise<unknown> => ({
    id: "usr_123",
  }),
);
const deleteMock = mock(
  async (_args: CreateArgs): Promise<unknown> => ({
    id: "usr_123",
  }),
);
const findUniqueMock = mock(async (_args: CreateArgs): Promise<unknown> => null);

mock.module("@/db/prisma", () => ({
  db: { user: { create: createMock, delete: deleteMock, findUnique: findUniqueMock } },
}));

// Mock the leaf the SDK client lives in, the same way every other guard test
// does, so the real requireUser() runs against this session. Mocking
// auth-guard itself would replace that module for every other test file, since
// Bun's mock.module is process-wide.
const getSessionMock = mock(
  async (): Promise<unknown> => ({
    data: { user: { id: "usr_123", email: "diyoan@example.com" } },
  }),
);

mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: { getSession: getSessionMock },
}));

const { assertEmailAvailable, deleteCurrentAccount, registerUser } =
  await import("@/features/account/applications/user-record");

test("passes when no user holds the address", async () => {
  // Act
  await assertEmailAvailable("free@example.com");

  // Assert
  expect(findUniqueMock).toHaveBeenCalledWith({
    where: { email: "free@example.com" },
    select: { id: true },
  });
});

test("reports the address as taken when a row already exists", async () => {
  // Arrange
  findUniqueMock.mockResolvedValueOnce({ id: "usr_existing" });

  // Act
  const attempt = assertEmailAvailable("taken@example.com");

  // Assert: same conflict `registerUser` raises, so the user sees one message
  // whether the clash was spotted up front or by the unique index.
  await expect(attempt).rejects.toMatchObject({
    message: "Email already exists",
    statusCode: 400,
  });
});

test("creates the local row for an identity the provider accepted", async () => {
  // Act
  const user = await registerUser({
    id: "usr_123",
    name: "Di Yoan",
    email: "diyoan@example.com",
  });

  // Assert
  expect(user).toMatchObject({ id: "usr_123" });
  expect(createMock).toHaveBeenCalled();
});

test("maps a unique-constraint race to a friendly email conflict", async () => {
  // Arrange: two sign-ups racing on the same email hit the unique index.
  createMock.mockRejectedValueOnce(
    new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "7.8.0",
    }),
  );

  // Act
  const attempt = registerUser({
    id: "usr_456",
    name: "Racer",
    email: "taken@example.com",
  });

  // Assert
  await expect(attempt).rejects.toMatchObject({
    message: "Email already exists",
    statusCode: 400,
  });
});

test("rejects a delete confirmation that is not the caller's own email", async () => {
  // Act
  const attempt = deleteCurrentAccount({
    confirmEmail: "someone-else@example.com",
  });

  // Assert
  await expect(attempt).rejects.toMatchObject({ statusCode: 422 });
  expect(deleteMock).not.toHaveBeenCalled();
});

test("deletes the account when the confirmation email matches", async () => {
  // Act
  const result = await deleteCurrentAccount({
    confirmEmail: "DiYoan@Example.com ",
  });

  // Assert: comparison is case-insensitive and whitespace-tolerant.
  expect(result).toEqual({ id: "usr_123" });
  expect(deleteMock).toHaveBeenCalledWith({ where: { id: "usr_123" } });
});
