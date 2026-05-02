"use server";

import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";
import { ActionResponse, AppError, handleActionError } from "@/shared/lib/error";
import { Node, Edge } from "@xyflow/react";
import { isTableNode, isRelationshipEdge, TableNodeData, RelationshipEdgeData, isGroupNode, isNoteNode, GroupNodeData, NoteNodeData, isViewNode, ViewNodeData } from "../types/canvas";
import { createActivityLog } from "@/features/activity/applications/activity.action";

export async function syncModelSchema(
    dataModelId: string,
    diagramId: string,
    diagramName: string,
    nodes: Node[],
    edges: Edge[]
): Promise<ActionResponse> {
    try {
        const session = await auth.getSession();
        if (!session.data?.user) throw new AppError("Unauthorized", 401);

        const model = await db.dataModel.findUnique({
            where: { id: dataModelId },
            select: { id: true, workspace: { select: { members: { select: { userId: true } } } } },
        });

        if (!model) throw new AppError("Data model not found", 404);

        const isMember = model.workspace.members.some(
            (m) => m.userId === session.data?.user.id
        );
        if (!isMember) throw new AppError("Unauthorized", 403);

        const userId = session.data.user.id;

        // Collect activity logs to fire AFTER the transaction commits
        const pendingActivityLogs: Parameters<typeof createActivityLog>[0][] = [];

        // Categorize incoming nodes/edges once (pure JS, no DB)
        const incomingTableNodes = nodes.filter(isTableNode);
        const incomingTableIdSet = new Set(incomingTableNodes.map(n => n.id));
        const incomingRelEdges = edges.filter(isRelationshipEdge);
        const incomingRelIdSet = new Set(incomingRelEdges.map(e => e.id));
        const incomingViewNodes = nodes.filter(isViewNode);
        const incomingViewIdSet = new Set(incomingViewNodes.map(n => n.id));
        const incomingGroupNodes = nodes.filter(isGroupNode);
        const incomingGroupIdSet = new Set(incomingGroupNodes.map(n => n.id));
        const incomingNoteNodes = nodes.filter(isNoteNode);
        const incomingNoteIdSet = new Set(incomingNoteNodes.map(n => n.id));

        await db.$transaction(async (tx) => {
            // ── Step 1: Upsert diagram ──────────────────────────────────
            await tx.diagram.upsert({
                where: { id: diagramId },
                update: { name: diagramName, updatedAt: new Date() },
                create: { id: diagramId, dataModelId, name: diagramName, isDraft: false },
            });

            // ── Step 2: Fetch ALL existing state in one parallel batch ──
            const [existingTableNodes, existingRelIds, existingViews, existingGroups, existingNotes] = await Promise.all([
                tx.tableNode.findMany({ where: { diagramId }, select: { id: true, tableId: true, table: { select: { name: true } } } }),
                tx.relationship.findMany({ where: { dataModelId }, select: { id: true } }),
                tx.view.findMany({ where: { dataModelId }, select: { id: true, name: true } }),
                tx.group.findMany({ where: { diagramId }, select: { id: true, name: true } }),
                tx.note.findMany({ where: { diagramId }, select: { id: true } }),
            ]);

            const existingTableIdSet = new Set(existingTableNodes.map(tn => tn.tableId));
            const existingRelIdSet = new Set(existingRelIds.map(r => r.id));
            const existingViewIdSet = new Set(existingViews.map(v => v.id));
            const existingGroupIdSet = new Set(existingGroups.map(g => g.id));
            const existingNoteIdSet = new Set(existingNotes.map(n => n.id));

            // ── Step 3: Batch DELETE all removed entities ────────────────
            const tableIdsToRemove = existingTableNodes
                .filter(tn => !incomingTableIdSet.has(tn.tableId))
                .map(tn => tn.tableId);
            const relIdsToRemove = existingRelIds
                .filter(r => !incomingRelIdSet.has(r.id))
                .map(r => r.id);
            const viewIdsToRemove = existingViews
                .filter(v => !incomingViewIdSet.has(v.id))
                .map(v => v.id);
            const groupIdsToRemove = existingGroups
                .filter(g => !incomingGroupIdSet.has(g.id))
                .map(g => g.id);
            const noteIdsToRemove = existingNotes
                .filter(n => !incomingNoteIdSet.has(n.id))
                .map(n => n.id);

            // Run all deletes in parallel — one query each, not N
            await Promise.all([
                tableIdsToRemove.length > 0
                    ? tx.tableNode.deleteMany({ where: { tableId: { in: tableIdsToRemove }, diagramId } })
                        .then(() => tx.table.deleteMany({ where: { id: { in: tableIdsToRemove } } }))
                    : Promise.resolve(),
                relIdsToRemove.length > 0
                    ? tx.relationship.deleteMany({ where: { id: { in: relIdsToRemove } } })
                    : Promise.resolve(),
                viewIdsToRemove.length > 0
                    ? tx.view.deleteMany({ where: { id: { in: viewIdsToRemove } } })
                    : Promise.resolve(),
                groupIdsToRemove.length > 0
                    ? tx.group.deleteMany({ where: { id: { in: groupIdsToRemove } } })
                    : Promise.resolve(),
                noteIdsToRemove.length > 0
                    ? tx.note.deleteMany({ where: { id: { in: noteIdsToRemove } } })
                    : Promise.resolve(),
            ]);

            // Queue activity logs for deletions
            for (const tn of existingTableNodes.filter(tn => tableIdsToRemove.includes(tn.tableId))) {
                pendingActivityLogs.push({ dataModelId, userId, action: `Deleted table "${tn.table.name}"`, details: { type: "delete", category: "Table", target: tn.table.name } });
            }
            for (const v of existingViews.filter(v => viewIdsToRemove.includes(v.id))) {
                pendingActivityLogs.push({ dataModelId, userId, action: `Deleted view "${v.name}"`, details: { type: "delete", category: "View", target: v.name } });
            }
            for (const g of existingGroups.filter(g => groupIdsToRemove.includes(g.id))) {
                pendingActivityLogs.push({ dataModelId, userId, action: `Deleted group "${g.name}"`, details: { type: "delete", category: "Group", target: g.name } });
            }

            // ── Step 4: Batch DELETE child data for surviving tables ─────
            // Delete ALL columns, indexes, records for incoming tables in one shot each
            // Then recreate with createMany — avoids N per-table delete+create pairs
            if (incomingTableNodes.length > 0) {
                const allTableIds = incomingTableNodes.map(n => n.id);
                await Promise.all([
                    tx.column.deleteMany({ where: { tableId: { in: allTableIds } } }),
                    tx.index.deleteMany({ where: { tableId: { in: allTableIds } } }),
                    tx.recordValue.deleteMany({ where: { record: { tableId: { in: allTableIds } } } }),
                ]);
                // recordValue must be deleted before tableRecord
                await tx.tableRecord.deleteMany({ where: { tableId: { in: allTableIds } } });
            }

            // ── Step 5: Upsert tables + tableNodes (unavoidable per-row) ─
            // Prisma has no batch upsert, but these are lightweight (no child data)
            for (const node of incomingTableNodes) {
                const data = node.data as TableNodeData;
                await tx.table.upsert({
                    where: { id: node.id },
                    update: { name: data.name, color: data.color ?? null, notes: data.notes ?? null, updatedAt: new Date() },
                    create: { id: node.id, name: data.name, dataModelId, color: data.color ?? null, notes: data.notes ?? null },
                });
                await tx.tableNode.upsert({
                    where: { diagramId_tableId: { diagramId, tableId: node.id } },
                    update: { x: node.position.x, y: node.position.y, parentId: node.parentId ?? null, hiddenColumns: data.hiddenColumns ?? [] },
                    create: { diagramId, tableId: node.id, x: node.position.x, y: node.position.y, parentId: node.parentId ?? null, hiddenColumns: data.hiddenColumns ?? [] },
                });

                if (!existingTableIdSet.has(node.id)) {
                    pendingActivityLogs.push({ dataModelId, userId, action: `Created table "${data.name}"`, details: { type: "create", category: "Table", target: data.name } });
                }
            }

            // ── Step 6: Batch CREATE all child data across all tables ────
            // Columns — single createMany for ALL tables
            const allColumns = incomingTableNodes.flatMap(node => {
                const data = node.data as TableNodeData;
                return (data.columns || []).map(col => ({
                    id: col.id, tableId: node.id, name: col.name, type: col.type,
                    isPrimaryKey: col.isPk ?? false, isUnique: col.isUnique ?? false,
                    isAutoIncrement: col.isAutoIncrement ?? false, isNullable: col.nullable ?? true,
                    default: col.defaultValue ?? null, customType: col.customType ?? null,
                }));
            });

            // Indexes — single createMany for ALL tables
            const allIndexes = incomingTableNodes.flatMap(node => {
                const data = node.data as TableNodeData;
                return (data.indexes || []).map(idx => ({
                    id: idx.id, tableId: node.id, name: idx.name,
                    type: idx.type ?? "btree", columns: idx.columns,
                    isUnique: idx.isUnique ?? false,
                }));
            });

            // Records — prepare all records + values for ALL tables
            const allRecordsData: { id: string; tableId: string; order: number }[] = [];
            const allRecordValues: { recordId: string; columnName: string; value: string }[] = [];
            for (const node of incomingTableNodes) {
                const data = node.data as TableNodeData;
                const records = data.records || [];
                for (let i = 0; i < records.length; i++) {
                    const recId = crypto.randomUUID();
                    allRecordsData.push({ id: recId, tableId: node.id, order: i });
                    for (const [columnName, value] of Object.entries(records[i])) {
                        allRecordValues.push({ recordId: recId, columnName, value: String(value ?? "") });
                    }
                }
            }

            // Fire all createMany in parallel — 2-4 queries total for ALL tables
            await Promise.all([
                allColumns.length > 0 ? tx.column.createMany({ data: allColumns }) : Promise.resolve(),
                allIndexes.length > 0 ? tx.index.createMany({ data: allIndexes }) : Promise.resolve(),
                allRecordsData.length > 0 ? tx.tableRecord.createMany({ data: allRecordsData }) : Promise.resolve(),
            ]);
            // recordValues depend on tableRecord IDs existing
            if (allRecordValues.length > 0) {
                await tx.recordValue.createMany({ data: allRecordValues });
            }

            // ── Step 7: Relationships — delete-all + createMany ─────────
            // Delete all existing, then recreate — avoids N upsert round-trips
            await tx.relationship.deleteMany({ where: { dataModelId } });

            const allRelationships = incomingRelEdges
                .map(edge => {
                    const sourceColId = edge.sourceHandle?.replace("-source", "");
                    const targetColId = edge.targetHandle?.replace("-target", "");
                    if (!sourceColId || !targetColId) return null;
                    const data = edge.data as RelationshipEdgeData;
                    return {
                        id: edge.id, dataModelId, sourceColumnId: sourceColId, targetColumnId: targetColId,
                        onDelete: data?.onDelete || "NO ACTION", onUpdate: data?.onUpdate || "NO ACTION",
                        cardinality: data?.cardinality || "1:n", fkName: data?.fkName ?? null,
                    };
                })
                .filter((r): r is NonNullable<typeof r> => r !== null);

            if (allRelationships.length > 0) {
                await tx.relationship.createMany({ data: allRelationships });
            }

            for (const edge of incomingRelEdges) {
                if (!existingRelIdSet.has(edge.id)) {
                    pendingActivityLogs.push({ dataModelId, userId, action: `Created relationship`, details: { type: "create", category: "Relationship", target: `${edge.source} -> ${edge.target}` } });
                }
            }

            // ── Step 8: Views — delete-all + createMany ─────────────────
            await tx.view.deleteMany({ where: { dataModelId } });
            const allViews = incomingViewNodes.map(node => {
                const data = node.data as ViewNodeData;
                return { id: node.id, dataModelId, parentId: node.parentId ?? null, name: data.name, sql: data.query || "", x: node.position.x, y: node.position.y };
            });
            if (allViews.length > 0) {
                await tx.view.createMany({ data: allViews });
            }
            for (const node of incomingViewNodes) {
                if (!existingViewIdSet.has(node.id)) {
                    const data = node.data as ViewNodeData;
                    pendingActivityLogs.push({ dataModelId, userId, action: `Created view "${data.name}"`, details: { type: "create", category: "View", target: data.name } });
                }
            }

            // ── Step 9: Groups — delete-all + createMany ────────────────
            await tx.group.deleteMany({ where: { diagramId } });
            const allGroups = incomingGroupNodes.map(node => {
                const data = node.data as GroupNodeData;
                return {
                    id: node.id, diagramId, parentId: node.parentId ?? null, name: data.name, description: data.description ?? null, color: data.color || "#ffffff",
                    isCollapsed: data.isCollapsed ?? false, expandedHeight: data.expandedHeight ?? null,
                    x: node.position.x, y: node.position.y,
                    width: (node.style?.width as number) ?? (node as Record<string, unknown>).width as number ?? (node.measured?.width ?? 200),
                    height: (node.style?.height as number) ?? (node as Record<string, unknown>).height as number ?? (node.measured?.height ?? 150),
                };
            });
            if (allGroups.length > 0) {
                await tx.group.createMany({ data: allGroups });
            }

            // ── Step 10: Notes — delete-all + createMany ────────────────
            await tx.note.deleteMany({ where: { diagramId } });
            const allNotes = incomingNoteNodes.map(node => {
                const data = node.data as NoteNodeData;
                return { id: node.id, diagramId, parentId: node.parentId ?? null, content: data.content, x: node.position.x, y: node.position.y };
            });
            if (allNotes.length > 0) {
                await tx.note.createMany({ data: allNotes });
            }
        }, { timeout: 15000 });

        // Fire activity logs after transaction commits (non-blocking)
        if (pendingActivityLogs.length > 0) {
            Promise.all(pendingActivityLogs.map(log => createActivityLog(log))).catch(() => {
                // Activity log failures are non-critical
            });
        }

        return { success: true, message: "Model synced successfully" };
    } catch (error) {
        return handleActionError(error);
    }
}

