import type { Prisma } from "../../../../prisma/generated";

/**
 * Fields of `users` that may leave the database layer.
 *
 * Every server action that returns a user must pass this as `select`, so a
 * future sensitive column cannot leak to the client just because someone
 * forgot to shape the Prisma result.
 */
export const USER_PUBLIC_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true,
  hasCompleteOnboarding: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.UserSelect;
