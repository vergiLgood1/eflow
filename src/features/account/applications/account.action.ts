"use server";

import { db } from "@/db/prisma";
import { requireUser } from "@/features/authentication/lib/auth-guard";
import { ActionResponse, handleActionError } from "@/shared/lib/error";
import { Validation } from "@/shared/lib/validation";
import { revalidatePath } from "next/cache";
import { USER_PUBLIC_SELECT } from "../lib/user-select";
import { UpdateUserSchema, updateUserSchema } from "../types/account.schema";

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
