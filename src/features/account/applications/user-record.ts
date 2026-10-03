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
 * Fail before the provider is asked to mint an identity for an address this app
 * already holds a row for.
 *
 * Sign-up creates the Neon Auth identity first and the local row second, and the
 * reverse roll-back is not reachable: provider deletion needs an authenticated
 * session, which an account still awaiting email confirmation never has. So a
 * duplicate sign-up used to strand an identity at the provider — the local write
 * was rejected by the unique index *after* Neon had already accepted the
 * address, and the compensating delete then answered Unauthorized.
 *
 * This closes that case without claiming to close the race: two concurrent
 * sign-ups both pass the check here and are still arbitrated by the unique index
 * in `registerUser`.
 *
 * @throws {AppError} 400 when a user row already exists for the address.
 */
export async function assertEmailAvailable(email: string): Promise<void> {
  const existing = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    throw new AppError("Email already exists", 400);
  }
}

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
 * with it. The Neon Auth half of the identity is not touched here: the
 * `deleteAccount` action composes this with `endProviderSession()` and
 * `removeProviderUser()`, and is the only network-reachable path to it —
 * calling this helper on its own would leave the session cookie authenticating
 * a user id that no longer resolves.
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
