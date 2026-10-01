"use server";

import { db } from "@/db/prisma";
import { requireUser } from "@/features/authentication/lib/auth-guard";
import {
  endProviderSession,
  removeProviderUser,
} from "@/features/authentication/lib/provider-user";
import { ActionResponse, handleActionError } from "@/shared/lib/error";
import { Validation } from "@/shared/lib/validation";
import { revalidatePath } from "next/cache";
import { USER_PUBLIC_SELECT } from "../lib/user-select";
import {
  DeleteAccountSchema,
  UpdateUserSchema,
  updateUserSchema,
} from "../types/account.schema";
import { deleteCurrentAccount } from "./user-record";

export async function updateProfile(
  data: UpdateUserSchema,
): Promise<ActionResponse> {
  try {
    const user = await requireUser();
    const validatedData = Validation.validate(updateUserSchema, data);

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: validatedData,
      select: USER_PUBLIC_SELECT,
    });

    revalidatePath("/account", "layout");

    return {
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Delete the signed-in account from both identity stores.
 *
 * Session-derived like every other action here: the caller proves ownership by
 * typing the email that `deleteCurrentAccount` compares against the session,
 * so a forged request cannot delete someone else's account.
 *
 * The order is deliberate. The local row is deleted first because the deletion
 * the user asked for — and any privacy obligation attached to it — must not
 * hinge on a provider round-trip. Sign-out comes second because the provider
 * validates that call against the session, which the admin removal would have
 * revoked. Provider cleanup comes last and only ever logs: a stale record
 * there is an operational footnote (id is in the log), not a reason to pretend
 * the account is still intact.
 */
export async function deleteAccount(
  data: DeleteAccountSchema,
): Promise<ActionResponse> {
  try {
    const { id } = await deleteCurrentAccount(data);

    await endProviderSession();

    const cleanup = await removeProviderUser(id);

    if (cleanup.message) {
      console.error(
        `Account deletion left provider user ${id} behind and it must be removed manually (${cleanup.message}).`,
      );
    }

    revalidatePath("/workspaces", "layout");
    revalidatePath("/account", "layout");

    return {
      success: true,
      message: "Account deleted successfully",
      redirectTo: "/auth/sign-in",
    };
  } catch (error) {
    return handleActionError(error);
  }
}
