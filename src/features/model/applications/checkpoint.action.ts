"use server";

import { db } from "@/db/prisma";
import { Prisma } from "../../../../prisma/generated";
import {
  ActionResponse,
  AppError,
  handleActionError,
} from "@/shared/lib/error";
import { requireCurrentUser, requireDataModelMember } from "./model-access";

type MigrationColumn = {
  id: string;
  name: string;
  type?: string | null;
  isNullable?: boolean;
  isPrimaryKey?: boolean;
  default?: string | null;
};

type MigrationTable = {
  id: string;
  name: string;
  columns: MigrationColumn[];
};

type CheckpointSnapshot = {
  tables?: MigrationTable[];
};

// ---------------------------------------------------------------------------
// Checkpoint Actions
// ---------------------------------------------------------------------------

export async function createCheckpoint(
  dataModelId: string,
  name: string,
): Promise<ActionResponse> {
  try {
    const user = await requireCurrentUser();
    const model = await db.dataModel.findUnique({
      where: { id: dataModelId },
      include: {
        workspace: { include: { members: true } },
        tables: {
          include: {
            columns: true,
            indexes: true,
            triggers: true,
          },
        },
        relationships: true,
        views: true,
        procedures: true,
      },
    });

    if (!model) throw new AppError("Data model not found", 404);

    const isMember = model.workspace.members.some(
      (member) => member.userId === user.id,
    );
    if (!isMember) throw new AppError("Unauthorized", 403);

    // Omit workspace from snapshot to keep it clean
    const snapshotData: Omit<typeof model, "workspace"> & {
      workspace?: unknown;
    } = { ...model };
    delete snapshotData.workspace;

    await db.checkpoint.create({
      data: {
        dataModelId,
        name,
        snapshot: snapshotData as unknown as Prisma.InputJsonValue,
      },
    });

    return { success: true, message: "Checkpoint created successfully" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function getCheckpoints(
  dataModelId: string,
): Promise<ActionResponse> {
  try {
    await requireDataModelMember(dataModelId);

    const checkpoints = await db.checkpoint.findMany({
      where: { dataModelId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true }, // Don't fetch full snapshot for list
    });

    return { success: true, data: checkpoints };
  } catch (error) {
    return handleActionError(error);
  }
}

// ---------------------------------------------------------------------------
// Basic Migration Generator
// ---------------------------------------------------------------------------

export async function generateMigration(
  dataModelId: string,
  fromCheckpointId?: string,
): Promise<ActionResponse> {
  try {
    await requireDataModelMember(dataModelId);

    const model = await db.dataModel.findUnique({
      where: { id: dataModelId },
      include: {
        tables: {
          include: { columns: true },
        },
      },
    });

    if (!model) throw new AppError("Data model not found", 404);

    let previousSnapshot: CheckpointSnapshot = { tables: [] };

    if (fromCheckpointId) {
      const cp = await db.checkpoint.findUnique({
        where: { id: fromCheckpointId, dataModelId },
      });
      if (!cp) throw new AppError("Checkpoint not found", 404);
      previousSnapshot = cp.snapshot as CheckpointSnapshot;
    }

    let sql = `-- Migration script generated from Eflow\n\n`;

    const oldTables: MigrationTable[] = previousSnapshot.tables || [];
    const newTables: MigrationTable[] = model.tables || [];

    // Simple Diff Engine
    const oldTableIds = oldTables.map((t) => t.id);
    const newTableIds = newTables.map((t) => t.id);

    const addedTables = newTables.filter((t) => !oldTableIds.includes(t.id));
    const removedTables = oldTables.filter((t) => !newTableIds.includes(t.id));
    const keptTables = newTables.filter((t) => oldTableIds.includes(t.id));

    // 1. Create Tables
    for (const t of addedTables) {
      sql += `CREATE TABLE "${t.name}" (\n`;
      const cols = t.columns.map((c) => {
        const nullStr = c.isNullable ? "" : " NOT NULL";
        const pkStr = c.isPrimaryKey ? " PRIMARY KEY" : "";
        const defStr = c.default ? ` DEFAULT ${c.default}` : "";
        return `  "${c.name}" ${c.type || "VARCHAR"}${nullStr}${pkStr}${defStr}`;
      });
      sql += cols.join(",\n");
      sql += `\n);\n\n`;
    }

    // 2. Alter Tables
    for (const t of keptTables) {
      const oldT = oldTables.find((ot) => ot.id === t.id);
      if (!oldT) continue;

      const oldColIds = oldT.columns.map((c) => c.id);
      const newColIds = t.columns.map((c) => c.id);

      const addedCols = t.columns.filter((c) => !oldColIds.includes(c.id));
      const removedCols = oldT.columns.filter(
        (c) => !newColIds.includes(c.id),
      );

      for (const c of addedCols) {
        const nullStr = c.isNullable ? "" : " NOT NULL";
        const pkStr = c.isPrimaryKey ? " PRIMARY KEY" : "";
        const defStr = c.default ? ` DEFAULT ${c.default}` : "";
        sql += `ALTER TABLE "${t.name}" ADD COLUMN "${c.name}" ${c.type || "VARCHAR"}${nullStr}${pkStr}${defStr};\n`;
      }

      for (const c of removedCols) {
        sql += `ALTER TABLE "${t.name}" DROP COLUMN "${c.name}";\n`;
      }
    }

    // 3. Drop Tables
    for (const t of removedTables) {
      sql += `DROP TABLE "${t.name}";\n`;
    }

    if (sql.trim() === "-- Migration script generated from Eflow") {
      sql += "-- No schema changes detected.\n";
    }

    return { success: true, data: { sql } };
  } catch (error) {
    return handleActionError(error);
  }
}
