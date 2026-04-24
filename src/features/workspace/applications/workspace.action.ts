"use server";

import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";
import { revalidatePath } from "next/cache";
import { ActionResponse, handleActionError, AppError } from "@/shared/lib/error";
import { createWorkspaceSchema } from "../types/workspace.schema";

export async function createWorkspace(data: { name: string; slug: string }): Promise<ActionResponse> {
  try {
    const session = await auth.getSession();

    if (!session.data) {
      throw new AppError("Unauthorized", 401);
    }
    const validatedData = createWorkspaceSchema.parse(data);

    const workspace = await db.workspace.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        members: {
          create: {
            userId: session.data.user.id,
            role: "OWNER",
          },
        },
      },
    });

    revalidatePath("/workspaces");

    return {
      success: true,
      data: workspace,
      message: "Workspace created successfully"
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function initializeNewUserWorkspace(userId: string, userName: string, userEmail: string): Promise<ActionResponse> {
  try {
    const workspaceName = userName ? `${userName}'s Workspace` : "My Workspace";

    const slugBase = userEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${slugBase}-${randomSuffix}`;

    const workspace = await db.workspace.create({
      data: {
        name: workspaceName,
        slug: slug,
        members: {
          create: {
            userId: userId,
            role: "OWNER",
          },
        },
      },
    });

    return {
      success: true,
      data: workspace,
      message: "Default workspace initialized successfully"
    };
  } catch (error) {
    return handleActionError(error);
  }
}
