"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useCanvasStore } from "../store/use-canvas-store";
import { ColumnData, TableNode, TableNodeData } from "../types/canvas";

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

    const addColumn = useCallback((nodeId: string, column: Omit<ColumnData, "id">) => {
        const data = getTableData(nodeId);
        if (!data) return null;

        const newColumn: ColumnData = {
            id: crypto.randomUUID(),
            ...column,
        };

        updateNodeData(nodeId, {
            ...data,
            columns: [...(data.columns ?? []), newColumn],
        });

        return newColumn.id;
    }, [getTableData, updateNodeData]);

    const updateColumn = useCallback((nodeId: string, columnId: string, updates: Partial<ColumnData>) => {
        const data = getTableData(nodeId);
        if (!data) return;

        updateNodeData(nodeId, {
            ...data,
            columns: data.columns.map((column) =>
                column.id === columnId ? { ...column, ...updates } : column
            ),
        });
    }, [getTableData, updateNodeData]);

    const removeColumn = useCallback((nodeId: string, columnId: string) => {
        const data = getTableData(nodeId);
        if (!data) return;

        updateNodeData(nodeId, {
            ...data,
            columns: data.columns.filter((column) => column.id !== columnId),
        });
    }, [getTableData, updateNodeData]);

    const updateTable = useCallback((nodeId: string, updates: Partial<TableNodeData>) => {
        const data = getTableData(nodeId);
        if (!data) return;

        updateNodeData(nodeId, {
            ...data,
            ...updates,
        });
    }, [getTableData, updateNodeData]);

    const deleteTable = useCallback((nodeId: string) => {
        removeNode(nodeId);
    }, [removeNode]);

    const duplicateTable = useCallback((nodeId: string) => {
        const nodes = useCanvasStore.getState().nodes;
        const addNode = useCanvasStore.getState().addNode;
        const node = nodes.find((node) => node.id === nodeId);
        if (!node) return;

        const data = node.data as TableNodeData;
        const newId = crypto.randomUUID();

        const duplicated = {
            ...node,
            id: newId,
            position: { x: node.position.x + 40, y: node.position.y + 40 },
            selected: true,
            data: {
                ...data,
                name: `${data.name}_copy`,
            },
        };

        addNode(duplicated as any);
    }, []);

    const copyInsertSql = useCallback((nodeId: string) => {
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
    }, [getTableData]);

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
    };
}
