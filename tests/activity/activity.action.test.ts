import { expect, mock, test } from "bun:test";
import { RAW_SQL_MOCKS } from "../support/raw-sql-mock";

type ActivityQuery = {
  where?: Record<string, unknown>;
  select?: Record<string, unknown>;
};

const findManyMock = mock(
  async (_query: ActivityQuery): Promise<unknown[]> => [],
);

const getSessionMock = mock(
  async (): Promise<unknown> => ({
    data: { user: { id: "user-1" } },
  }),
);

const findWorkspaceMock = mock(
  async (_args: unknown): Promise<unknown> => ({
    id: "ws-1",
    slug: "acme",
    members: [{ id: "membership-1" }],
  }),
);

// Mock only leaves — the session and the database — so the real
// requireWorkspaceMemberBySlug runs against them. `mock.module` is
// process-wide: faking the intermediate workspace-access module here would
// leak into every later test file instead of staying scoped to this one.
mock.module("@/db/prisma", () => ({
  db: { ...RAW_SQL_MOCKS,
    activityLog: { findMany: findManyMock },
    workspace: { findUnique: findWorkspaceMock },
  },
}));

mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: { getSession: getSessionMock },
}));

const { getActivityLogs, getActivityStats } =
  await import("@/features/activity/applications/activity.action");

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
  // Arrange: the workspace exists but has no membership for this caller, so
  // the real guard throws 403 before any activity query runs.
  findWorkspaceMock.mockResolvedValueOnce({
    id: "ws-other",
    slug: "other-workspace",
    members: [],
  });

  // Act & Assert: the read never reaches the database.
  const callsBefore = findManyMock.mock.calls.length;
  await expect(getActivityLogs("other-workspace")).rejects.toMatchObject({
    statusCode: 403,
  });
  expect(findManyMock.mock.calls.length).toBe(callsBefore);
});
