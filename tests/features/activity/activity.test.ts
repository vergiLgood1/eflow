import { describe, it, expect, vi, beforeEach } from "vitest";
import { syncModelSchema } from "@/features/model/applications/model.action";
import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";

// Mock the database and auth
vi.mock("@/db/prisma", () => ({
  db: {
    dataModel: { 
      findUnique: vi.fn(() => ({ 
        id: "model-1", 
        name: "Test Model",
        workspace: { members: [{ userId: "user-1" }] } 
      })) 
    },
    $transaction: vi.fn((cb) => cb({
        diagram: { upsert: vi.fn(() => ({ id: "diag-1" })) },
        table: { upsert: vi.fn((args) => args.create), findMany: vi.fn(() => []), delete: vi.fn() },
        column: { upsert: vi.fn((args) => args.create), findMany: vi.fn(() => []), deleteMany: vi.fn(), findUnique: vi.fn() },
        index: { upsert: vi.fn((args) => args.create), findMany: vi.fn(() => []), deleteMany: vi.fn() },
        relationship: { upsert: vi.fn((args) => args.create), findMany: vi.fn(() => []), delete: vi.fn() },
        view: { upsert: vi.fn((args) => args.create), findMany: vi.fn(() => []), delete: vi.fn() },
        tableNode: { upsert: vi.fn((args) => args.create), findMany: vi.fn(() => []), delete: vi.fn() },
        group: { findMany: vi.fn(() => []), deleteMany: vi.fn(), upsert: vi.fn((args) => args.create) },
        note: { findMany: vi.fn(() => []), deleteMany: vi.fn(), upsert: vi.fn((args) => args.create) },
        versionHistory: { count: vi.fn(() => 0), create: vi.fn() },
    })),
    activityLog: {
        create: vi.fn(),
        findMany: vi.fn(() => []),
    }
  },
}));

vi.mock("@/features/authentication/lib/auth-server", () => ({
  auth: {
    getSession: vi.fn(() => ({
      data: { user: { id: "user-1", name: "Test User" } },
    })),
  },
}));

describe("Activity Logging Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an activity log when syncModelSchema is called", async () => {
    const nodes = [
      { id: "table-1", type: "table", data: { name: "users" }, position: { x: 0, y: 0 } },
    ];
    const edges = [];

    await syncModelSchema("model-1", "diag-1", "Main", nodes as any, edges as any);

    expect(db.activityLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        dataModelId: "model-1",
        userId: "user-1",
        action: expect.stringContaining('Created table "users"'),
      })
    }));
  });
});
