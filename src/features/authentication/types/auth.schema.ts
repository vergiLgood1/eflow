import { z } from "zod";

/**
 * An email field normalised the way Neon Auth normalises it.
 *
 * Neon trims and lower-cases addresses at its own boundary, so a value kept in
 * the case the user happened to type no longer compares equal to the identity
 * it belongs to. Normalising here keeps the local `users.email` unique index an
 * honest arbiter of "already registered" rather than one casing quirk away from
 * minting a second row for a single Neon identity.
 *
 * Each call site supplies its own message so the copy a user sees still matches
 * the form they typed it in.
 */
const emailField = (message: string) =>
  z.string().trim().toLowerCase().email(message);

export const signInSchema = z.object({
  email: emailField("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: emailField("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField("Invalid email format"),
});
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const emailSchema = z.object({
  email: emailField("Invalid email address"),
});
export type EmailSchema = z.infer<typeof emailSchema>;

export type SignUpSchema = z.infer<typeof signUpSchema>;
