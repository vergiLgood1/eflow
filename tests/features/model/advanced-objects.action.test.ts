import { beforeEach, describe, expect, it, mock } from "bun:test";

const mockGetSession = mock();
mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: {
    getSession: mockGetSession
  }
}));

const mockDb: any = {
  table: {
    findUnique: mock(),
  },
  dataModel: {
    findUnique: mock(),
  },
  trigger: {
    create: mock(),
    findUnique: mock(),
    update: mock(),
    delete: mock(),
  },
  procedure: {
    create: mock(),
    findUnique: mock(),
    update: mock(),
    delete: mock(),
  },
  versionHistory: {
    create: mock(),
    count: mock(),
  },
  $transaction: mock().mockImplementation(async (callback) => await callback(mockDb))
};

mock.module("@/db/prisma", () => ({
  db: mockDb
}));

import { createTrigger, updateTrigger, deleteTrigger, createProcedure, updateProcedure, deleteProcedure } from "@/features/model/applications/advanced-objects.action";

describe("Advanced Objects Actions", () => {
  beforeEach(() => {
    mockGetSession.mockClear();
    mockDb.table.findUnique.mockClear();
    mockDb.dataModel.findUnique.mockClear();
    mockDb.trigger.create.mockClear();
    mockDb.trigger.findUnique.mockClear();
    mockDb.trigger.update.mockClear();
    mockDb.trigger.delete.mockClear();
    mockDb.procedure.create.mockClear();
    mockDb.procedure.findUnique.mockClear();
    mockDb.procedure.update.mockClear();
    mockDb.procedure.delete.mockClear();
    mockDb.versionHistory.create.mockClear();
    mockDb.versionHistory.count.mockClear();
  });

  describe("Trigger Actions", () => {
    it("should successfully create a trigger and initial version", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
      mockDb.table.findUnique.mockResolvedValueOnce({
        id: "table-1",
        dataModel: { workspace: { members: [{ userId: "user-1" }] } }
      });
      mockDb.trigger.create.mockResolvedValueOnce({ id: "trg-1" });

      const res = await createTrigger("table-1", {
        name: "audit_trg",
        event: "INSERT",
        timing: "AFTER",
        body: "BEGIN ... END",
        level: "ROW"
      });

      expect(res.success).toBe(true);
      expect(mockDb.trigger.create).toHaveBeenCalled();
      expect(mockDb.versionHistory.create).toHaveBeenCalled();
    });

    it("should successfully update a trigger and create a new version", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
      mockDb.trigger.findUnique.mockResolvedValueOnce({
        id: "trg-1",
        name: "audit_trg",
        body: "OLD BODY",
        table: { dataModel: { workspace: { members: [{ userId: "user-1" }] } } }
      });
      mockDb.versionHistory.count.mockResolvedValueOnce(1);

      const res = await updateTrigger("trg-1", {
        name: "audit_trg",
        event: "INSERT",
        timing: "AFTER",
        body: "NEW BODY",
        level: "ROW"
      });

      expect(res.success).toBe(true);
      expect(mockDb.trigger.update).toHaveBeenCalled();
      expect(mockDb.versionHistory.create).toHaveBeenCalled();
    });
  });

  describe("Procedure Actions", () => {
    it("should successfully create a procedure and initial version", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });
      mockDb.dataModel.findUnique.mockResolvedValueOnce({
        id: "model-1",
        workspace: { members: [{ userId: "user-1" }] }
      });
      mockDb.procedure.create.mockResolvedValueOnce({ id: "proc-1" });

      const res = await createProcedure("model-1", {
        name: "calc_total",
        language: "plpgsql",
        securityType: "DEFINER",
        dataAccess: "READS SQL DATA",
        isDeterministic: true,
        body: "BEGIN ... END"
      });

      expect(res.success).toBe(true);
      expect(mockDb.procedure.create).toHaveBeenCalled();
      expect(mockDb.versionHistory.create).toHaveBeenCalled();
    });
  });
});
