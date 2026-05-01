import { beforeEach, describe, expect, it, mock } from "bun:test";

const mockGetSession = mock();
mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: {
    getSession: mockGetSession
  }
}));

const mockDb: any = {
  dataModel: {
    findUnique: mock(),
    update: mock(),
  },
  table: {
    upsert: mock(),
    deleteMany: mock(),
    findMany: mock(),
  },
  column: {
    upsert: mock(),
    deleteMany: mock(),
    findMany: mock(),
  },
  relationship: {
    upsert: mock(),
    deleteMany: mock(),
    findMany: mock(),
  },
  index: {
    upsert: mock(),
    deleteMany: mock(),
    findMany: mock(),
  },
  view: {
    upsert: mock(),
    deleteMany: mock(),
    findMany: mock(),
  },
  trigger: {
    upsert: mock(),
    deleteMany: mock(),
    findMany: mock(),
  },
  procedure: {
    upsert: mock(),
    deleteMany: mock(),
    findMany: mock(),
  },
  group: {
    upsert: mock(),
    deleteMany: mock(),
    findMany: mock(),
  },
  note: {
    upsert: mock(),
    deleteMany: mock(),
    findMany: mock(),
  },
  tableNode: {
    upsert: mock(),
    deleteMany: mock(),
    findMany: mock(),
  },
  activityLog: {
    create: mock(),
  },
  versionHistory: {
    create: mock(),
    count: mock(),
    findMany: mock(),
  },
  diagram: {
    upsert: mock(),
  },
  $transaction: mock().mockImplementation(async (callback) => await callback(mockDb))
};

mock.module("@/db/prisma", () => ({
  db: mockDb
}));

mock.module("next/cache", () => ({
  revalidatePath: mock()
}));

// Mock types
mock.module("../types/canvas", () => ({
  isTableNode: (node: any) => node.type === "table",
  isRelationshipEdge: (edge: any) => edge.type === "relationship",
  isViewNode: (node: any) => node.type === "view",
  isGroupNode: (node: any) => node.type === "group",
  isNoteNode: (node: any) => node.type === "note",
}));

import { syncModelSchema } from "@/features/model/applications/model.action";

describe("Model Persistence Actions", () => {
  beforeEach(() => {
    mockGetSession.mockClear();
    mockDb.dataModel.findUnique.mockClear();
    mockDb.table.upsert.mockClear();
    mockDb.table.findMany.mockResolvedValue([]);
    mockDb.column.upsert.mockClear();
    mockDb.column.findMany.mockResolvedValue([]);
    mockDb.relationship.upsert.mockClear();
    mockDb.relationship.findMany.mockResolvedValue([]);
    mockDb.index.upsert.mockClear();
    mockDb.index.findMany.mockResolvedValue([]);
    mockDb.view.upsert.mockClear();
    mockDb.view.findMany.mockResolvedValue([]);
    mockDb.trigger.upsert.mockClear();
    mockDb.trigger.findMany.mockResolvedValue([]);
    mockDb.procedure.upsert.mockClear();
    mockDb.procedure.findMany.mockResolvedValue([]);
    mockDb.group.upsert.mockClear();
    mockDb.group.findMany.mockResolvedValue([]);
    mockDb.note.upsert.mockClear();
    mockDb.note.findMany.mockResolvedValue([]);
    mockDb.tableNode.upsert.mockClear();
    mockDb.tableNode.findMany.mockResolvedValue([]);
    mockDb.activityLog.create.mockClear();
    mockDb.versionHistory.create.mockClear();
    mockDb.versionHistory.count.mockResolvedValue(0);
    mockDb.diagram.upsert.mockResolvedValue({ id: "diag-1" });
  });

  describe("syncModelSchema", () => {
    it("should successfully sync a new table and columns", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
      mockDb.dataModel.findUnique.mockResolvedValueOnce({ 
        id: "model-1", 
        workspace: { members: [{ userId: "user-1" }] } 
      });
      mockDb.table.findMany.mockResolvedValueOnce([]);
      mockDb.column.findMany.mockResolvedValue([]);
      
      const nodes: any[] = [
        {
          id: "table-1",
          type: "table",
          position: { x: 0, y: 0 },
          data: {
            name: "Users",
            columns: [
              {
                id: "col-1",
                name: "id",
                type: "uuid",
                isPk: true,
                isUnique: true,
                nullable: false
              }
            ]
          }
        }
      ];
      const edges: any[] = [];

      const res = await syncModelSchema("model-1", "diag-1", "Main Diagram", nodes, edges);

      if (!res.success) {
        console.error("Sync Error:", (res as any).error);
      }

      expect(res.success).toBe(true);
      expect(mockDb.diagram.upsert).toHaveBeenCalled();
      expect(mockDb.table.upsert).toHaveBeenCalled();
      expect(mockDb.column.upsert).toHaveBeenCalled();
    });

    it("should handle relationship synchronization", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
      mockDb.dataModel.findUnique.mockResolvedValueOnce({ 
        id: "model-1", 
        workspace: { members: [{ userId: "user-1" }] } 
      });
      mockDb.table.findMany.mockResolvedValue([]);
      mockDb.relationship.findMany.mockResolvedValueOnce([]);

      const nodes: any[] = [
        { id: "t1", type: "table", position: { x: 0, y: 0 }, data: { name: "Users", columns: [{ id: "c1", name: "id" }] } },
        { id: "t2", type: "table", position: { x: 100, y: 100 }, data: { name: "Posts", columns: [{ id: "c2", name: "user_id" }] } }
      ];
      const edges: any[] = [
        {
          id: "rel-1",
          type: "relationship",
          data: {
            name: "users_posts_fk",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
          },
          source: "t2",
          sourceHandle: "c2-source",
          target: "t1",
          targetHandle: "c1-target"
        }
      ];

      const res = await syncModelSchema("model-1", "diag-1", "Main Diagram", nodes, edges);

      expect(res.success).toBe(true);
      expect(mockDb.relationship.upsert).toHaveBeenCalled();
    });

    it("should create version history when a view is updated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
      mockDb.dataModel.findUnique.mockResolvedValueOnce({ 
        id: "model-1", 
        workspace: { members: [{ userId: "user-1" }] } 
      });
      
      // Existing view with different SQL
      mockDb.view.findMany.mockResolvedValueOnce([
        { id: "view-1", sql: "SELECT 1" }
      ]);

      const nodes: any[] = [
        { 
          id: "view-1", 
          type: "view", 
          position: { x: 0, y: 0 },
          data: { name: "My View", query: "SELECT * FROM users" } 
        }
      ];
      const edges: any[] = [];

      const res = await syncModelSchema("model-1", "diag-1", "Main Diagram", nodes, edges);

      expect(res.success).toBe(true);
      expect(mockDb.view.upsert).toHaveBeenCalled();
      expect(mockDb.versionHistory.create).toHaveBeenCalled();
    });
  });
});
