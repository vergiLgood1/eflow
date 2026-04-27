"use server";

import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";
import { ActionResponse, AppError, handleActionError } from "@/shared/lib/error";
import { Prisma } from "../../../../prisma/generated";
import { CreateDataModelSchema, createDataModelSchema, createWorkspaceSchema } from "../types/workspace.schema";


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

export async function getWorkspaces(query?: string) {
    const session = await auth.getSession();
    if (!session.data?.user) return [];

    return await db.workspace.findMany({
        where: {
            members: {
                some: {
                    userId: session.data.user.id
                }
            },
            name: {
                contains: query,
                mode: 'insensitive'
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
}

export async function getWorkspacesByCurrentUser(query?: string) {
    const session = await auth.getSession();

    if (!session.data?.user) return [];

    return await db.workspace.findMany({
        where: {
            members: {
                some: {
                    userId: session.data.user.id
                }
            },
            name: {
                contains: query,
                mode: 'insensitive'
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
}


export async function getWorkspaceBySlug(slug: string) {
    return await db.workspace.findUnique({
        where: { slug },
        include: {
            members: {
                include: {
                    user: true
                }
            }
        }
    });
}

export async function getDataModels(workspaceId: string, query?: string) {
    return await db.dataModel.findMany({
        where: {
            workspaceId,
            name: {
                contains: query,
                mode: 'insensitive'
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
}

export async function getDataModelsBySlug(slug: string, query?: string) {
    if (!slug) return [];

    const workspace = await db.workspace.findUnique({
        where: { slug }
    });
    if (!workspace) return [];

    return await db.dataModel.findMany({
        where: {
            workspaceId: workspace.id,
            name: {
                contains: query,
                mode: 'insensitive'
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
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

// init workspace for user (used when user not have workspace)
export async function initWorkspace(data: { name: string; slug: string }): Promise<ActionResponse> {
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

            await tx.user.update({
                where: { id: session.data.user.id },
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
            message: "Workspace created successfully"
        };
    } catch (error) {
        return handleActionError(error);
    }
}

export async function createDataModel(workspaceSlug: string, data: CreateDataModelSchema): Promise<ActionResponse> {
    try {
        const validatedData = createDataModelSchema.parse(data);

        const workspace = await db.workspace.findUnique({
            where: { slug: workspaceSlug },
            select: { id: true }
        });

        if (!workspace) {
            throw new AppError("Workspace not found", 404);
        }

        const dataModel = await db.$transaction(async (tx) => {
            const model = await tx.dataModel.create({
                data: {
                    name: validatedData.name,
                    description: validatedData.description,
                    dbType: validatedData.dbType,
                    workspace: {
                        connect: { id: workspace.id }
                    }
                },
            });

            if (validatedData.tags?.length) {
                await handleTags(tx, model.id, validatedData.tags);
            }

            return model;
        });

        return {
            success: true,
            data: dataModel,
            message: "Data model created successfully"
        };
    } catch (error) {
        return handleActionError(error);
    }
}


async function handleTags(tx: Prisma.TransactionClient, modelId: string, tags: string[]) {
    const upserted = await Promise.all(
        tags.map((name) =>
            tx.tag.upsert({
                where: { name },
                update: {},
                create: { name },
            })
        )
    );

    await tx.dataModelTag.createMany({
        data: upserted.map((tag) => ({
            dataModelId: modelId,
            tagId: tag.id,
        })),
        skipDuplicates: true,
    });
}

async function handleDeleteTags(
    tx: Prisma.TransactionClient,
    modelId: string,
    tagNames: string[]
) {
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
}

async function handleUpdateTags(
    tx: Prisma.TransactionClient,
    modelId: string,
    newTagNames: string[]
) {
    const existing = await tx.dataModelTag.findMany({
        where: { dataModelId: modelId },
        include: { tag: true },
    });

    const existingNames = existing.map((t) => t.tag.name);

    const toAdd = newTagNames.filter((t) => !existingNames.includes(t));
    const toRemove = existingNames.filter((t) => !newTagNames.includes(t));

    await handleDeleteTags(tx, modelId, toRemove);
    await handleTags(tx, modelId, toAdd);
}