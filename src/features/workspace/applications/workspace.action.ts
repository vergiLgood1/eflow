"use server";

import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";
import { ActionResponse, AppError, handleActionError } from "@/shared/lib/error";
import { revalidatePath } from "next/cache";
import { Workspace } from "../../../../prisma/generated";
import { generateSlug } from "../lib/generate-slug";
import { createWorkspaceSchema } from "../types/workspace.schema";

// is workspace slug exists
export async function isWorkspaceSlugExists(slug: string): Promise<ActionResponse<boolean>> {
  try {
    const workspace = await db.workspace.findUnique({
      where: {
        slug: slug,
      },
    });

    return {
      success: true,
      data: !!workspace,
      message: "Workspace slug exists"
    };
  } catch (error) {
    return handleActionError(error);
  }
}


export async function createWorkspace(data: { name: string; slug: string }): Promise<ActionResponse> {
  try {
    const session = await auth.getSession();

    const validatedData = createWorkspaceSchema.parse(data);

    const workspace = await db.$transaction(async (tx) => {
      const record = await tx.workspaceSlug.upsert({
        where: { base: validatedData.slug },
        update: { count: { increment: 1 } },
        create: { base: validatedData.slug, count: 0 },
      });

      const slug =
        record.count === 0
          ? validatedData.slug
          : `${validatedData.slug}-${record.count}`;

      if (!session.data) {
        throw new AppError("Unauthorized", 401);
      }

      const workspace = await tx.workspace.create({
        data: {
          name: validatedData.name,
          slug,
          members: {
            create: {
              userId: session.data.user.id,
              role: "OWNER",
            },
          },
        },
      });

      return workspace;
    });

    revalidatePath("/workspaces");

    return {
      success: true,
      data: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
      message: "Workspace created successfully"
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function initializeNewUserWorkspace(userId: string, userName: string, userEmail: string): Promise<ActionResponse> {
  try {
    const workspaceName = userName ? `${userName}'s Workspace` : "My Workspace";

    const slugBase = userEmail.split("@")[0].toLowerCase()

    const slug = await generateSlug(slugBase)

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

export async function getAllWorkspaces(): Promise<ActionResponse<Workspace[]>> {
  try {
    const session = await auth.getSession();

    if (!session.data) {
      throw new AppError("Unauthorized", 401);
    }
    const workspaces = await db.workspace.findMany({
      where: {
        members: {
          some: {
            userId: session.data.user.id,
          },
        },
      },
    });

    revalidatePath("/workspaces");

    return {
      success: true,
      data: workspaces,
      message: "Workspaces fetched successfully"
    };
  } catch (error) {
    return handleActionError(error);
  }
}

// get count workspace by userId
export async function getWorkspaceCountByUserId(userId: string): Promise<ActionResponse<number>> {
  try {
    const count = await db.workspace.count({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });

    return {
      success: true,
      data: count,
      message: "Workspace count fetched successfully"
    };
  } catch (error) {
    return handleActionError(error);
  }
}



