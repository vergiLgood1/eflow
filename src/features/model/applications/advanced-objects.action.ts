"use server";

import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";
import {
  ActionResponse,
  AppError,
  handleActionError,
} from "@/shared/lib/error";
import { createActivityLog } from "@/features/activity/applications/activity.action";

// ---------------------------------------------------------------------------
// Trigger Actions
// ---------------------------------------------------------------------------

export async function createTrigger(
  tableId: string,
  payload: {
    name: string;
    event: string;
    timing: string;
    body: string;
    level: string;
  },
): Promise<ActionResponse> {
  try {
    const session = await auth.getSession();
    if (!session.data?.user) throw new AppError("Unauthorized", 401);

    const table = await db.table.findUnique({
      where: { id: tableId },
      include: {
        dataModel: { include: { workspace: { include: { members: true } } } },
      },
    });

    if (!table) throw new AppError("Table not found", 404);

    const isMember = table.dataModel.workspace.members.some(
      (m) => m.userId === session.data?.user.id,
    );
    if (!isMember) throw new AppError("Unauthorized", 403);

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
        userId: session.data.user.id,
      },
    });

    await createActivityLog({
      dataModelId: table.dataModelId,
      userId: session.data.user.id,
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
  payload: {
    name: string;
    event: string;
    timing: string;
    body: string;
    level: string;
  },
): Promise<ActionResponse> {
  try {
    const session = await auth.getSession();
    if (!session.data?.user) throw new AppError("Unauthorized", 401);

    const existing = await db.trigger.findUnique({
      where: { id: triggerId },
      include: {
        table: {
          include: {
            dataModel: {
              include: { workspace: { include: { members: true } } },
            },
          },
        },
      },
    });

    if (!existing) throw new AppError("Trigger not found", 404);

    const isMember = existing.table.dataModel.workspace.members.some(
      (m) => m.userId === session.data?.user.id,
    );
    if (!isMember) throw new AppError("Unauthorized", 403);

    const updated = await db.trigger.update({
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
          userId: session.data.user.id,
        },
      });
    }

    await createActivityLog({
      dataModelId: existing.table.dataModelId,
      userId: session.data.user.id,
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
    const session = await auth.getSession();
    if (!session.data?.user) throw new AppError("Unauthorized", 401);

    const trigger = await db.trigger.findUnique({
      where: { id: triggerId },
      include: {
        table: {
          include: {
            dataModel: {
              include: { workspace: { include: { members: true } } },
            },
          },
        },
      },
    });

    if (!trigger) throw new AppError("Trigger not found", 404);

    const isMember = trigger.table.dataModel.workspace.members.some(
      (m) => m.userId === session.data?.user.id,
    );
    if (!isMember) throw new AppError("Unauthorized", 403);

    await db.trigger.delete({
      where: { id: triggerId },
    });

    await createActivityLog({
      dataModelId: trigger.table.dataModelId,
      userId: session.data.user.id,
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
  payload: {
    name: string;
    description?: string;
    language: string;
    securityType: string;
    dataAccess: string;
    isDeterministic: boolean;
    body: string;
    parameters?: any;
  },
): Promise<ActionResponse> {
  try {
    const session = await auth.getSession();
    if (!session.data?.user) throw new AppError("Unauthorized", 401);

    const model = await db.dataModel.findUnique({
      where: { id: dataModelId },
      include: { workspace: { include: { members: true } } },
    });

    if (!model) throw new AppError("Data model not found", 404);

    const isMember = model.workspace.members.some(
      (m) => m.userId === session.data?.user.id,
    );
    if (!isMember) throw new AppError("Unauthorized", 403);

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
        userId: session.data.user.id,
      },
    });

    await createActivityLog({
      dataModelId,
      userId: session.data.user.id,
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
  payload: {
    name: string;
    description?: string;
    language: string;
    securityType: string;
    dataAccess: string;
    isDeterministic: boolean;
    body: string;
    parameters?: any;
  },
): Promise<ActionResponse> {
  try {
    const session = await auth.getSession();
    if (!session.data?.user) throw new AppError("Unauthorized", 401);

    const existing = await db.procedure.findUnique({
      where: { id: procedureId },
      include: {
        dataModel: { include: { workspace: { include: { members: true } } } },
      },
    });

    if (!existing) throw new AppError("Procedure not found", 404);

    const isMember = existing.dataModel.workspace.members.some(
      (m) => m.userId === session.data?.user.id,
    );
    if (!isMember) throw new AppError("Unauthorized", 403);

    const updated = await db.procedure.update({
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
          userId: session.data.user.id,
        },
      });
    }

    await createActivityLog({
      dataModelId: existing.dataModelId,
      userId: session.data.user.id,
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
    const session = await auth.getSession();
    if (!session.data?.user) throw new AppError("Unauthorized", 401);

    const procedure = await db.procedure.findUnique({
      where: { id: procedureId },
      include: {
        dataModel: { include: { workspace: { include: { members: true } } } },
      },
    });

    if (!procedure) throw new AppError("Procedure not found", 404);

    const isMember = procedure.dataModel.workspace.members.some(
      (m) => m.userId === session.data?.user.id,
    );
    if (!isMember) throw new AppError("Unauthorized", 403);

    await db.procedure.delete({
      where: { id: procedureId },
    });

    await createActivityLog({
      dataModelId: procedure.dataModelId,
      userId: session.data.user.id,
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
