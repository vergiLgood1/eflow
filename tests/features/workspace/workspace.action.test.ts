import { beforeEach, describe, expect, it, mock } from "bun:test";

mock.module("next/navigation", () => ({
  unstable_rethrow: mock().mockImplementation((err) => {
    if (err.message === "NEXT_REDIRECT") throw err;
  })
}));

mock.module("next/cache", () => ({
  revalidatePath: mock()
}));

const mockGetSession = mock();
mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: {
    getSession: mockGetSession
  }
}));

const mockDb = {
  workspace: {
    create: mock(),
    findMany: mock(),
  },
  workspaceSlug: {
    upsert: mock(),
  }
};
mock.module("@/db/prisma", () => ({
  db: mockDb
}));

import { createWorkspace, initializeNewUserWorkspace } from "@/features/workspace/applications/workspace.action";
import { revalidatePath } from "next/cache";

describe("Workspace Actions", () => {
  beforeEach(() => {
    mockGetSession.mockClear();
    mockDb.workspace.create.mockClear();
    mockDb.workspace.findMany.mockClear();
    mockDb.workspaceSlug.upsert.mockClear();
    (revalidatePath as any).mockClear();
  });

  describe("createWorkspace", () => {
    it("should fail if unauthorized", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const res = await createWorkspace({ name: "Test", slug: "test" });
      expect(res.success).toBe(false);
      expect((res as any).error).toBe("Unauthorized");
    });

    it("should fail if validation fails", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-123" } } });
      const res = await createWorkspace({ name: "", slug: "" }); // Fails schema validation
      expect(res.success).toBe(false);
    });

    it("should successfully create workspace", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-123" } } });
      mockDb.workspaceSlug.upsert.mockResolvedValueOnce({ base: "my-workspace", count: 0 });
      mockDb.workspace.create.mockResolvedValueOnce({ id: "ws-123", name: "My Workspace" });

      const res = await createWorkspace({ name: "My Workspace", slug: "my-workspace" });
      
      expect(res.success).toBe(true);
      expect((res as any).data.name).toBe("My Workspace");
      expect(mockDb.workspace.create).toHaveBeenCalledWith({
        data: {
          name: "My Workspace",
          slug: "my-workspace",
          members: {
            create: {
              userId: "user-123",
              role: "OWNER"
            }
          }
        }
      });
      expect(revalidatePath).toHaveBeenCalledWith("/workspaces");
    });
  });

  describe("initializeNewUserWorkspace", () => {
    it("should successfully initialize a default workspace", async () => {
      mockDb.workspaceSlug.upsert.mockResolvedValueOnce({ base: "john", count: 0 });
      mockDb.workspace.create.mockResolvedValueOnce({ id: "ws-123" });

      const res = await initializeNewUserWorkspace("user-123", "John", "john@example.com");

      expect(res.success).toBe(true);
      // Validate that create was called properly
      expect(mockDb.workspace.create).toHaveBeenCalled();
      const callArgs = mockDb.workspace.create.mock.calls[0][0];
      
      expect(callArgs.data.name).toBe("John's Workspace");
      expect(callArgs.data.slug).toBe("john");
      expect(callArgs.data.members.create.userId).toBe("user-123");
      expect(callArgs.data.members.create.role).toBe("OWNER");
    });
  });
});
