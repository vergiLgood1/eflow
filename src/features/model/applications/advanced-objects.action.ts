"use server";

import { db } from "@/db/prisma";
import { ActionResponse, handleActionError } from "@/shared/lib/error";
import { createActivityLog } from "@/features/activity/applications/activity.action";
import {
  requireDataModelMember,
  requireProcedureMember,
  requireTableMember,
  requireTriggerMember,
} from "./model-access";

type TriggerPayload = {
  name: string;
  event: string;
  timing: string;
  body: string;
  level: string;
};

type ProcedurePayload = {
  name: string;
  description?: string;
  language: string;
  securityType: string;
  dataAccess: string;
  isDeterministic: boolean;
  body: string;
  parameters?: Record<string, unknown> | unknown[];
};

// ---------------------------------------------------------------------------
// Trigger Actions
// ---------------------------------------------------------------------------

export async function createTrigger(
  tableId: string,
  payload: TriggerPayload,
): Promise<ActionResponse> {
  try {
    const { user, table } = await requireTableMember(tableId);

    const trigger = await db.trigger.create({
      data: {
        tableId,
        name: payload.name,
        event: payload.event,
        timing: payload.timing,
        body: payload.body,
        level: payload.level,
      },
    });

    // Create initial VersionHistory
    await db.versionHistory.create({
      data: {
        triggerId: trigger.id,
        version: 1,
        snapshot: { ...payload },
        userId: user.id,
      },
    });

    await createActivityLog({
      dataModelId: table.dataModelId,
      userId: user.id,
      action: `Created trigger "${payload.name}" on table "${table.name}"`,
      details: {
        type: "create",
        category: "Trigger",
        target: payload.name,
      },
    });

    return { success: true, message: "Trigger created successfully" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateTrigger(
  triggerId: string,
  payload: TriggerPayload,
): Promise<ActionResponse> {
  try {
    const { user, trigger: existing } = await requireTriggerMember(triggerId);

    await db.trigger.update({
      where: { id: triggerId },
      data: { ...payload },
    });

    // Create VersionHistory if body or name changed
    if (existing.body !== payload.body || existing.name !== payload.name) {
      const versionCount = await db.versionHistory.count({
        where: { triggerId },
      });
      await db.versionHistory.create({
        data: {
          triggerId,
          version: versionCount + 1,
          snapshot: { ...payload },
          userId: user.id,
        },
      });
    }

    await createActivityLog({
      dataModelId: existing.table.dataModelId,
      userId: user.id,
      action: `Updated trigger "${payload.name}"`,
      details: {
        type: "update",
        category: "Trigger",
        target: payload.name,
      },
    });

    return { success: true, message: "Trigger updated successfully" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteTrigger(
  triggerId: string,
): Promise<ActionResponse> {
  try {
    const { user, trigger } = await requireTriggerMember(triggerId);

    await db.trigger.delete({
      where: { id: triggerId },
    });

    await createActivityLog({
      dataModelId: trigger.table.dataModelId,
      userId: user.id,
      action: `Deleted trigger "${trigger.name}"`,
      details: {
        type: "delete",
        category: "Trigger",
        target: trigger.name,
      },
    });

    return { success: true, message: "Trigger deleted successfully" };
  } catch (error) {
    return handleActionError(error);
  }
}

// ---------------------------------------------------------------------------
// Procedure Actions
// ---------------------------------------------------------------------------

export async function createProcedure(
  dataModelId: string,
  payload: ProcedurePayload,
): Promise<ActionResponse> {
  try {
    const { user } = await requireDataModelMember(dataModelId);

    const procedure = await db.procedure.create({
      data: {
        dataModelId,
        name: payload.name,
        description: payload.description,
        language: payload.language,
        securityType: payload.securityType,
        dataAccess: payload.dataAccess,
        isDeterministic: payload.isDeterministic,
        body: payload.body,
        parameters: payload.parameters,
      },
    });

    // Create initial VersionHistory
    await db.versionHistory.create({
      data: {
        procedureId: procedure.id,
        version: 1,
        snapshot: { ...payload },
        userId: user.id,
      },
    });

    await createActivityLog({
      dataModelId,
      userId: user.id,
      action: `Created procedure "${payload.name}"`,
      details: {
        type: "create",
        category: "Procedure",
        target: payload.name,
      },
    });

    return { success: true, message: "Procedure created successfully" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateProcedure(
  procedureId: string,
  payload: ProcedurePayload,
): Promise<ActionResponse> {
  try {
    const { user, procedure: existing } =
      await requireProcedureMember(procedureId);

    await db.procedure.update({
      where: { id: procedureId },
      data: { ...payload },
    });

    // Create VersionHistory if body or name changed
    if (existing.body !== payload.body || existing.name !== payload.name) {
      const versionCount = await db.versionHistory.count({
        where: { procedureId },
      });
      await db.versionHistory.create({
        data: {
          procedureId,
          version: versionCount + 1,
          snapshot: { ...payload },
          userId: user.id,
        },
      });
    }

    await createActivityLog({
      dataModelId: existing.dataModelId,
      userId: user.id,
      action: `Updated procedure "${payload.name}"`,
      details: {
        type: "update",
        category: "Procedure",
        target: payload.name,
      },
    });

    return { success: true, message: "Procedure updated successfully" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteProcedure(
  procedureId: string,
): Promise<ActionResponse> {
  try {
    const { user, procedure } = await requireProcedureMember(procedureId);

    await db.procedure.delete({
      where: { id: procedureId },
    });

    await createActivityLog({
      dataModelId: procedure.dataModelId,
      userId: user.id,
      action: `Deleted procedure "${procedure.name}"`,
      details: {
        type: "delete",
        category: "Procedure",
        target: procedure.name,
      },
    });

    return { success: true, message: "Procedure deleted successfully" };
  } catch (error) {
    return handleActionError(error);
  }
}
