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
  },
  checkpoint: {
    findUnique: mock(),
    create: mock(),
    findMany: mock(),
  },
  $transaction: mock().mockImplementation(async (callback) => await callback(mockDb))
};

mock.module("@/db/prisma", () => ({
  db: mockDb
}));

import { generateMigration } from "@/features/model/applications/checkpoint.action";

describe("Checkpoint & Migration Actions", () => {
  beforeEach(() => {
    mockGetSession.mockClear();
    mockDb.dataModel.findUnique.mockClear();
    mockDb.checkpoint.findUnique.mockClear();
  });

  describe("generateMigration", () => {
    it("should generate a full creation script when no fromCheckpointId is provided", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
      mockDb.dataModel.findUnique.mockResolvedValueOnce({
        id: "model-1",
        workspace: { members: [{ userId: "user-1" }] },
        tables: [
          {
            id: "t1",
            name: "Users",
            columns: [
              { id: "c1", name: "id", type: "UUID", isPrimaryKey: true, isNullable: false },
              { id: "c2", name: "email", type: "VARCHAR", isPrimaryKey: false, isNullable: false }
            ]
          }
        ]
      });

      const res = await generateMigration("model-1");

      expect(res.success).toBe(true);
      const sql = (res as any).data.sql;
      expect(sql).toContain('CREATE TABLE "Users"');
      expect(sql).toContain('"id" UUID NOT NULL PRIMARY KEY');
      expect(sql).toContain('"email" VARCHAR NOT NULL');
    });

    it("should generate ALTER TABLE for added columns", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
      
      // Previous snapshot (Checkpoint A)
      const checkpointA = {
        id: "cp-a",
        snapshot: {
          tables: [
            {
              id: "t1",
              name: "Users",
              columns: [{ id: "c1", name: "id", type: "UUID", isPrimaryKey: true, isNullable: false }]
            }
          ]
        }
      };

      // Current state (Adding 'email' column)
      mockDb.dataModel.findUnique.mockResolvedValueOnce({
        id: "model-1",
        workspace: { members: [{ userId: "user-1" }] },
        tables: [
          {
            id: "t1",
            name: "Users",
            columns: [
              { id: "c1", name: "id", type: "UUID", isPrimaryKey: true, isNullable: false },
              { id: "c2", name: "email", type: "VARCHAR", isPrimaryKey: false, isNullable: true }
            ]
          }
        ]
      });

      mockDb.checkpoint.findUnique.mockResolvedValueOnce(checkpointA);

      const res = await generateMigration("model-1", "cp-a");

      expect(res.success).toBe(true);
      const sql = (res as any).data.sql;
      expect(sql).toContain('ALTER TABLE "Users" ADD COLUMN "email" VARCHAR');
      expect(sql).not.toContain('CREATE TABLE "Users"');
    });

    it("should generate DROP TABLE and DROP COLUMN", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
      
      const checkpointA = {
        id: "cp-a",
        snapshot: {
          tables: [
            {
              id: "t1",
              name: "Users",
              columns: [
                { id: "c1", name: "id", type: "UUID" },
                { id: "c2", name: "temp", type: "VARCHAR" }
              ]
            },
            { id: "t2", name: "OldTable", columns: [] }
          ]
        }
      };

      // Current state: removed 'temp' column and 'OldTable'
      mockDb.dataModel.findUnique.mockResolvedValueOnce({
        id: "model-1",
        workspace: { members: [{ userId: "user-1" }] },
        tables: [
          {
            id: "t1",
            name: "Users",
            columns: [{ id: "c1", name: "id", type: "UUID" }]
          }
        ]
      });

      mockDb.checkpoint.findUnique.mockResolvedValueOnce(checkpointA);

      const res = await generateMigration("model-1", "cp-a");

      expect(res.success).toBe(true);
      const sql = (res as any).data.sql;
      expect(sql).toContain('DROP TABLE "OldTable"');
      expect(sql).toContain('ALTER TABLE "Users" DROP COLUMN "temp"');
    });
  });
});
