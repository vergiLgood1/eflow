"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useCanvasStore } from "../store/use-canvas-store";
import { saveDiagram } from "../applications/workspace.action";
import { isTableNode } from "../types/canvas";

const DEBOUNCE_DELAY_MS = 2500;

/**
 * Watches the Zustand canvas store for dirty state and auto-saves
 * the diagram to the database after a debounce window with no changes.
 */
export function useCanvasDebouncedSync(dataModelId: string): void {
    const isDirty = useCanvasStore((s) => s.isDirty);
    const nodes = useCanvasStore((s) => s.nodes);
    const markSaved = useCanvasStore((s) => s.markSaved);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!isDirty) return;

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(async () => {
            const tableNodes = nodes.filter(isTableNode).map((n) => ({
                id: n.id,
                tableId: n.id,
                x: n.position.x,
                y: n.position.y,
            }));

            const result = await saveDiagram({
                dataModelId,
                name: "Default Diagram",
                tableNodes,
            });

            if (result.success) {
                markSaved();
            } else {
                toast.error("Failed to auto-save diagram.");
            }
        }, DEBOUNCE_DELAY_MS);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isDirty, nodes, dataModelId, markSaved]);
}
