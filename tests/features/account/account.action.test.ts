import { describe, it, expect, mock, beforeEach } from "bun:test";

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
  user: {
    update: mock(),
    delete: mock(),
    findUnique: mock(),
    create: mock(),
  }
};
mock.module("@/db/prisma", () => ({
  db: mockDb
}));

const mockBcryptHash = mock();
mock.module("bcryptjs", () => ({
  default: {
    hash: mockBcryptHash
  }
}));

import { updateProfile, deleteAccount, registerUser } from "@/features/account/applications/account.action";
import { revalidatePath } from "next/cache";

describe("Account Actions", () => {
  beforeEach(() => {
    mockGetSession.mockClear();
    mockDb.user.update.mockClear();
    mockDb.user.delete.mockClear();
    mockDb.user.findUnique.mockClear();
    mockDb.user.create.mockClear();
    mockBcryptHash.mockClear();
    (revalidatePath as any).mockClear();
  });

  describe("updateProfile", () => {
    it("should fail if unauthorized", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const res = await updateProfile({ name: "John" });
      expect(res.success).toBe(false);
      expect((res as any).error).toBe("Unauthorized");
    });

    it("should fail if validation fails", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-123" } } });
      const res = await updateProfile({ name: "" }); // empty name fails validation
      expect(res.success).toBe(false);
    });

    it("should successfully update profile", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-123" } } });
      mockDb.user.update.mockResolvedValueOnce({ id: "user-123", name: "John Doe" });

      const res = await updateProfile({ name: "John Doe" });
      expect(res.success).toBe(true);
      expect((res as any).data.name).toBe("John Doe");
      expect(mockDb.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { name: "John Doe" }
      });
      expect(revalidatePath).toHaveBeenCalledWith("/workspaces/account");
    });
  });

  describe("deleteAccount", () => {
    it("should fail if unauthorized", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const res = await deleteAccount();
      expect(res.success).toBe(false);
      expect((res as any).error).toBe("Unauthorized");
    });

    it("should successfully delete account", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { user: { id: "user-123" } } });
      mockDb.user.delete.mockResolvedValueOnce(null);

      const res = await deleteAccount();
      expect(res.success).toBe(true);
      expect(mockDb.user.delete).toHaveBeenCalledWith({
        where: { id: "user-123" }
      });
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });
  });

  describe("registerUser", () => {
    it("should fail if validation fails", async () => {
      const res = await registerUser({ id: "user-1", name: "J", email: "invalid", password: "1" });
      expect(res.success).toBe(false);
      expect(mockDb.user.findUnique).not.toHaveBeenCalled();
    });

    it("should fail if email exists", async () => {
      mockDb.user.findUnique.mockResolvedValueOnce({ id: "existing-user" });
      const res = await registerUser({ id: "user-1", name: "John", email: "test@example.com", password: "password123" });
      
      expect(res.success).toBe(false);
      expect((res as any).error).toBe("Email already exists");
    });

    it("should successfully register user", async () => {
      mockDb.user.findUnique.mockResolvedValueOnce(null);
      mockBcryptHash.mockResolvedValueOnce("hashed_password");
      mockDb.user.create.mockResolvedValueOnce({ id: "new-user" });

      const res = await registerUser({ id: "new-user", name: "John", email: "test@example.com", password: "password123" });
      
      expect(res.success).toBe(true);
      expect(mockBcryptHash).toHaveBeenCalledWith("password123", 10);
      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: {
          id: "new-user",
          name: "John",
          email: "test@example.com",
          password: "hashed_password"
        }
      });
    });
  });
});