export async function getModelDiagram(
    dataModelId: string,
    diagramId: string
): Promise<ActionResponse<{ nodes: Node[]; edges: Edge[] }>> {
    try {
        const session = await auth.getSession();
        if (!session.data?.user) throw new AppError("Unauthorized", 401);

        const diagram = await db.diagram.findUnique({
            where: { id: diagramId },
            include: {
                nodes: {
                    include: {
                        table: {
                            include: {
                                columns: true,
                                indexes: true,
                                records: {
                                    include: { values: true },
                                    orderBy: { order: "asc" },
                                },
                            }
                        }
                    }
                },
                notes: true,
                groups: true,
                dataModel: {
                    include: {
                        relationships: {
                            include: {
                                sourceColumn: true,
                                targetColumn: true,
                            }
                        },
                        views: true,
                    }
                }
            }
        });

        if (!diagram) {
            return { success: true, data: { nodes: [], edges: [] } };
        }

        const nodes: Node[] = [];
        const edges: Edge[] = [];

        // Map TableNodes
        for (const tn of diagram.nodes) {
            // Convert records from DB format to TableRecord format
            const records = tn.table.records.map(rec => {
                const row: Record<string, string> = {};
                for (const val of rec.values) {
                    row[val.columnName] = val.value;
                }
                return row;
            });

            nodes.push({
                id: tn.tableId,
                type: "table",
                position: { x: tn.x, y: tn.y },
                parentId: tn.parentId ?? undefined,
                data: {
                    name: tn.table.name,
                    color: tn.table.color ?? undefined,
                    notes: tn.table.notes ?? undefined,
                    hiddenColumns: tn.hiddenColumns ?? [],
                    columns: tn.table.columns.map(c => ({
                        id: c.id,
                        name: c.name,
                        type: c.type,
                        isPk: c.isPrimaryKey,
                        isUnique: c.isUnique,
                        isAutoIncrement: c.isAutoIncrement,
                        nullable: c.isNullable,
                        defaultValue: c.default,
                        customType: c.customType,
                    })),
                    indexes: tn.table.indexes.map(idx => ({
                        id: idx.id,
                        name: idx.name,
                        type: idx.type,
                        columns: idx.columns as string[],
                        isUnique: idx.isUnique,
                    })),
                    records: records.length > 0 ? records : undefined,
                } as TableNodeData,
            });
        }

        // Map Views (from dataModel as they are model-wide)
        for (const view of diagram.dataModel.views) {
            nodes.push({
                id: view.id,
                type: "view",
                position: { x: view.x, y: view.y },
                parentId: view.parentId ?? undefined,
                data: {
                    name: view.name,
                    query: view.sql,
                } as ViewNodeData,
            });
        }

        // Map Groups
        for (const group of diagram.groups) {
            nodes.push({
                id: group.id,
                type: "group",
                position: { x: group.x, y: group.y },
                parentId: group.parentId ?? undefined,
                style: { width: group.width, height: group.height },
                measured: { width: group.width, height: group.height },
                data: {
                    name: group.name,
                    description: group.description ?? undefined,
                    color: group.color,
                    isCollapsed: group.isCollapsed,
                    expandedHeight: group.expandedHeight ?? undefined,
                } as GroupNodeData,
            });
        }

        // Map Notes
        for (const note of diagram.notes) {
            nodes.push({
                id: note.id,
                type: "note",
                position: { x: note.x, y: note.y },
                parentId: note.parentId ?? undefined,
                data: {
                    content: note.content,
                } as NoteNodeData,
            });
        }

        // Map Relationships
        for (const rel of diagram.dataModel.relationships) {
            edges.push({
                id: rel.id,
                source: rel.sourceColumn.tableId,
                target: rel.targetColumn.tableId,
                sourceHandle: `${rel.sourceColumnId}-source`,
                targetHandle: `${rel.targetColumnId}-target`,
                type: "relationship",
                data: {
                    cardinality: rel.cardinality || "1:n",
                    fkName: rel.fkName ?? undefined,
                    onDelete: rel.onDelete,
                    onUpdate: rel.onUpdate,
                } as RelationshipEdgeData,
            });
        }

        return { success: true, data: { nodes, edges } };
    } catch (error) {
        return handleActionError(error);
    }
}

