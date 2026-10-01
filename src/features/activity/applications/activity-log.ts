import { db } from "@/db/prisma";
import type { ActivityFieldChange, ActivityType } from "../types/activity";

export type ActivityLogDetails = {
  type: ActivityType;
  category: string;
  target: string;
  changes?: ActivityFieldChange[];
};

export interface CreateActivityLogParams {
  dataModelId: string;
  userId: string;
  action: string;
  details: ActivityLogDetails;
}

/**
 * Append an entry to the activity feed of a data model.
 *
 * This lives outside `activity.action.ts` on purpose: a `"use server"` module
 * publishes every export as a network-reachable action, and an insert primitive
 * that trusts its `userId` argument must never be one of those. Callers resolve
 * the actor from their own session guard and then write the log.
 *
 * Failures are swallowed because an audit trail must not fail the mutation it
 * describes; the error is logged for operators instead.
 */
export async function createActivityLog(
  params: CreateActivityLogParams,
): Promise<void> {
  try {
    await db.activityLog.create({
      data: {
        dataModelId: params.dataModelId,
        userId: params.userId,
        action: params.action,
        details: params.details,
      },
    });
  } catch (error) {
    console.error("Error creating activity log:", error);
  }
}
