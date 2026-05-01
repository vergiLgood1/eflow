import { describe, it, expect } from "bun:test";
import { dbmlToCanvas } from "@/features/model/lib/import-utils";
import { generateDBML } from "@/features/model/lib/dbml-converter";

describe("DBML Roundtrip: Import → Export", () => {
  it("should preserve Ref lines for relationships without explicit FK columns", () => {
    const inputDBML = `Table follows {
  id integer [primary key]
  following_user_id integer
  followed_user_id integer
  created_at timestamp
}

Table users {
  id integer [primary key]
  username varchar
  role varchar
  created_at timestamp
}

Table posts {
  id integer [primary key]
  title varchar
  body text [note: 'Content of the post']
  user_id integer [not null]
  status varchar
  created_at timestamp
}

Ref user_posts: posts.user_id > users.id

Ref: users.id < follows.following_user_id

Ref: users.id < follows.followed_user_id

Records users(id, username, role) {
  0, 'Alice', 'admin'
  1, 'Bob', 'moderator'
}

Records follows(following_user_id, followed_user_id, created_at) {
  1, 0, '2026-01-01'
}

Records posts(id, title, user_id) {
  0, 'Welcome!', 0
  1, 'Guidelines', 1
}`;

    // Import DBML to canvas
    const { nodes, edges } = dbmlToCanvas(inputDBML);
    
    // Verify import worked
    expect(nodes.length).toBe(3); // users, posts, follows
    expect(edges.length).toBe(3); // 3 relationships
    
    // Verify seed records were imported
    const usersNode = nodes.find(n => n.data.name === "users");
    const postsNode = nodes.find(n => n.data.name === "posts");
    const followsNode = nodes.find(n => n.data.name === "follows");
    
    expect(usersNode?.data.records?.length).toBe(2);
    expect(postsNode?.data.records?.length).toBe(2);
    expect(followsNode?.data.records?.length).toBe(1);

    // Export back to DBML
    const exportedDBML = generateDBML(nodes, edges);
    
    // Verify all Ref lines are present (they may have [name: '...'] format)
    expect(exportedDBML).toContain("Ref: posts.user_id > users.id");
    // Verify we have Ref lines for the follows relationships
    expect(exportedDBML).toContain("users.id > follows");
    // Verify we have at least 3 Ref lines (posts→users, follows→users×2)
    const refLines = exportedDBML.split("\n").filter(line => line.trim().startsWith("Ref:"));
    expect(refLines.length).toBeGreaterThanOrEqual(3);
    
    // Verify records are preserved
    expect(exportedDBML).toContain("Records users");
    expect(exportedDBML).toContain("'Alice'");
    expect(exportedDBML).toContain("Records posts");
    expect(exportedDBML).toContain("'Welcome!'");
    expect(exportedDBML).toContain("Records follows");
  });

  it("should export Ref with correct cardinality operators", () => {
    const inputDBML = `Table users {
  id integer [primary key]
}

Table posts {
  id integer [primary key]
  user_id integer [not null]
}

Table accounts {
  id integer [primary key]
  user_id integer [unique]
}

Ref: posts.user_id > users.id

Ref: accounts.user_id - users.id`;

    const { nodes, edges } = dbmlToCanvas(inputDBML);
    const exportedDBML = generateDBML(nodes, edges);
    
    // Verify cardinality operators
    expect(exportedDBML).toContain(" > "); // many-to-one (default)
    expect(exportedDBML).toContain(" - "); // one-to-one
  });
});
