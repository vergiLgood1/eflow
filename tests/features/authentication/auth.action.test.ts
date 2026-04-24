import { beforeEach, describe, expect, it, mock } from "bun:test";

// 1. Setup mocks before importing the action
mock.module("next/navigation", () => ({
  redirect: mock().mockImplementation((path) => {
    const err = new Error("NEXT_REDIRECT");
    (err as any).digest = "NEXT_REDIRECT";
    throw err;
  }),
  unstable_rethrow: mock().mockImplementation((err) => {
    if (err.message === "NEXT_REDIRECT") throw err;
  })
}));

const mockAuth = {
  signIn: {
    email: mock(),
    social: mock(),
  },
  signUp: {
    email: mock(),
  },
  signOut: mock(),
};

mock.module("@/features/authentication/lib/auth-server", () => ({
  auth: mockAuth
}));

const mockDb = {
  user: {
    findUnique: mock(),
    create: mock(),
  }
};
mock.module("@/db/prisma", () => ({ db: mockDb }));

const mockBcryptHash = mock();
mock.module("bcryptjs", () => ({ default: { hash: mockBcryptHash } }));

// Now import the action
import { signInWithEmail, signInWithGithub, signOut, signUpWithEmail } from "@/features/authentication/applications/auth.action";

describe("Auth Actions", () => {
  beforeEach(() => {
    mockAuth.signIn.email.mockClear();
    mockAuth.signIn.social.mockClear();
    mockAuth.signUp.email.mockClear();
    mockAuth.signOut.mockClear();
    mockDb.user.findUnique.mockClear();
    mockDb.user.create.mockClear();
    mockBcryptHash.mockClear();
  });

  describe("signInWithEmail", () => {
    it("should successfully sign in and redirect", async () => {
      mockAuth.signIn.email.mockResolvedValueOnce({ error: null });

      try {
        await signInWithEmail({ email: "test@example.com", password: "password123" });
        // Should not reach here because redirect throws NEXT_REDIRECT
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err.message).toBe("NEXT_REDIRECT");
      }

      expect(mockAuth.signIn.email).toHaveBeenCalledWith({ email: "test@example.com", password: "password123" });
    });

    it("should return validation error for invalid input", async () => {
      const res = await signInWithEmail({ email: "invalid", password: "123" });

      expect(res.success).toBe(false);
      expect((res as any).error).toBeDefined();
      expect(mockAuth.signIn.email).not.toHaveBeenCalled();
    });

    it("should return error from auth provider", async () => {
      mockAuth.signIn.email.mockResolvedValueOnce({ error: { message: "Invalid credentials" } });

      const res = await signInWithEmail({ email: "test@example.com", password: "password123" });

      expect(res.success).toBe(false);
      expect((res as any).error).toBe("Invalid credentials");
    });
  });

  describe("signUpWithEmail", () => {
    it("should successfully sign up, register user and redirect", async () => {
      mockAuth.signUp.email.mockResolvedValueOnce({ error: null });
      mockDb.user.findUnique.mockResolvedValueOnce(null);
      mockBcryptHash.mockResolvedValueOnce("hashed");
      mockDb.user.create.mockResolvedValueOnce({ id: "new-user" });

      try {
        await signUpWithEmail({ name: "John Doe", email: "test@example.com", password: "password123" });
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err.message).toBe("NEXT_REDIRECT");
      }

      expect(mockAuth.signUp.email).toHaveBeenCalledWith({
        name: "John Doe",
        email: "test@example.com",
        password: "password123"
      });
      expect(mockDb.user.create).toHaveBeenCalled();
    });

    it("should return error if auth provider fails", async () => {
      mockAuth.signUp.email.mockResolvedValueOnce({ error: { message: "Email in use" } });

      const res = await signUpWithEmail({ name: "John Doe", email: "test@example.com", password: "password123" });

      expect(res.success).toBe(false);
      expect((res as any).error).toBe("Email in use");
      expect(mockDb.user.create).not.toHaveBeenCalled();
    });

    it("should return error if user registration fails", async () => {
      mockAuth.signUp.email.mockResolvedValueOnce({ error: null });
      mockDb.user.findUnique.mockResolvedValueOnce({ id: "existing" }); // This will cause registerUser to fail

      const res = await signUpWithEmail({ name: "John Doe", email: "test@example.com", password: "password123" });

      expect(res.success).toBe(false);
      expect((res as any).error).toBe("Email already exists");
    });
  });

  describe("signInWithGithub", () => {
    it("should successfully sign in with Github and redirect", async () => {
      mockAuth.signIn.social.mockResolvedValueOnce({ error: null });

      try {
        await signInWithGithub();
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err.message).toBe("NEXT_REDIRECT");
      }

      expect(mockAuth.signIn.social).toHaveBeenCalledWith({
        provider: "github",
        callbackURL: "/workspaces"
      });
    });

    it("should return error if Github sign in fails", async () => {
      mockAuth.signIn.social.mockResolvedValueOnce({ error: { message: "OAuth failed" } });

      const res = await signInWithGithub();

      expect(res.success).toBe(false);
      expect((res as any).error).toBe("OAuth failed");
    });
  });

  describe("signOut", () => {
    it("should successfully sign out and redirect", async () => {
      mockAuth.signOut.mockResolvedValueOnce(undefined);

      try {
        await signOut();
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err.message).toBe("NEXT_REDIRECT");
      }

      expect(mockAuth.signOut).toHaveBeenCalled();
    });
  });
});
