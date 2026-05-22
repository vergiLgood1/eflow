"use client";

import { syncModelSchema } from "../applications/model.action";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useCanvasStore } from "../store/use-canvas-store";

const DEBOUNCE_DELAY_MS = 2500;

/**
 * Watches the Zustand canvas store for dirty state and auto-saves
 * the diagram to the database after a debounce window with no changes.
 */
export function useCanvasDebouncedSync(
  dataModelId: string,
  isEnabled: boolean = true,
): void {
  const isDirty = useCanvasStore((s) => s.isDirty);
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const markSaved = useCanvasStore((s) => s.markSaved);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isEnabled || !isDirty) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const diagramId = `${dataModelId}-default`;
      const result = await syncModelSchema(
        dataModelId,
        diagramId,
        "Default Diagram",
        nodes,
        edges,
      );

      if (result.success) {
        markSaved();
      } else {
        toast.error("Failed to auto-save diagram.");
      }
    }, DEBOUNCE_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDirty, nodes, edges, dataModelId, markSaved, isEnabled]);
}
