"use client";

import { useCallback } from "react";
import { useCanvasStore } from "../store/use-canvas-store";
import { ColumnData, TableNodeData } from "../types/canvas";

/**
 * Reusable hook for table-specific canvas actions.
 * Centralizes logic for column management and table updates.
 */
export function useTableActions() {
    const updateNodeData = useCanvasStore((s) => s.updateNodeData);
    const removeNode = useCanvasStore((s) => s.removeNode);

    const getTableData = useCallback((nodeId: string) => {
        const nodes = useCanvasStore.getState().nodes;
        const node = nodes.find((n) => n.id === nodeId);
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
            columns: data.columns.map((col) =>
                col.id === columnId ? { ...col, ...updates } : col
            ),
        });
    }, [getTableData, updateNodeData]);

    const removeColumn = useCallback((nodeId: string, columnId: string) => {
        const data = getTableData(nodeId);
        if (!data) return;

        updateNodeData(nodeId, {
            ...data,
            columns: data.columns.filter((col) => col.id !== columnId),
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
        const node = nodes.find((n) => n.id === nodeId);
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

    return {
        addColumn,
        updateColumn,
        removeColumn,
        updateTable,
        deleteTable,
        duplicateTable,
        getTableData,
    };
}
