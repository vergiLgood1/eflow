"use server";

import { db } from "@/db/prisma";
import { ActionResponse, handleActionError } from "@/shared/lib/error";
import { Edge, Node } from "@xyflow/react";
import {
  GroupNodeData,
  NoteNodeData,
  RelationshipEdgeData,
  TableNodeData,
  ViewNodeData,
} from "../types/canvas";
import { requireDataModelMember } from "./model-access";

export async function getModelDiagram(
  dataModelId: string,
  diagramId: string,
): Promise<
  ActionResponse<{ nodes: Node[]; edges: Edge[]; version: number | null }>
> {
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

    for (const tableNode of diagram.nodes) {
      const records = tableNode.table.records.map((record) => {
        const row: Record<string, string> = {};
        for (const value of record.values) {
          row[value.columnName] = value.value;
        }
        return row;
      });

      nodes.push({
        id: tableNode.tableId,
        type: "table",
        position: { x: tableNode.x, y: tableNode.y },
        parentId: tableNode.parentId ?? undefined,
        data: {
          name: tableNode.table.name,
          color: tableNode.table.color ?? undefined,
          notes: tableNode.table.notes ?? undefined,
          hiddenColumns: tableNode.hiddenColumns ?? [],
          columns: tableNode.table.columns.map((column) => ({
            id: column.id,
            name: column.name,
            type: column.type,
            isPk: column.isPrimaryKey,
            isUnique: column.isUnique,
            isAutoIncrement: column.isAutoIncrement,
            nullable: column.isNullable,
            defaultValue: column.default,
            customType: column.customType,
          })),
          indexes: tableNode.table.indexes.map((index) => ({
            id: index.id,
            name: index.name,
            type: index.type,
            columns: index.columns as string[],
            isUnique: index.isUnique,
          })),
          records: records.length > 0 ? records : undefined,
        } as TableNodeData,
      });
    }

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

    for (const relationship of diagram.dataModel.relationships) {
      edges.push({
        id: relationship.id,
        source: relationship.sourceColumn.tableId,
        target: relationship.targetColumn.tableId,
        sourceHandle: `${relationship.sourceColumnId}-source`,
        targetHandle: `${relationship.targetColumnId}-target`,
        type: "relationship",
        data: {
          cardinality: relationship.cardinality || "1:n",
          fkName: relationship.fkName ?? undefined,
          onDelete: relationship.onDelete,
          onUpdate: relationship.onUpdate,
        } as RelationshipEdgeData,
      });
    }

    return { success: true, data: { nodes, edges, version: diagram.version } };
  } catch (error) {
    return handleActionError(error);
  }
}
