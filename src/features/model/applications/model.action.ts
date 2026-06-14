"use server";

import { db } from "@/db/prisma";
import { Prisma } from "../../../../prisma/generated";
import {
  ActionResponse,
  AppError,
  handleActionError,
} from "@/shared/lib/error";
import { Node, Edge } from "@xyflow/react";
import {
  TableNodeData,
  RelationshipEdgeData,
  GroupNodeData,
  NoteNodeData,
  ViewNodeData,
} from "../types/canvas";
import { createActivityLog } from "@/features/activity/applications/activity.action";
import {
  CanvasOperation,
  PersistCanvasOperationsInput,
  persistCanvasOperationsSchema,
} from "../types/canvas-operation.schema";
import {
  requireDataModelMember,
  requireRelationshipMember,
  requireTableMember,
  requireViewMember,
} from "./model-access";

type PersistCanvasOperationsResult = { version: number };
type PersistCanvasOperationsError = { version: number };

export async function persistCanvasOperations(
  input: PersistCanvasOperationsInput,
): Promise<
  ActionResponse<PersistCanvasOperationsResult, PersistCanvasOperationsError>
> {
  try {
    const data = persistCanvasOperationsSchema.parse(
      input,
    ) as unknown as PersistCanvasOperationsInput;
    await requireDataModelMember(data.dataModelId);

    const version = await db.$transaction(async (tx) => {
      const diagram = await tx.diagram.upsert({
        where: { id: data.diagramId },
        update: { name: data.diagramName, updatedAt: new Date() },
        create: {
          id: data.diagramId,
          dataModelId: data.dataModelId,
          name: data.diagramName,
          isDraft: false,
        },
        select: { id: true, version: true },
      });

      if (data.baseVersion && diagram.version !== data.baseVersion) {
        throw new AppError(
          "Canvas version conflict",
          409,
          "VERSION_CONFLICT",
          { version: diagram.version },
        );
      }

      for (const operation of data.operations) {
        await persistCanvasOperation(tx, {
          dataModelId: data.dataModelId,
          diagramId: data.diagramId,
          operation,
        });
      }

      const updated = await tx.diagram.update({
        where: { id: data.diagramId },
        data: { version: { increment: 1 } },
        select: { version: true },
      });

      return updated.version;
    });

    return { success: true, data: { version } };
  } catch (error) {
    return handleActionError(error);
  }
}

type PrismaTransaction = Prisma.TransactionClient;

interface PersistCanvasOperationOptions {
  dataModelId: string;
  diagramId: string;
  operation: CanvasOperation;
}

async function persistCanvasOperation(
  tx: PrismaTransaction,
  options: PersistCanvasOperationOptions,
): Promise<void> {
  const { dataModelId, diagramId, operation } = options;

  switch (operation.type) {
    case "node.upsert":
      await upsertCanvasNode(tx, dataModelId, diagramId, operation.node);
      return;
    case "node.move":
      await moveCanvasNode(tx, diagramId, operation);
      return;
    case "node.delete":
      await deleteCanvasNode(tx, operation.nodeId);
      return;
    case "edge.upsert":
      await upsertRelationshipEdge(tx, dataModelId, operation.edge);
      return;
    case "edge.delete":
      await tx.relationship.deleteMany({ where: { id: operation.edgeId } });
      return;
  }
}

type CanvasOperationNode = Extract<CanvasOperation, { type: "node.upsert" }>["node"];
type CanvasOperationEdge = Extract<CanvasOperation, { type: "edge.upsert" }>["edge"];
type CanvasMoveOperation = Extract<CanvasOperation, { type: "node.move" }>;

async function upsertCanvasNode(
  tx: PrismaTransaction,
  dataModelId: string,
  diagramId: string,
  node: CanvasOperationNode,
): Promise<void> {
  if (node.type === "table") {
    await upsertTableNode(tx, dataModelId, diagramId, node);
    return;
  }

  if (node.type === "view") {
    await upsertViewNode(tx, dataModelId, node);
    return;
  }

  if (node.type === "group") {
    await upsertGroupNode(tx, diagramId, node);
    return;
  }

  await upsertNoteNode(tx, diagramId, node);
}

