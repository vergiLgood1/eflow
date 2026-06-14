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
      await moveCanvasNode(tx, dataModelId, diagramId, operation);
      return;
    case "node.delete":
      await deleteCanvasNode(tx, dataModelId, diagramId, operation.nodeId);
      return;
    case "edge.upsert":
      await upsertRelationshipEdge(tx, dataModelId, operation.edge);
      return;
    case "edge.delete":
      await tx.relationship.deleteMany({
        where: { id: operation.edgeId, dataModelId },
      });
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
  const existingTable = await tx.table.findUnique({
    where: { id: node.id },
    select: { id: true, dataModelId: true },
  });

  if (existingTable && existingTable.dataModelId !== dataModelId) {
    throw new AppError("Table does not belong to this data model", 403);
  }

  const table = existingTable
    ? await tx.table.update({
        where: { id: node.id },
        data: {
          name: data.name,
          color: data.color,
          notes: data.notes,
        },
        select: { id: true },
      })
    : await tx.table.create({
        data: {
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

  await persistTableColumns(tx, table.id, data.columns);
}

async function upsertViewNode(
  tx: PrismaTransaction,
  dataModelId: string,
  node: ViewNode,
): Promise<void> {
  const data = node.data;
  const existingView = await tx.view.findUnique({
    where: { id: node.id },
    select: { id: true, dataModelId: true },
  });

  if (existingView && existingView.dataModelId !== dataModelId) {
    throw new AppError("View does not belong to this data model", 403);
  }

  if (existingView) {
    await tx.view.update({
      where: { id: node.id },
      data: {
        name: data.name,
        sql: data.query,
        parentId: node.parentId ?? null,
        x: node.position.x,
        y: node.position.y,
      },
    });
    return;
  }

  await tx.view.create({
    data: {
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

  const existingGroup = await tx.group.findUnique({
    where: { id: node.id },
    select: { id: true, diagramId: true },
  });

  if (existingGroup && existingGroup.diagramId !== diagramId) {
    throw new AppError("Group does not belong to this diagram", 403);
  }

  if (existingGroup) {
    await tx.group.update({
      where: { id: node.id },
      data: {
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
    return;
  }

  await tx.group.create({
    data: {
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
  const existingNote = await tx.note.findUnique({
    where: { id: node.id },
    select: { id: true, diagramId: true },
  });

  if (existingNote && existingNote.diagramId !== diagramId) {
    throw new AppError("Note does not belong to this diagram", 403);
  }

  if (existingNote) {
    await tx.note.update({
      where: { id: node.id },
      data: {
        parentId: node.parentId ?? null,
        content: data.content,
        x: node.position.x,
        y: node.position.y,
      },
    });
    return;
  }

  await tx.note.create({
    data: {
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
  dataModelId: string,
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
      where: { id: operation.nodeId, dataModelId },
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
  dataModelId: string,
  diagramId: string,
  nodeId: string,
): Promise<void> {
  await Promise.all([
    tx.table.deleteMany({ where: { id: nodeId, dataModelId } }),
    tx.view.deleteMany({ where: { id: nodeId, dataModelId } }),
    tx.group.deleteMany({ where: { id: nodeId, diagramId } }),
    tx.note.deleteMany({ where: { id: nodeId, diagramId } }),
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
      select: { id: true, table: { select: { dataModelId: true } } },
    }),
    tx.column.findUnique({
      where: { id: targetColumnId },
      select: { id: true, table: { select: { dataModelId: true } } },
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

  if (
    sourceColumn.table.dataModelId !== dataModelId ||
    targetColumn.table.dataModelId !== dataModelId
  ) {
    throw new AppError(
      "Relationship columns must belong to this data model",
      403,
      "RELATIONSHIP_COLUMN_INVALID",
      { edgeId: edge.id, sourceColumnId, targetColumnId },
    );
  }

  const existingRelationship = await tx.relationship.findUnique({
    where: { id: edge.id },
    select: { id: true, dataModelId: true },
  });

  if (existingRelationship && existingRelationship.dataModelId !== dataModelId) {
    throw new AppError("Relationship does not belong to this data model", 403);
  }

  const relationshipData = {
    sourceColumnId,
    targetColumnId,
    onDelete: edge.data?.onDelete ?? "NO ACTION",
    onUpdate: edge.data?.onUpdate ?? "NO ACTION",
    cardinality: edge.data?.cardinality ?? "1:n",
    fkName: edge.data?.fkName,
  };

  if (existingRelationship) {
    await tx.relationship.update({
      where: { id: edge.id },
      data: relationshipData,
    });
    return;
  }

  await tx.relationship.create({
    data: {
      id: edge.id,
      dataModelId,
      ...relationshipData,
    },
  });
}

async function persistTableColumns(
  tx: PrismaTransaction,
  tableId: string,
  columns: TableNode["data"]["columns"],
): Promise<void> {
  const incomingColumnIds = columns.map((column) => column.id);

  await tx.column.deleteMany({
    where: {
      tableId,
      id: { notIn: incomingColumnIds },
    },
  });

  for (const column of columns) {
    await tx.column.upsert({
      where: { id: column.id },
      update: {
        name: column.name,
        type: column.type,
        isNullable: column.nullable ?? true,
        default: column.defaultValue,
        isUnique: column.isUnique ?? false,
        isPrimaryKey: column.isPk ?? false,
        isAutoIncrement: column.isAutoIncrement ?? false,
        customType: column.customType,
      },
      create: {
        id: column.id,
        tableId,
        name: column.name,
        type: column.type,
        isNullable: column.nullable ?? true,
        default: column.defaultValue,
        isUnique: column.isUnique ?? false,
        isPrimaryKey: column.isPk ?? false,
        isAutoIncrement: column.isAutoIncrement ?? false,
        customType: column.customType,
      },
    });
  }
}
