import { expect, mock, test } from "bun:test";

type SessionOutcome = { data: { user: { id: string; name: string } } | null };

const getSessionMock = mock(
  async (): Promise<SessionOutcome> => ({
    data: null,
  }),
);

mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: { getSession: getSessionMock },
}));

const { requireUser } =
  await import("@/features/authentication/lib/auth-guard");

test("returns the session user when a session exists", async () => {
  // Arrange
  getSessionMock.mockImplementationOnce(async () => ({
    data: { user: { id: "user-1", name: "Ada" } },
  }));

  // Act
  const user = await requireUser();

  // Assert
  expect(user.id).toBe("user-1");
});

test("fails with 401 when there is no session", async () => {
  // Arrange
  getSessionMock.mockImplementationOnce(async () => ({ data: null }));

  // Act
  const attempt = requireUser();

  // Assert
  await expect(attempt).rejects.toMatchObject({
    message: "Unauthorized",
    statusCode: 401,
  });
});
