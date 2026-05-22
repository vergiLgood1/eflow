"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useCanvasStore } from "../store/use-canvas-store";
import { columnSchema, indexSchema, tableSchema } from "../lib/schema";
import {
  ColumnData,
  TableIndex,
  TableNode,
  TableNodeData,
} from "../types/canvas";

/**
 * Reusable hook for table-specific canvas actions.
 * Centralizes logic for column management and table updates.
 */
export function useTableActions() {
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);
  const removeNode = useCanvasStore((state) => state.removeNode);

  const getTableData = useCallback((nodeId: string) => {
    const nodes = useCanvasStore.getState().nodes;
    const node = nodes.find((node) => node.id === nodeId);
    return node?.data as TableNodeData | undefined;
  }, []);

  const addColumn = useCallback(
    (nodeId: string, column: Omit<ColumnData, "id">) => {
      const data = getTableData(nodeId);
      if (!data) return null;

      const parsed = columnSchema.safeParse(column);
      if (!parsed.success) return null;

      const newColumn: ColumnData = {
        id: crypto.randomUUID(),
        ...parsed.data,
      };

      updateNodeData(nodeId, {
        ...data,
        columns: [...(data.columns ?? []), newColumn],
      });

      return newColumn.id;
    },
    [getTableData, updateNodeData],
  );

  const updateColumn = useCallback(
    (nodeId: string, columnId: string, updates: Partial<ColumnData>) => {
      const data = getTableData(nodeId);
      if (!data) return;

      const target = data.columns.find((column) => column.id === columnId);
      if (!target) return;

      const parsed = columnSchema.safeParse({
        name: updates.name ?? target.name,
        type: updates.type ?? target.type,
        isPk: updates.isPk ?? target.isPk,
        isUnique: updates.isUnique ?? target.isUnique,
        isAutoIncrement: updates.isAutoIncrement ?? target.isAutoIncrement,
        isUuid: updates.isUuid ?? target.isUuid,
        nullable: updates.nullable ?? target.nullable,
        defaultValue: updates.defaultValue ?? target.defaultValue,
        notes: updates.notes ?? target.notes,
      });
      if (!parsed.success) return;

      updateNodeData(nodeId, {
        ...data,
        columns: data.columns.map((column) =>
          column.id === columnId ? { ...column, ...parsed.data } : column,
        ),
      });
    },
    [getTableData, updateNodeData],
  );

  const removeColumn = useCallback(
    (nodeId: string, columnId: string) => {
      const data = getTableData(nodeId);
      if (!data) return;

      updateNodeData(nodeId, {
        ...data,
        columns: data.columns.filter((column) => column.id !== columnId),
      });

      // Also remove associated edges
      const edges = useCanvasStore.getState().edges;
      const setEdges = useCanvasStore.getState().setEdges;
      const updatedEdges = edges.filter(
        (edge) =>
          edge.sourceHandle !== `${columnId}-source` &&
          edge.targetHandle !== `${columnId}-target`,
      );

      if (updatedEdges.length !== edges.length) {
        setEdges(updatedEdges);
      }
    },
    [getTableData, updateNodeData],
  );

  const updateTable = useCallback(
    (nodeId: string, updates: Partial<TableNodeData>) => {
      const data = getTableData(nodeId);
      if (!data) return;

      const parsed = tableSchema.safeParse({
        name: updates.name ?? data.name,
        color: updates.color ?? data.color,
      });
      if (!parsed.success) return;

      updateNodeData(nodeId, {
        ...data,
        ...updates,
        name: parsed.data.name,
        color: parsed.data.color,
      });
    },
    [getTableData, updateNodeData],
  );

  const deleteTable = useCallback(
    (nodeId: string) => {
      removeNode(nodeId);
    },
    [removeNode],
  );

  const duplicateTable = useCallback((nodeId: string) => {
    const nodes = useCanvasStore.getState().nodes;
    const addNode = useCanvasStore.getState().addNode;
    const node = nodes.find((node) => node.id === nodeId);
    if (!node) return;

    const data = node.data as TableNodeData;
    const newId = crypto.randomUUID();

    const duplicated: TableNode = {
      ...node,
      type: "table",
      id: newId,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      selected: true,
      data: {
        ...data,
        name: `${data.name}_copy`,
      },
    };

    addNode(duplicated as TableNode);
  }, []);

  const addIndex = useCallback(
    (nodeId: string, index: Omit<TableIndex, "id">) => {
      const data = getTableData(nodeId);
      if (!data) return null;

      const parsed = indexSchema.safeParse(index);
      if (!parsed.success) return null;

      const newIndex: TableIndex = {
        id: crypto.randomUUID(),
        ...parsed.data,
      };

      updateNodeData(nodeId, {
        ...data,
        indexes: [...(data.indexes ?? []), newIndex],
      });

      return newIndex.id;
    },
    [getTableData, updateNodeData],
  );

  const updateIndex = useCallback(
    (nodeId: string, indexId: string, updates: Partial<TableIndex>) => {
      const data = getTableData(nodeId);
      if (!data) return;

      const nextIndex = (data.indexes ?? []).find((idx) => idx.id === indexId);
      if (!nextIndex) return;

      const parsed = indexSchema.safeParse({
        name: updates.name ?? nextIndex.name,
        columns: updates.columns ?? nextIndex.columns,
        type: updates.type ?? nextIndex.type,
        isUnique: updates.isUnique ?? nextIndex.isUnique,
      });
      if (!parsed.success) return;

      updateNodeData(nodeId, {
        ...data,
        indexes: (data.indexes ?? []).map((idx) =>
          idx.id === indexId ? { ...idx, ...parsed.data } : idx,
        ),
      });
    },
    [getTableData, updateNodeData],
  );

  const removeIndex = useCallback(
    (nodeId: string, indexId: string) => {
      const data = getTableData(nodeId);
      if (!data) return;

      updateNodeData(nodeId, {
        ...data,
        indexes: (data.indexes ?? []).filter((idx) => idx.id !== indexId),
      });
    },
    [getTableData, updateNodeData],
  );

  const copyInsertSql = useCallback(
    (nodeId: string) => {
      const data = getTableData(nodeId);
      if (!data) return;

      if (!data.columns || data.columns.length === 0) {
        toast.error("Add some columns first!");
        return;
      }

      const columnNames = data.columns.map((column) => column.name).join(", ");
      const values = data.columns.map(() => "?").join(", ");
      const sql = `INSERT INTO ${data.name} (${columnNames}) VALUES (${values});`;

      navigator.clipboard.writeText(sql);
      toast.success(`Insert SQL for ${data.name} copied!`);
    },
    [getTableData],
  );

  const getAllTables = useCallback(() => {
    const nodes = useCanvasStore.getState().nodes;
    return nodes.filter((node): node is TableNode => node.type === "table");
  }, []);

  return {
    addColumn,
    updateColumn,
    removeColumn,
    updateTable,
    deleteTable,
    duplicateTable,
    copyInsertSql,
    getTableData,
    getAllTables,
    addIndex,
    updateIndex,
    removeIndex,
  };
}
