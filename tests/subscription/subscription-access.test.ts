import { expect, mock, test } from "bun:test";
import { RAW_SQL_MOCKS } from "../support/raw-sql-mock";

const findUniqueMock = mock(
  async (_args: { where?: unknown }): Promise<unknown> => ({
    plan: "FREE",
    status: "ACTIVE",
  }),
);
const workspaceCountMock = mock(async (_args: { where?: unknown }) => 1);
const dataModelCountMock = mock(async (_args: { where?: unknown }) => 0);

mock.module("@/db/prisma", () => ({
  db: { ...RAW_SQL_MOCKS,
    subscription: { findUnique: findUniqueMock },
    workspace: { count: workspaceCountMock },
    dataModel: { count: dataModelCountMock },
  },
}));

const { requireCanCreateDataModel, requireCanCreateWorkspace } =
  await import("@/features/subscription/applications/subscription-access");

test("blocks a free plan user who already holds the one workspace", async () => {
  // Act
  const attempt = requireCanCreateWorkspace("user-1");

  // Assert
  await expect(attempt).rejects.toMatchObject({
    statusCode: 403,
    code: "SUBSCRIPTION_LIMIT_REACHED",
  });
});

test("lets a pro user create another workspace without counting", async () => {
  // Arrange
  findUniqueMock.mockResolvedValueOnce({ plan: "PRO", status: "ACTIVE" });
  workspaceCountMock.mockClear();

  // Act
  await requireCanCreateWorkspace("user-1");

  // Assert: the unlimited path skips the count query entirely.
  expect(workspaceCountMock).not.toHaveBeenCalled();
});

test("blocks a private model on the free plan", async () => {
  // Act
  const attempt = requireCanCreateDataModel("user-1", "ws-1", false);

  // Assert
  await expect(attempt).rejects.toMatchObject({
    statusCode: 403,
    code: "SUBSCRIPTION_PRIVATE_MODEL_REQUIRED",
  });
});
