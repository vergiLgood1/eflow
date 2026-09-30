import { z } from "zod";

/**
 * Mirrors the row created locally right after a Neon Auth sign-up.
 *
 * There is intentionally no `password`: credentials belong to the Neon Auth
 * instance, and anything written here would be a duplicate hash the app never
 * reads back. `id` comes from the auth provider, so it is required.
 */
export const createUserSchema = z.object({
  id: z.string().min(1, "User id is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  image: z.url("Invalid image URL").optional().nullable(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

/**
 * Profile fields a signed-in user may change.
 *
 * Kept separate from `createUserSchema` (instead of `.partial()`) so the
 * immutable identity columns — `id` and `email` — cannot be submitted at all.
 */
export const updateUserSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    image: z.url("Invalid image URL").nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const deleteAccountSchema = z.object({
  confirmEmail: z
    .string()
    .email("Please enter a valid email to confirm deletion"),
});

export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>;
