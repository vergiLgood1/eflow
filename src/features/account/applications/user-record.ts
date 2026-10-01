import { db } from "@/db/prisma";
import { requireUser } from "@/features/authentication/lib/auth-guard";
import { AppError } from "@/shared/lib/error";
import { Validation } from "@/shared/lib/validation";
import { Prisma } from "../../../../prisma/generated";
import { USER_PUBLIC_SELECT } from "../lib/user-select";
import {
  CreateUserSchema,
  DeleteAccountSchema,
  createUserSchema,
  deleteAccountSchema,
} from "../types/account.schema";

/** Prisma error code for a violated unique constraint. */
const UNIQUE_CONSTRAINT_CODE = "P2002";

/**
 * Create the app-side row for an identity that Neon Auth has already accepted.
 *
 * The two stores are separate databases, so the caller owns the compensation
 * when this fails; this function only reports the failure.
 *
 * This is deliberately not a Server Action. A `"use server"` module publishes
 * every export as a network-reachable endpoint, and this one accepts an
 * arbitrary `id` plus `email` — calling it over the network would insert a user
 * row for anyone. Only the sign-up flow, which already verified the identity
 * with the provider, may reach it.
 */
export async function registerUser(data: CreateUserSchema) {
  const validatedData = Validation.validate(createUserSchema, data);

  try {
    return await db.user.create({
      data: {
        id: validatedData.id,
        name: validatedData.name,
        email: validatedData.email,
        image: validatedData.image,
      },
      select: USER_PUBLIC_SELECT,
    });
  } catch (error) {
    // Two sign-ups racing on the same email both pass the provider check, so
    // the unique index is the real arbiter of "already exists".
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === UNIQUE_CONSTRAINT_CODE
    ) {
      throw new AppError("Email already exists", 400);
    }

    throw error;
  }
}

/**
 * Delete the signed-in user's app-side row after an explicit email confirmation.
 *
 * Dependent rows (workspace memberships, activity logs, subscription) cascade
 * with it. The Neon Auth session is not touched here: whoever exposes this as an
 * action must also sign the caller out, or the session cookie keeps
 * authenticating a user id that no longer resolves.
 */
export async function deleteCurrentAccount(data: DeleteAccountSchema) {
  const user = await requireUser();
  const { confirmEmail } = Validation.validate(deleteAccountSchema, data);

  if (confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
    throw new AppError("Confirmation email does not match this account", 422);
  }

  await db.user.delete({ where: { id: user.id } });

  return { id: user.id };
}
