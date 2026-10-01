import { expect, mock, test } from "bun:test";

type ActivityQuery = {
  where?: Record<string, unknown>;
  select?: Record<string, unknown>;
};

const findManyMock = mock(
  async (_query: ActivityQuery): Promise<unknown[]> => [],
);

mock.module("@/db/prisma", () => ({
  db: { activityLog: { findMany: findManyMock } },
}));

const requireMemberMock = mock(async (_slug: string) => ({
  user: { id: "user-1" },
  workspace: { id: "ws-1", slug: "acme" },
}));

mock.module("@/features/workspace/applications/workspace-access", () => ({
  requireWorkspaceMemberBySlug: requireMemberMock,
}));

const { getActivityLogs, getActivityStats } = await import("./activity.action");

test("selects only the actor name, never the whole user row", async () => {
  // Act
  await getActivityLogs("acme");

  // Assert: a full user row would expose email and profile fields.
  const query = findManyMock.mock.calls.at(-1)?.[0];
  expect(query?.select).toEqual({
    id: true,
    action: true,
    details: true,
    createdAt: true,
    user: { select: { name: true } },
    dataModel: { select: { name: true } },
  });
});

test("scopes both queries to the resolved workspace id", async () => {
  // Act
  await Promise.all([getActivityLogs("acme"), getActivityStats("acme")]);

  // Assert
  for (const call of findManyMock.mock.calls.slice(-2)) {
    expect(call[0]?.where).toMatchObject({
      dataModel: { workspaceId: "ws-1" },
    });
  }
});

test("fails closed when the caller is not a member of the workspace", async () => {
  // Arrange
  requireMemberMock.mockRejectedValueOnce(new Error("Forbidden"));

  // Act & Assert: the read never reaches the database.
  const callsBefore = findManyMock.mock.calls.length;
  await expect(getActivityLogs("other-workspace")).rejects.toThrow();
  expect(findManyMock.mock.calls.length).toBe(callsBefore);
});
