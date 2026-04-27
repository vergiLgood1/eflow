"use server";

import { db } from "@/db/prisma";
import { ExploreData, ExploreModel } from "../types/explore";
import { formatDistanceToNow } from "date-fns";

export async function getPublicDataModels(query?: string, page: number = 1): Promise<ExploreData> {
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = {
        isPublic: true,
        ...(query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' as const } },
                { description: { contains: query, mode: 'insensitive' as const } },
                { workspace: { name: { contains: query, mode: 'insensitive' as const } } }
            ]
        } : {})
    };

    const [models, total] = await Promise.all([
        db.dataModel.findMany({
            where,
            include: {
                workspace: true,
            },
            orderBy: {
                updatedAt: 'desc'
            },
            take: limit,
            skip,
        }),
        db.dataModel.count({ where })
    ]);

    const exploreModels: ExploreModel[] = models.map((model) => ({
        id: model.id,
        name: model.name,
        owner: model.workspace.name,
        workspaceSlug: model.workspace.slug,
        updatedAt: formatDistanceToNow(new Date(model.updatedAt), { addSuffix: false }),
        isPublic: model.isPublic,
        previewColor: model.previewColor || "rgb(99, 102, 241)", // default color
    }));

    return {
        models: exploreModels,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}
