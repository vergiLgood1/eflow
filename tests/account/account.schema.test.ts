import { expect, test } from "bun:test";

import {
  createUserSchema,
  updateUserSchema,
} from "@/features/account/types/account.schema";

test("accepts a sign-up payload without any password field", () => {
  // Act
  const result = createUserSchema.safeParse({
    id: "usr_123",
    name: "Di Yoan",
    email: "diyoan@example.com",
  });

  // Assert
  expect(result.success).toBe(true);
});

test("rejects an incomplete sign-up payload", () => {
  // Act
  const result = createUserSchema.safeParse({ name: "Di Yoan" });

  // Assert
  expect(result.success).toBe(false);
});

test("strips unlisted fields from a profile update", () => {
  // Act
  const result = updateUserSchema.safeParse({
    name: "Di Yoan",
    password: "plaintext-leak",
    id: "someone-else",
  });

  // Assert
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data).toEqual({ name: "Di Yoan" });
  }
});

test("rejects a profile update that only carries unlisted fields", () => {
  // Act
  const result = updateUserSchema.safeParse({ email: "attacker@example.com" });

  // Assert
  expect(result.success).toBe(false);
});

test("rejects an empty profile update", () => {
  // Act
  const result = updateUserSchema.safeParse({});

  // Assert
  expect(result.success).toBe(false);
});
