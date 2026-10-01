import { db } from "@/db/prisma";
import { requireUser } from "@/features/authentication/lib/auth-guard";
import { AppError } from "@/shared/lib/error";

export async function requireCurrentUser() {
  return requireUser();
}

export async function requireDataModelMember(dataModelId: string) {
  const user = await requireCurrentUser();

  const model = await db.dataModel.findUnique({
    where: { id: dataModelId },
    select: {
      id: true,
      workspaceId: true,
    },
  });

  if (!model) throw new AppError("Data model not found", 404);

  const membership = await db.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: model.workspaceId,
        userId: user.id,
      },
    },
    select: { id: true },
  });

  if (!membership) throw new AppError("Unauthorized", 403);

  return { user, model };
}

/**
 * Load a data model together with the columns every mutation needs, and prove
 * in the same round trip that the current user is a member of the workspace
 * that owns it.
 *
 * Mutation actions must resolve the model through this helper instead of
 * `findUnique({ where: { id } })`: an id taken from a client argument is not
 * evidence that the caller is allowed to touch that row.
 *
 * @throws {AppError} 401 without a session, 404 when the model is missing, 403
 * when the caller is not a member of the owning workspace.
 */
export async function requireMutableDataModel(dataModelId: string) {
  const user = await requireCurrentUser();

  const model = await db.dataModel.findUnique({
    where: { id: dataModelId },
    select: {
      id: true,
      name: true,
      isPublic: true,
      isPinned: true,
      workspaceId: true,
      workspace: {
        select: {
          members: {
            where: { userId: user.id },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!model) throw new AppError("Data model not found", 404);

  if (model.workspace.members.length === 0) {
    throw new AppError("Forbidden", 403);
  }

  return { user, model };
}

export async function requireTableMember(tableId: string) {
  const user = await requireCurrentUser();

  const table = await db.table.findUnique({
    where: { id: tableId },
    include: {
      dataModel: { include: { workspace: { include: { members: true } } } },
    },
  });

  if (!table) throw new AppError("Table not found", 404);

  const isMember = table.dataModel.workspace.members.some(
    (member) => member.userId === user.id,
  );
  if (!isMember) throw new AppError("Unauthorized", 403);

  return { user, table };
}

export async function requireRelationshipMember(relationshipId: string) {
  const user = await requireCurrentUser();

  const relationship = await db.relationship.findUnique({
    where: { id: relationshipId },
    include: {
      dataModel: { include: { workspace: { include: { members: true } } } },
      sourceColumn: { include: { table: true } },
      targetColumn: { include: { table: true } },
    },
  });

  if (!relationship) throw new AppError("Relationship not found", 404);

  const isMember = relationship.dataModel.workspace.members.some(
    (member) => member.userId === user.id,
  );
  if (!isMember) throw new AppError("Unauthorized", 403);

  return { user, relationship };
}

export async function requireViewMember(viewId: string) {
  const user = await requireCurrentUser();

  const view = await db.view.findUnique({
    where: { id: viewId },
    include: {
      dataModel: { include: { workspace: { include: { members: true } } } },
    },
  });

  if (!view) throw new AppError("View not found", 404);

  const isMember = view.dataModel.workspace.members.some(
    (member) => member.userId === user.id,
  );
  if (!isMember) throw new AppError("Unauthorized", 403);

  return { user, view };
}

export async function requireTriggerMember(triggerId: string) {
  const user = await requireCurrentUser();

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
    (member) => member.userId === user.id,
  );
  if (!isMember) throw new AppError("Unauthorized", 403);

  return { user, trigger };
}

export async function requireProcedureMember(procedureId: string) {
  const user = await requireCurrentUser();

  const procedure = await db.procedure.findUnique({
    where: { id: procedureId },
    include: {
      dataModel: { include: { workspace: { include: { members: true } } } },
    },
  });

  if (!procedure) throw new AppError("Procedure not found", 404);

  const isMember = procedure.dataModel.workspace.members.some(
    (member) => member.userId === user.id,
  );
  if (!isMember) throw new AppError("Unauthorized", 403);

  return { user, procedure };
}
