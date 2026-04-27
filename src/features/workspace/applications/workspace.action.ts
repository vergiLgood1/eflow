"use server";

import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";
import { ActionResponse, AppError, handleActionError } from "@/shared/lib/error";
import { createWorkspaceSchema, createDataModelSchema } from "../types/workspace.schema";


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

export async function createDataModel(workspaceSlug: string, data: { name: string; dbType: string }): Promise<ActionResponse> {
    try {
        const validatedData = createDataModelSchema.parse(data);

        const workspace = await db.workspace.findUnique({
            where: { slug: workspaceSlug },
            select: { id: true }
        });

        if (!workspace) {
            throw new AppError("Workspace not found", 404);
        }

        const dataModel = await db.dataModel.create({
            data: {
                name: validatedData.name,
                dbType: validatedData.dbType,
                workspaceId: workspace.id,
            },
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
