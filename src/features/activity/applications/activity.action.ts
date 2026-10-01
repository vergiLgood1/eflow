"use server";

import { db } from "@/db/prisma";
import { requireWorkspaceMemberBySlug } from "@/features/workspace/applications/workspace-access";
import { ActivityItemData, ActivityStats } from "../types/activity";
import { formatDistanceToNow, subDays } from "date-fns";
import { enUS } from "date-fns/locale";
import type { Prisma } from "../../../../prisma/generated";
import type { ActivityType } from "../types/activity";
import type { ActivityLogDetails } from "./activity-log";

const ACTIVITY_TYPES: ActivityType[] = ["create", "update", "delete"];
const ACTIVITY_FEED_LIMIT = 50;

interface ActivityFilters {
  category?: string;
  time?: string;
}

/**
 * Narrow the untyped `details` jsonb column.
 *
 * Rows were written by older code paths, so the shape is not guaranteed; the
 * feed treats a malformed payload as "no metadata" instead of trusting it.
 */
function readActivityDetails(
  value: Prisma.JsonValue | null,
): ActivityLogDetails | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const candidate = value as Record<string, unknown>;

  if (!ACTIVITY_TYPES.includes(candidate.type as ActivityType)) return null;

  return {
    type: candidate.type as ActivityType,
    category:
      typeof candidate.category === "string" ? candidate.category : "General",
    target: typeof candidate.target === "string" ? candidate.target : "",
    changes: Array.isArray(candidate.changes)
      ? (candidate.changes as ActivityLogDetails["changes"])
      : undefined,
  };
}

/**
 * Shared filter for every workspace-scoped activity query.
 */
function buildActivityWhere(
  workspaceId: string,
  filters?: ActivityFilters,
): Prisma.ActivityLogWhereInput {
  const where: Prisma.ActivityLogWhereInput = {
    dataModel: { workspaceId },
  };

  // The feed filters on the operation type stored inside the details jsonb.
  if (filters?.category && filters.category !== "all") {
    where.details = { path: ["type"], equals: filters.category };
  }

  if (filters?.time && filters.time !== "max") {
    const days = filters.time === "24h" ? 1 : filters.time === "7d" ? 7 : 30;
    where.createdAt = { gte: subDays(new Date(), days) };
  }

  return where;
}

/**
 * Latest activity entries for one workspace, for the activity page.
 *
 * Authorization is not optional here: the slug arrives through the URL, so
 * without the membership check any signed-in user could read the full change
 * history — table names, schema edits and who made them — of a workspace they
 * do not belong to.
 */
export async function getActivityLogs(
  workspaceSlug: string,
  filters?: ActivityFilters,
): Promise<ActivityItemData[]> {
  const { workspace } = await requireWorkspaceMemberBySlug(workspaceSlug);

  const logs = await db.activityLog.findMany({
    where: buildActivityWhere(workspace.id, filters),
    // The feed only renders the actor's display name, so only that column may
    // leave the database. `include: { user: true }` shipped the whole user row
    // — email and profile included — into the server component payload.
    select: {
      id: true,
      action: true,
      details: true,
      createdAt: true,
      user: { select: { name: true } },
      dataModel: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: ACTIVITY_FEED_LIMIT,
  });

  return logs.map((log) => {
    const details = readActivityDetails(log.details);

    return {
      id: log.id,
      user: log.user.name,
      action: log.action,
      category: details?.category || "General",
      target: details?.target || log.dataModel.name,
      type: details?.type || "update",
      relativeTime: formatDistanceToNow(new Date(log.createdAt), {
        addSuffix: true,
        locale: enUS,
      }),
      timestamp: new Date(log.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      changes: details?.changes || [],
    };
  });
}

export async function getActivityStats(
  workspaceSlug: string,
  filters?: ActivityFilters,
): Promise<ActivityStats> {
  const { workspace } = await requireWorkspaceMemberBySlug(workspaceSlug);

  const logs = await db.activityLog.findMany({
    where: buildActivityWhere(workspace.id, filters),
    select: { details: true },
  });

  // A row without parsable metadata is counted as an update, matching how the
  // feed renders it, so stats and the list never disagree.
  const types = logs.map((log) => readActivityDetails(log.details)?.type);

  return {
    total: logs.length,
    creations: types.filter((type) => type === "create").length,
    updates: types.filter((type) => type === "update" || !type).length,
    deletions: types.filter((type) => type === "delete").length,
  };
}