async function upsertTableNode(
  tx: PrismaTransaction,
  dataModelId: string,
  diagramId: string,
  node: CanvasOperationNode,
): Promise<void> {
  const data = node.data as TableNodeData;
  const table = await tx.table.upsert({
    where: { id: node.id },
    update: {
      name: data.name,
      color: data.color,
      notes: data.notes,
    },
    create: {
      id: node.id,
      dataModelId,
      name: data.name,
      color: data.color,
      notes: data.notes,
    },
    select: { id: true },
  });

  await tx.tableNode.upsert({
    where: { diagramId_tableId: { diagramId, tableId: table.id } },
    update: {
      parentId: node.parentId ?? null,
      x: node.position.x,
      y: node.position.y,
      hiddenColumns: data.hiddenColumns ?? [],
    },
    create: {
      id: node.id,
      diagramId,
      tableId: table.id,
      parentId: node.parentId ?? null,
      x: node.position.x,
      y: node.position.y,
      hiddenColumns: data.hiddenColumns ?? [],
    },
  });

  await tx.column.deleteMany({ where: { tableId: table.id } });
  if (data.columns.length > 0) {
    await tx.column.createMany({
      data: data.columns.map((column) => ({
        id: column.id,
        tableId: table.id,
        name: column.name,
        type: column.type,
        isNullable: column.nullable ?? true,
        default: column.defaultValue,
        isUnique: column.isUnique ?? false,
        isPrimaryKey: column.isPk ?? false,
        isAutoIncrement: column.isAutoIncrement ?? false,
        customType: column.customType,
      })),
      skipDuplicates: true,
    });
  }
}

async function upsertViewNode(
  tx: PrismaTransaction,
  dataModelId: string,
  node: CanvasOperationNode,
): Promise<void> {
  const data = node.data as ViewNodeData;
  await tx.view.upsert({
    where: { id: node.id },
    update: {
      name: data.name,
      sql: data.query,
      parentId: node.parentId ?? null,
      x: node.position.x,
      y: node.position.y,
    },
    create: {
      id: node.id,
      dataModelId,
      name: data.name,
      sql: data.query,
      parentId: node.parentId ?? null,
      x: node.position.x,
      y: node.position.y,
    },
  });
}

async function upsertGroupNode(
  tx: PrismaTransaction,
  diagramId: string,
  node: CanvasOperationNode,
): Promise<void> {
  const data = node.data as GroupNodeData;
  const style = node.style ?? {};
  const width = typeof style.width === "number" ? style.width : 600;
  const height = typeof style.height === "number" ? style.height : 400;

  await tx.group.upsert({
    where: { id: node.id },
    update: {
      parentId: node.parentId ?? null,
      name: data.name,
      description: data.description,
      color: data.color ?? "#3b82f6",
      isCollapsed: data.isCollapsed ?? false,
      expandedHeight: data.expandedHeight,
      x: node.position.x,
      y: node.position.y,
      width,
      height,
    },
    create: {
      id: node.id,
      diagramId,
      parentId: node.parentId ?? null,
      name: data.name,
      description: data.description,
      color: data.color ?? "#3b82f6",
      isCollapsed: data.isCollapsed ?? false,
      expandedHeight: data.expandedHeight,
      x: node.position.x,
      y: node.position.y,
      width,
      height,
    },
  });
}

async function upsertNoteNode(
  tx: PrismaTransaction,
  diagramId: string,
  node: CanvasOperationNode,
): Promise<void> {
  const data = node.data as NoteNodeData;
  await tx.note.upsert({
    where: { id: node.id },
    update: {
      parentId: node.parentId ?? null,
      content: data.content,
      x: node.position.x,
      y: node.position.y,
    },
    create: {
      id: node.id,
      diagramId,
      parentId: node.parentId ?? null,
      content: data.content,
      x: node.position.x,
      y: node.position.y,
    },
  });
}

