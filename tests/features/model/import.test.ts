import { describe, it, expect, beforeEach, vi } from "bun:test";
import { sqlToCanvas } from "@/features/model/lib/import-utils";
import { syncModelSchema } from "@/features/model/applications/model.action";

// Mock the database and auth
vi.mock("@/db/prisma", () => ({
  db: {
    dataModel: { findUnique: vi.fn(() => ({ 
      id: "model-1", 
      workspace: { members: [{ userId: "user-1" }] } 
    })) },
    $transaction: vi.fn((cb) => cb({
      dataModel: { findUnique: vi.fn(() => ({ 
        id: "model-1", 
        workspace: { members: [{ userId: "user-1" }] } 
      })) },
      diagram: { upsert: vi.fn(() => ({ id: "diag-1" })) },
      table: { upsert: vi.fn(), findMany: vi.fn(() => []) },
      column: { upsert: vi.fn(), findMany: vi.fn(() => []) },
      index: { upsert: vi.fn(), findMany: vi.fn(() => []) },
      relationship: { upsert: vi.fn(), findMany: vi.fn(() => []) },
      view: { upsert: vi.fn(), findMany: vi.fn(() => []) },
      tableNode: { upsert: vi.fn(), findMany: vi.fn(() => []), deleteMany: vi.fn() },
      group: { findMany: vi.fn(() => []), deleteMany: vi.fn() },
      note: { findMany: vi.fn(() => []), deleteMany: vi.fn() },
    })),
  },
}));

vi.mock("@/features/authentication/lib/auth-server", () => ({
  auth: {
    getSession: vi.fn(() => Promise.resolve({ data: { user: { id: "user-1" } } })),
  },
}));

describe("Import and Sync Integration", () => {
  it("should parse SQL and sync to database", async () => {
    const sql = `
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL
      );
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title TEXT
      );
    `;

    const { nodes, edges } = sqlToCanvas(sql);

    expect(nodes.length).toBe(2);
    expect(edges.length).toBe(1);

    const res = await syncModelSchema("model-1", "diag-1", "Main", nodes as any, edges as any);
    expect(res.success).toBe(true);
  });
});
