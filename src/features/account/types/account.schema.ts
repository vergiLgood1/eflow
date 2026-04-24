import { z } from "zod";

export const createUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  image: z.url("Invalid image URL").optional().nullable(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const deleteAccountSchema = z.object({
  confirmEmail: z.string().email("Please enter a valid email to confirm deletion"),
});

export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>;
