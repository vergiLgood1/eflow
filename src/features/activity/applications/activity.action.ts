"use server";

import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";
import { AppError, handleActionError } from "@/shared/lib/error";
import { ActivityItemData, ActivityStats } from "../types/activity";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export async function getActivityLogs(workspaceSlug: string): Promise<ActivityItemData[]> {
    try {
        const workspace = await db.workspace.findUnique({
            where: { slug: workspaceSlug },
            select: { id: true }
        });

        if (!workspace) {
            throw new AppError("Workspace not found", 404);
        }

        const logs = await db.activityLog.findMany({
            where: {
                dataModel: {
                    workspaceId: workspace.id
                }
            },
            include: {
                user: true,
                dataModel: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50 // Limit to latest 50
        });

        return logs.map(log => {
            const details = log.details as any;
            return {
                id: log.id,
                user: log.user.name,
                action: log.action,
                category: details?.category || "General",
                target: details?.target || log.dataModel.name,
                type: (details?.type as any) || "update",
                relativeTime: formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: enUS }),
                timestamp: new Date(log.createdAt).toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric', 
                    hour: 'numeric', 
                    minute: '2-digit' 
                }),
                changes: details?.changes || []
            };
        });
    } catch (error) {
        console.error("Error fetching activity logs:", error);
        return [];
    }
}

export async function getActivityStats(workspaceSlug: string): Promise<ActivityStats> {
    try {
        const workspace = await db.workspace.findUnique({
            where: { slug: workspaceSlug },
            select: { id: true }
        });

        if (!workspace) return { total: 0, creations: 0, updates: 0, deletions: 0 };

        const logs = await db.activityLog.findMany({
            where: {
                dataModel: {
                    workspaceId: workspace.id
                }
            },
            select: {
                action: true,
                details: true
            }
        });

        const stats: ActivityStats = {
            total: logs.length,
            creations: logs.filter(l => (l.details as any)?.type === 'create').length,
            updates: logs.filter(l => (l.details as any)?.type === 'update' || !l.details).length,
            deletions: logs.filter(l => (l.details as any)?.type === 'delete').length
        };

        return stats;
    } catch (error) {
        return { total: 0, creations: 0, updates: 0, deletions: 0 };
    }
}

export async function getVersionHistory(objectId: string, type: 'view' | 'trigger' | 'procedure') {
    try {
        const where: any = {};
        if (type === 'view') where.viewId = objectId;
        if (type === 'trigger') where.triggerId = objectId;
        if (type === 'procedure') where.procedureId = objectId;

        return await db.versionHistory.findMany({
            where,
            orderBy: {
                version: 'desc'
            }
        });
    } catch (error) {
        console.error("Error fetching version history:", error);
        return [];
    }
}
