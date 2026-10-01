import { expect, mock, test } from "bun:test";

type FindUnique = (args: unknown) => Promise<unknown>;

const findUniqueMock = mock<FindUnique>(async () => null);

mock.module("@/db/prisma", () => ({
  db: {
    dataModel: { findUnique: findUniqueMock },
    workspaceMember: { findUnique: mock(async () => null) },
  },
}));

const getSessionMock = mock(async () => ({ data: null as unknown }));

mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: { getSession: getSessionMock },
}));

const { requireMutableDataModel } =
  await import("@/features/model/applications/model-access");

test("rejects a caller without a session", async () => {
  // Arrange
  getSessionMock.mockResolvedValueOnce({ data: null });

  // Act
  const attempt = requireMutableDataModel("model-1");

  // Assert
  await expect(attempt).rejects.toMatchObject({ statusCode: 401 });
});

test("rejects a caller who is not a member of the owning workspace", async () => {
  // Arrange
  getSessionMock.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
  findUniqueMock.mockResolvedValueOnce({
    id: "model-1",
    name: "Orders",
    isPublic: false,
    isPinned: false,
    workspaceId: "ws-1",
    workspace: { members: [] },
  });

  // Act
  const attempt = requireMutableDataModel("model-1");

  // Assert
  await expect(attempt).rejects.toMatchObject({ statusCode: 403 });
});

test("reports a missing model without leaking it as a permission error", async () => {
  // Arrange
  getSessionMock.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
  findUniqueMock.mockResolvedValueOnce(null);

  // Act
  const attempt = requireMutableDataModel("missing-model");

  // Assert
  await expect(attempt).rejects.toMatchObject({ statusCode: 404 });
});

test("returns the model when the caller owns the workspace", async () => {
  // Arrange
  getSessionMock.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
  findUniqueMock.mockResolvedValueOnce({
    id: "model-1",
    name: "Orders",
    isPublic: false,
    isPinned: false,
    workspaceId: "ws-1",
    workspace: { members: [{ id: "membership-1" }] },
  });

  // Act
  const { user, model } = await requireMutableDataModel("model-1");

  // Assert
  expect(user.id).toBe("user-1");
  expect(model.id).toBe("model-1");
});