async function moveCanvasNode(
  tx: PrismaTransaction,
  diagramId: string,
  operation: CanvasMoveOperation,
): Promise<void> {
  await Promise.all([
    tx.tableNode.updateMany({
      where: { diagramId, tableId: operation.nodeId },
      data: {
        x: operation.position.x,
        y: operation.position.y,
        parentId: operation.parentId ?? null,
      },
    }),
    tx.view.updateMany({
      where: { id: operation.nodeId },
      data: {
        x: operation.position.x,
        y: operation.position.y,
        parentId: operation.parentId ?? null,
      },
    }),
    tx.group.updateMany({
      where: { id: operation.nodeId, diagramId },
      data: {
        x: operation.position.x,
        y: operation.position.y,
        parentId: operation.parentId ?? null,
      },
    }),
    tx.note.updateMany({
      where: { id: operation.nodeId, diagramId },
      data: {
        x: operation.position.x,
        y: operation.position.y,
        parentId: operation.parentId ?? null,
      },
    }),
  ]);
}

async function deleteCanvasNode(
  tx: PrismaTransaction,
  nodeId: string,
): Promise<void> {
  await Promise.all([
    tx.table.deleteMany({ where: { id: nodeId } }),
    tx.view.deleteMany({ where: { id: nodeId } }),
    tx.group.deleteMany({ where: { id: nodeId } }),
    tx.note.deleteMany({ where: { id: nodeId } }),
  ]);
}

async function upsertRelationshipEdge(
  tx: PrismaTransaction,
  dataModelId: string,
  edge: CanvasOperationEdge,
): Promise<void> {
  const sourceColumnId = edge.sourceHandle?.replace("-source", "");
  const targetColumnId = edge.targetHandle?.replace("-target", "");

  if (!sourceColumnId || !targetColumnId) {
    throw new AppError(
      "Relationship must reference source and target columns",
      422,
      "RELATIONSHIP_COLUMN_MISSING",
      { edgeId: edge.id, sourceColumnId, targetColumnId },
    );
  }

  const [sourceColumn, targetColumn] = await Promise.all([
    tx.column.findUnique({
      where: { id: sourceColumnId },
      select: { id: true, tableId: true },
    }),
    tx.column.findUnique({
      where: { id: targetColumnId },
      select: { id: true, tableId: true },
    }),
  ]);

  if (!sourceColumn || !targetColumn) {
    throw new AppError(
      "Relationship references a column that has not been saved yet",
      422,
      "RELATIONSHIP_COLUMN_MISSING",
      {
        edgeId: edge.id,
        sourceColumnId,
        targetColumnId,
        isSourceColumnMissing: !sourceColumn,
        isTargetColumnMissing: !targetColumn,
      },
    );
  }

  await tx.relationship.upsert({
    where: { id: edge.id },
    update: {
      sourceColumnId,
      targetColumnId,
      onDelete: edge.data?.onDelete ?? "NO ACTION",
      onUpdate: edge.data?.onUpdate ?? "NO ACTION",
      cardinality: edge.data?.cardinality ?? "1:n",
      fkName: edge.data?.fkName,
    },
    create: {
      id: edge.id,
      dataModelId,
      sourceColumnId,
      targetColumnId,
      onDelete: edge.data?.onDelete ?? "NO ACTION",
      onUpdate: edge.data?.onUpdate ?? "NO ACTION",
      cardinality: edge.data?.cardinality ?? "1:n",
      fkName: edge.data?.fkName,
    },
  });
}

export async function getModelDiagram(
  dataModelId: string,
  diagramId: string,
): Promise<ActionResponse<{ nodes: Node[]; edges: Edge[]; version: number | null }>> {
  try {
    await requireDataModelMember(dataModelId);

    const diagram = await db.diagram.findUnique({
      where: { id: diagramId, dataModelId },
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
              },
            },
          },
        },
        notes: true,
        groups: true,
        dataModel: {
          include: {
            relationships: {
              include: {
                sourceColumn: true,
                targetColumn: true,
              },
            },
            views: true,
          },
        },
      },
    });

    if (!diagram) {
      return { success: true, data: { nodes: [], edges: [], version: null } };
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Map TableNodes
    for (const tn of diagram.nodes) {
      // Convert records from DB format to TableRecord format
      const records = tn.table.records.map((rec) => {
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
          columns: tn.table.columns.map((c) => ({
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
          indexes: tn.table.indexes.map((idx) => ({
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

    return { success: true, data: { nodes, edges, version: diagram.version } };
  } catch (error) {
    return handleActionError(error);
  }
}

// ---------------------------------------------------------------------------
// Model Object Deletion Actions
// ---------------------------------------------------------------------------

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
