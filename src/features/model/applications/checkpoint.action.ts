"use server";

import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";
import { ActionResponse, AppError, handleActionError } from "@/shared/lib/error";

// ---------------------------------------------------------------------------
// Checkpoint Actions
// ---------------------------------------------------------------------------

export async function createCheckpoint(
    dataModelId: string,
    name: string
): Promise<ActionResponse> {
    try {
        const session = await auth.getSession();
        if (!session.data?.user) throw new AppError("Unauthorized", 401);

        const model = await db.dataModel.findUnique({
            where: { id: dataModelId },
            include: {
                workspace: { include: { members: true } },
                tables: {
                    include: {
                        columns: true,
                        indexes: true,
                        triggers: true,
                    }
                },
                relationships: true,
                views: true,
                procedures: true,
            },
        });

        if (!model) throw new AppError("Data model not found", 404);

        const isMember = model.workspace.members.some(
            (m) => m.userId === session.data?.user.id
        );
        if (!isMember) throw new AppError("Unauthorized", 403);

        // Omit workspace from snapshot to keep it clean
        const { workspace, ...snapshotData } = model;

        await db.checkpoint.create({
            data: {
                dataModelId,
                name,
                snapshot: snapshotData as any,
            },
        });

        return { success: true, message: "Checkpoint created successfully" };
    } catch (error) {
        return handleActionError(error);
    }
}

export async function getCheckpoints(
    dataModelId: string
): Promise<ActionResponse> {
    try {
        const session = await auth.getSession();
        if (!session.data?.user) throw new AppError("Unauthorized", 401);

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
    fromCheckpointId?: string
): Promise<ActionResponse> {
    try {
        const session = await auth.getSession();
        if (!session.data?.user) throw new AppError("Unauthorized", 401);

        const model = await db.dataModel.findUnique({
            where: { id: dataModelId },
            include: {
                tables: {
                    include: { columns: true }
                },
            },
        });

        if (!model) throw new AppError("Data model not found", 404);

        let previousSnapshot: any = { tables: [] };

        if (fromCheckpointId) {
            const cp = await db.checkpoint.findUnique({
                where: { id: fromCheckpointId },
            });
            if (!cp) throw new AppError("Checkpoint not found", 404);
            previousSnapshot = cp.snapshot;
        }

        let sql = `-- Migration script generated from Eflow\n\n`;

        const oldTables = previousSnapshot.tables || [];
        const newTables = model.tables || [];

        // Simple Diff Engine
        const oldTableIds = oldTables.map((t: any) => t.id);
        const newTableIds = newTables.map((t: any) => t.id);

        const addedTables = newTables.filter((t: any) => !oldTableIds.includes(t.id));
        const removedTables = oldTables.filter((t: any) => !newTableIds.includes(t.id));
        const keptTables = newTables.filter((t: any) => oldTableIds.includes(t.id));

        // 1. Create Tables
        for (const t of addedTables) {
            sql += `CREATE TABLE "${t.name}" (\n`;
            const cols = t.columns.map((c: any) => {
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
            const oldT = oldTables.find((ot: any) => ot.id === t.id);
            if (!oldT) continue;

            const oldColIds = oldT.columns.map((c: any) => c.id);
            const newColIds = t.columns.map((c: any) => c.id);

            const addedCols = t.columns.filter((c: any) => !oldColIds.includes(c.id));
            const removedCols = oldT.columns.filter((c: any) => !newColIds.includes(c.id));

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
