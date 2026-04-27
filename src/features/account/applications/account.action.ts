"use server";

import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";
import { ActionResponse, AppError, handleActionError } from "@/shared/lib/error";
import { Validation } from "@/shared/lib/validation";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { CreateUserSchema, createUserSchema, UpdateUserSchema, updateUserSchema } from "../types/account.schema";

export async function updateProfile(data: UpdateUserSchema): Promise<ActionResponse> {
  try {
    const session = await auth.getSession();

    if (!session.data) {
      throw new AppError("Unauthorized", 401);
    }
    const validatedData = Validation.validate(updateUserSchema, data);

    const updatedUser = await db.user.update({
      where: { id: session.data.user.id },
      data: validatedData,
    });

    revalidatePath("/workspaces/account");

    return {
      success: true,
      data: updatedUser,
      message: "Profile updated successfully"
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteAccount(): Promise<ActionResponse> {
  try {
    const session = await auth.getSession();

    if (!session.data) {
      throw new AppError("Unauthorized", 401);
    }
    await db.user.delete({
      where: { id: session.data.user.id },
    });

    revalidatePath("/");

    return {
      success: true,
      message: "Account deleted successfully"
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function registerUser(data: CreateUserSchema): Promise<ActionResponse> {
  try {
    const validatedData = Validation.validate(createUserSchema, data);

    const isEmailExists = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (isEmailExists) {
      throw new AppError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await db.user.create({
      data: {
        id: validatedData.id,
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    return { success: true, data: user };
  } catch (error) {
    return handleActionError(error);
  }
}

