import { expect, mock, test } from "bun:test";
import { RAW_SQL_MOCKS } from "../support/raw-sql-mock";

const findUniqueMock = mock(async (_args: unknown): Promise<unknown> => null);

mock.module("@/db/prisma", () => ({
  db: { ...RAW_SQL_MOCKS, workspace: { findUnique: findUniqueMock } },
}));

const getSessionMock = mock(async (): Promise<unknown> => ({ data: null }));

mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: { getSession: getSessionMock },
}));

const { requireWorkspaceMemberBySlug } =
  await import("@/features/workspace/applications/workspace-access");

test("rejects a caller without a session", async () => {
  // Arrange
  getSessionMock.mockResolvedValueOnce({ data: null });

  // Act
  const attempt = requireWorkspaceMemberBySlug("acme");

  // Assert
  await expect(attempt).rejects.toMatchObject({ statusCode: 401 });
});

test("treats an unknown slug and an unauthorised slug the same way", async () => {
  // Arrange: the workspace exists, but the session user is not in it.
  getSessionMock.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
  findUniqueMock.mockResolvedValueOnce({
    id: "ws-1",
    slug: "acme",
    members: [],
  });

  // Act
  const attempt = requireWorkspaceMemberBySlug("acme");

  // Assert
  await expect(attempt).rejects.toMatchObject({ statusCode: 403 });
});

test("returns the workspace id for a member", async () => {
  // Arrange
  getSessionMock.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
  findUniqueMock.mockResolvedValueOnce({
    id: "ws-1",
    slug: "acme",
    members: [{ id: "membership-1" }],
  });

  // Act
  const { user, workspace } = await requireWorkspaceMemberBySlug("acme");

  // Assert
  expect(user.id).toBe("user-1");
  expect(workspace.id).toBe("ws-1");
});
