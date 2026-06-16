"use server";

import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";
import {
  ActionResponse,
  AppError,
  handleActionError,
} from "@/shared/lib/error";
import { DataModel } from "../../../../prisma/generated";
import {
  requireCanCreateDataModel,
  requireCanCreateWorkspace,
} from "@/features/subscription/applications/subscription.action";
import {
  CreateDataModelSchema,
  createDataModelSchema,
  createWorkspaceSchema,
} from "../types/workspace.schema";
import { createActivityLog } from "@/features/activity/applications/activity.action";

export async function isWorkspaceSlugExists(slug: string): Promise<boolean> {
  const workspace = await db.workspace.findUnique({
    where: {
      slug: slug,
    },
  });

  return !!workspace;
}

export async function getWorkspaces(query?: string) {
  const session = await auth.getSession();
  if (!session.data?.user) return [];

  return await db.workspace.findMany({
    where: {
      members: {
        some: {
          userId: session.data.user.id,
        },
      },
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getWorkspacesByCurrentUser(query?: string) {
  const session = await auth.getSession();

  if (!session.data?.user) return [];

  return await db.workspace.findMany({
    where: {
      members: {
        some: {
          userId: session.data.user.id,
        },
      },
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getWorkspaceBySlug(slug: string) {
  return await db.workspace.findUnique({
    where: { slug },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function getDataModels(workspaceId: string, query?: string) {
  return await db.dataModel.findMany({
    where: {
      workspaceId,
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getDataModelsBySlug(slug: string, query?: string) {
  if (!slug) return [];

  const session = await auth.getSession();
  const workspace = await db.workspace.findUnique({
    where: { slug },
    include: { members: true },
  });

  if (!workspace) return [];

  const isMember = session.data?.user
    ? workspace.members.some((m) => m.userId === session.data?.user.id)
    : false;

  return await db.dataModel.findMany({
    where: {
      workspaceId: workspace.id,
      ...(isMember ? {} : { isPublic: true }),
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

// get count workspace by userId
export async function getWorkspaceCountByUserId(
  userId: string,
): Promise<number> {
  return await db.workspace.count({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
  });
}

export async function createWorkspace(data: {
  name: string;
  slug: string;
}): Promise<ActionResponse> {
  try {
    const session = await auth.getSession();

    const validatedData = createWorkspaceSchema.parse(data);

    if (!session.data) {
      throw new AppError("Unauthorized", 401);
    }

    const userId = session.data.user.id;

    await requireCanCreateWorkspace(userId);

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

      const workspace = await tx.workspace.create({
        data: {
          name: validatedData.name,
          slug,
          members: {
            create: {
              userId,
              role: "OWNER",
            },
          },
        },
      });

      return workspace;
    });

    return {
      success: true,
      data: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
      message: "Workspace created successfully",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

// init workspace for user (used when user not have workspace)
export async function initWorkspace(data: {
  name: string;
  slug: string;
}): Promise<ActionResponse> {
  try {
    const session = await auth.getSession();

    const validatedData = createWorkspaceSchema.parse(data);

    if (!session.data) {
      throw new AppError("Unauthorized", 401);
    }

    const userId = session.data.user.id;

    await requireCanCreateWorkspace(userId);

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

      const workspace = await tx.workspace.create({
        data: {
          name: validatedData.name,
          slug,
          members: {
            create: {
              userId,
              role: "OWNER",
            },
          },
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { hasCompleteOnboarding: true },
      });

      return workspace;
    });

    return {
      success: true,
      data: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
      message: "Workspace created successfully",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function createDataModel(
  workspaceSlug: string,
  data: CreateDataModelSchema,
): Promise<ActionResponse> {
  try {
    const session = await auth.getSession();
    if (!session.data?.user) {
      throw new AppError("Unauthorized", 401);
    }

    const validatedData = createDataModelSchema.parse(data);

    const workspace = await db.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    });

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    await requireCanCreateDataModel(
      session.data.user.id,
      workspace.id,
      validatedData.isPublic,
    );

    const dataModel = await db.$transaction(async (tx) => {
      const model = await tx.dataModel.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          isPublic: validatedData.isPublic,
          dbType: validatedData.dbType,
          workspace: {
            connect: { id: workspace.id },
          },
        },
      });

      if (validatedData.tags?.length) {
        const upserted = await Promise.all(
          validatedData.tags.map((name) =>
            tx.tag.upsert({
              where: { name },
              update: {},
              create: { name },
            }),
          ),
        );

        await tx.dataModelTag.createMany({
          data: upserted.map((tag) => ({
            dataModelId: model.id,
            tagId: tag.id,
          })),
          skipDuplicates: true,
        });
      }

      return model;
    });

    if (session.data?.user) {
      await createActivityLog({
        dataModelId: dataModel.id,
        userId: session.data.user.id,
        action: `Created data model "${dataModel.name}"`,
        details: {
          type: "create",
          category: "General",
          target: dataModel.name,
        },
      });
    }

    return {
      success: true,
      data: dataModel,
      message: "Data model created successfully",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateDataModelTags(
  modelId: string,
  tags: string[],
): Promise<ActionResponse> {
  try {
    await db.$transaction(async (tx) => {
      const existing = await tx.dataModelTag.findMany({
        where: { dataModelId: modelId },
        include: { tag: true },
      });

      const existingNames = existing.map((t) => t.tag.name);

      const toAdd = tags.filter((t) => !existingNames.includes(t));
      const toRemove = existingNames.filter((t) => !tags.includes(t));

      if (toAdd.length) {
        const upserted = await Promise.all(
          toAdd.map((name) =>
            tx.tag.upsert({
              where: { name },
              update: {},
              create: { name },
            }),
          ),
        );

        await tx.dataModelTag.createMany({
          data: upserted.map((tag) => ({
            dataModelId: modelId,
            tagId: tag.id,
          })),
          skipDuplicates: true,
        });
      }

      if (toRemove.length) {
        const tagsToDelete = await tx.tag.findMany({
          where: {
            name: { in: toRemove },
          },
          select: { id: true },
        });

        await tx.dataModelTag.deleteMany({
          where: {
            dataModelId: modelId,
            tagId: {
              in: tagsToDelete.map((t) => t.id),
            },
          },
        });
      }
    });

    return {
      success: true,
      message: "Tags updated successfully",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function addDataModelTags(
  modelId: string,
  tags: string[],
): Promise<ActionResponse> {
  try {
    await db.$transaction(async (tx) => {
      const upserted = await Promise.all(
        tags.map((name) =>
          tx.tag.upsert({
            where: { name },
            update: {},
            create: { name },
          }),
        ),
      );

      await tx.dataModelTag.createMany({
        data: upserted.map((tag) => ({
          dataModelId: modelId,
          tagId: tag.id,
        })),
        skipDuplicates: true,
      });
    });

    return {
      success: true,
      message: "Tags added successfully",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteDataModelTags(
  modelId: string,
  tagNames: string[],
): Promise<ActionResponse> {
  try {
    await db.$transaction(async (tx) => {
      if (!tagNames.length) return;

      const tags = await tx.tag.findMany({
        where: {
          name: { in: tagNames },
        },
        select: { id: true },
      });

      await tx.dataModelTag.deleteMany({
        where: {
          dataModelId: modelId,
          tagId: {
            in: tags.map((t) => t.id),
          },
        },
      });
    });

    return {
      success: true,
      message: "Tags deleted successfully",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function togglePinDataModel(
  id: string,
): Promise<ActionResponse<DataModel>> {
  try {
    const model = await db.dataModel.findUnique({ where: { id } });
    if (!model) throw new AppError("Data model not found");

    const updated = await db.dataModel.update({
      where: { id },
      data: { isPinned: !model.isPinned },
    });

    const session = await auth.getSession();
    if (session.data?.user) {
      await createActivityLog({
        dataModelId: id,
        userId: session.data.user.id,
        action: `${updated.isPinned ? "Pinned" : "Unpinned"} data model "${model.name}"`,
        details: {
          type: "update",
          category: "General",
          target: model.name,
        },
      });
    }

    return { success: true, data: updated };
  } catch (error) {
    return handleActionError(error);
  }
}
export async function toggleVisibilityDataModel(
  id: string,
): Promise<ActionResponse<DataModel>> {
  try {
    const session = await auth.getSession();
    if (!session.data?.user) {
      throw new AppError("Unauthorized", 401);
    }

    const model = await db.dataModel.findUnique({ where: { id } });
    if (!model) throw new AppError("Data model not found");

    if (model.isPublic) {
      await requireCanCreateDataModel(
        session.data.user.id,
        model.workspaceId,
        false,
      );
    }

    const updated = await db.dataModel.update({
      where: { id },
      data: { isPublic: !model.isPublic },
    });

    await createActivityLog({
      dataModelId: id,
      userId: session.data.user.id,
      action: `Changed visibility of data model "${model.name}" to ${updated.isPublic ? "Public" : "Private"}`,
      details: {
        type: "update",
        category: "General",
        target: model.name,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function getDataModelById(id: string) {
  const session = await auth.getSession();

  const model = await db.dataModel.findUnique({
    where: { id },
    include: {
      workspace: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!model) return null;

  // Check if user has access
  const isMember = session.data?.user
    ? model.workspace.members.some((m) => m.userId === session.data?.user.id)
    : false;

  const hasAccess = model.isPublic || isMember;

  if (!hasAccess) return null;

  return model;
}

// ---- Canvas / Diagram Sync ----

interface TableNodeSnapshot {
  id: string;
  tableId: string;
  x: number;
  y: number;
}

interface SaveDiagramPayload {
  dataModelId: string;
  name: string;
  tableNodes: TableNodeSnapshot[];
}

export async function saveDiagram(
  payload: SaveDiagramPayload,
): Promise<ActionResponse> {
  try {
    const session = await auth.getSession();
    if (!session.data?.user) throw new AppError("Unauthorized", 401);

    // Ensure the data model exists and the user has access
    const model = await db.dataModel.findUnique({
      where: { id: payload.dataModelId },
      include: { workspace: { include: { members: true } } },
    });

    if (!model) throw new AppError("Data model not found", 404);

    const isMember = model.workspace.members.some(
      (m) => m.userId === session.data?.user.id,
    );
    if (!isMember) throw new AppError("Unauthorized", 403);

    await db.$transaction(async (tx) => {
      // Upsert the diagram (one default diagram per model for now)
      const diagram = await tx.diagram.upsert({
        where: {
          // We use a unique constraint on the name within a dataModel
          // using findFirst + create/update pattern since no composite unique here
          id: `${payload.dataModelId}-default`,
        },
        update: { name: payload.name, updatedAt: new Date() },
        create: {
          id: `${payload.dataModelId}-default`,
          dataModelId: payload.dataModelId,
          name: payload.name,
          isDraft: false,
        },
      });

      // Upsert table node positions
      for (const node of payload.tableNodes) {
        await tx.tableNode.upsert({
          where: {
            diagramId_tableId: { diagramId: diagram.id, tableId: node.tableId },
          },
          update: { x: node.x, y: node.y },
          create: {
            diagramId: diagram.id,
            tableId: node.tableId,
            x: node.x,
            y: node.y,
          },
        });
      }
    });

    return { success: true, message: "Diagram saved" };
  } catch (error) {
    return handleActionError(error);
  }
}
