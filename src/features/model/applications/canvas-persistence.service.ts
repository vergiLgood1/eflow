import { Prisma } from "../../../../prisma/generated";
import { AppError } from "@/shared/lib/error";
import {
  GroupNode,
  NoteNode,
  TableNode,
  ViewNode,
} from "../types/canvas";
import { CanvasOperation } from "../types/canvas-operation.schema";

type PrismaTransaction = Prisma.TransactionClient;
type CanvasOperationNode = Extract<CanvasOperation, { type: "node.upsert" }>["node"];
type CanvasOperationEdge = Extract<CanvasOperation, { type: "edge.upsert" }>["edge"];
type CanvasMoveOperation = Extract<CanvasOperation, { type: "node.move" }>;

interface PersistCanvasOperationOptions {
  dataModelId: string;
  diagramId: string;
  operation: CanvasOperation;
}

export async function persistCanvasOperation(
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
  node: TableNode,
): Promise<void> {
  const data = node.data;
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
  node: ViewNode,
): Promise<void> {
  const data = node.data;
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
  node: GroupNode,
): Promise<void> {
  const data = node.data;
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
  node: NoteNode,
): Promise<void> {
  const data = node.data;
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