// ---------------------------------------------------------------------------
// Model Object Deletion Actions
// ---------------------------------------------------------------------------

export async function deleteTable(tableId: string): Promise<ActionResponse> {
    try {
        const session = await auth.getSession();
        if (!session.data?.user) throw new AppError("Unauthorized", 401);

        const table = await db.table.findUnique({ where: { id: tableId } });
        if (!table) throw new AppError("Table not found", 404);

        await db.table.delete({ where: { id: tableId } });

        await createActivityLog({
            dataModelId: table.dataModelId,
            userId: session.data.user.id,
            action: `Deleted table "${table.name}"`,
            details: {
                type: "delete",
                category: "Table",
                target: table.name
            }
        });

        return { success: true, message: "Table deleted successfully" };
    } catch (error) {
        return handleActionError(error);
    }
}

export async function deleteRelationship(relationshipId: string): Promise<ActionResponse> {
    try {
        const session = await auth.getSession();
        if (!session.data?.user) throw new AppError("Unauthorized", 401);

        const rel = await db.relationship.findUnique({ 
            where: { id: relationshipId },
            include: { sourceColumn: { include: { table: true } }, targetColumn: { include: { table: true } } }
        });
        if (!rel) throw new AppError("Relationship not found", 404);

        await db.relationship.delete({ where: { id: relationshipId } });

        await createActivityLog({
            dataModelId: rel.dataModelId,
            userId: session.data.user.id,
            action: `Deleted relationship between "${rel.sourceColumn.table.name}" and "${rel.targetColumn.table.name}"`,
            details: {
                type: "delete",
                category: "Relationship",
                target: `${rel.sourceColumn.table.name} -> ${rel.targetColumn.table.name}`
            }
        });

        return { success: true, message: "Relationship deleted successfully" };
    } catch (error) {
        return handleActionError(error);
    }
}

export async function deleteView(viewId: string): Promise<ActionResponse> {
    try {
        const session = await auth.getSession();
        if (!session.data?.user) throw new AppError("Unauthorized", 401);

        const view = await db.view.findUnique({ where: { id: viewId } });
        if (!view) throw new AppError("View not found", 404);

        await db.view.delete({ where: { id: viewId } });

        await createActivityLog({
            dataModelId: view.dataModelId,
            userId: session.data.user.id,
            action: `Deleted view "${view.name}"`,
            details: {
                type: "delete",
                category: "View",
                target: view.name
            }
        });

        return { success: true, message: "View deleted successfully" };
    } catch (error) {
        return handleActionError(error);
    }
}

