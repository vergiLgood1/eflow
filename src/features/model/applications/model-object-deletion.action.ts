"use server";

import { db } from "@/db/prisma";
import { createActivityLog } from "@/features/activity/applications/activity.action";
import { ActionResponse, handleActionError } from "@/shared/lib/error";
import {
  requireRelationshipMember,
  requireTableMember,
  requireViewMember,
} from "./model-access";

export async function deleteTable(tableId: string): Promise<ActionResponse> {
  try {
    const { user, table } = await requireTableMember(tableId);

    await db.table.delete({ where: { id: tableId } });

    await createActivityLog({
      dataModelId: table.dataModelId,
      userId: user.id,
      action: `Deleted table "${table.name}"`,
      details: {
        type: "delete",
        category: "Table",
        target: table.name,
      },
    });

    return { success: true, message: "Table deleted successfully" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteRelationship(
  relationshipId: string,
): Promise<ActionResponse> {
  try {
    const { user, relationship } =
      await requireRelationshipMember(relationshipId);

    await db.relationship.delete({ where: { id: relationshipId } });

    await createActivityLog({
      dataModelId: relationship.dataModelId,
      userId: user.id,
      action: `Deleted relationship between "${relationship.sourceColumn.table.name}" and "${relationship.targetColumn.table.name}"`,
      details: {
        type: "delete",
        category: "Relationship",
        target: `${relationship.sourceColumn.table.name} -> ${relationship.targetColumn.table.name}`,
      },
    });

    return { success: true, message: "Relationship deleted successfully" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteView(viewId: string): Promise<ActionResponse> {
  try {
    const { user, view } = await requireViewMember(viewId);

    await db.view.delete({ where: { id: viewId } });

    await createActivityLog({
      dataModelId: view.dataModelId,
      userId: user.id,
      action: `Deleted view "${view.name}"`,
      details: {
        type: "delete",
        category: "View",
        target: view.name,
      },
    });

    return { success: true, message: "View deleted successfully" };
  } catch (error) {
    return handleActionError(error);
  }
}
