"use server";

import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";
import { ActionResponse, AppError, handleActionError } from "@/shared/lib/error";
import { CreateDataModelSchema, createDataModelSchema, createWorkspaceSchema } from "../types/workspace.schema";


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
export async function getWorkspaceCountByUserId(userId: string): Promise<number> {
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
                const upserted = await Promise.all(
                    validatedData.tags.map((name) =>
                        tx.tag.upsert({
                            where: { name },
                            update: {},
                            create: { name },
                        })
                    )
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

        return {
            success: true,
            data: dataModel,
            message: "Data model created successfully"
        };
    } catch (error) {
        return handleActionError(error);
    }
}

export async function updateDataModelTags(modelId: string, tags: string[]): Promise<ActionResponse> {
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
            message: "Tags updated successfully"
        };
    } catch (error) {
        return handleActionError(error);
    }
}

export async function addDataModelTags(modelId: string, tags: string[]): Promise<ActionResponse> {
    try {
        await db.$transaction(async (tx) => {
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
        });

        return {
            success: true,
            message: "Tags added successfully"
        };
    } catch (error) {
        return handleActionError(error);
    }
}

export async function deleteDataModelTags(modelId: string, tagNames: string[]): Promise<ActionResponse> {
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
            message: "Tags deleted successfully"
        };
    } catch (error) {
        return handleActionError(error);
    }
}