"use client";

import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

import type { ActionResponse } from "@/shared/lib/error";
import { useCanvasStore } from "../store/use-canvas-store";
import type { CanvasOperation } from "../types/canvas-operation.schema";

const OPERATION_SYNC_DELAY_MS = 900;
const VERSION_CONFLICT_CODE = "VERSION_CONFLICT";
const NON_RETRYABLE_ERROR_CODES = new Set([
  "RELATIONSHIP_COLUMN_MISSING",
  "VALIDATION_ERROR",
]);

type PersistCanvasOperationsResult = { version: number };
type PersistCanvasOperationsError = { version: number };
type PersistCanvasOperationsResponse = ActionResponse<
  PersistCanvasOperationsResult,
  PersistCanvasOperationsError
>;

export function useCanvasOperationSync(
  dataModelId: string,
  isEnabled: boolean = true,
): void {
  const pendingOperationsCount = useCanvasStore(
    (state) => state.pendingOperations.length,
  );
  const revision = useCanvasStore((state) => state.revision);
  const takePendingOperations = useCanvasStore(
    (state) => state.takePendingOperations,
  );
  const markSaving = useCanvasStore((state) => state.markSaving);
  const markSaveFailed = useCanvasStore((state) => state.markSaveFailed);
  const markOperationsSaved = useCanvasStore(
    (state) => state.markOperationsSaved,
  );
  const setRevision = useCanvasStore((state) => state.setRevision);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const revisionRef = useRef<number | null>(revision);
  const retryCountRef = useRef(0);
  const scheduleFlushRef = useRef<() => void>(() => {});

  useEffect(() => {
    revisionRef.current = revision;
  }, [revision]);

  const scheduleFlush = useCallback((): void => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (isSavingRef.current) return;

      const operations = takePendingOperations();
      if (operations.length === 0) return;

      isSavingRef.current = true;
      markSaving();

      const result = await saveCanvasOperations({
        dataModelId,
        diagramId: `${dataModelId}-default`,
        diagramName: "Default Diagram",
        baseVersion: revisionRef.current,
        operations,
      });

      isSavingRef.current = false;

      if (result.success) {
        const nextVersion = result.data?.version ?? revisionRef.current ?? 1;
        retryCountRef.current = 0;
        revisionRef.current = nextVersion;
        markOperationsSaved(nextVersion);

        if (useCanvasStore.getState().pendingOperations.length > 0) {
          scheduleFlushRef.current();
        }

        return;
      }

      if (
        result.code === VERSION_CONFLICT_CODE &&
        result.data?.version &&
        retryCountRef.current < 1
      ) {
        retryCountRef.current += 1;
        revisionRef.current = result.data.version;
        setRevision(result.data.version);
        useCanvasStore.getState().restorePendingOperations(operations);
        scheduleFlushRef.current();
        return;
      }

      retryCountRef.current = 0;
      const shouldRestoreOperations = !NON_RETRYABLE_ERROR_CODES.has(
        result.code ?? "",
      );

      markSaveFailed(result.error, operations, shouldRestoreOperations);
      toast.error(
        result.code === VERSION_CONFLICT_CODE
          ? "Canvas changed. Please refresh and try again."
          : result.code === "RELATIONSHIP_COLUMN_MISSING"
            ? "Relationship could not be saved because a column is missing. Recreate the relationship after the table is saved."
          : "Failed to save canvas changes.",
      );
    }, OPERATION_SYNC_DELAY_MS);
  }, [
    dataModelId,
    markOperationsSaved,
    markSaveFailed,
    markSaving,
    setRevision,
    takePendingOperations,
  ]);

  useEffect(() => {
    scheduleFlushRef.current = scheduleFlush;
  }, [scheduleFlush]);

  useEffect(() => {
    if (!isEnabled || pendingOperationsCount === 0 || isSavingRef.current) {
      return;
    }

    scheduleFlush();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isEnabled, pendingOperationsCount, scheduleFlush]);
}

async function saveCanvasOperations(input: {
  dataModelId: string;
  diagramId: string;
  diagramName: string;
  baseVersion: number | null;
  operations: CanvasOperation[];
}): Promise<PersistCanvasOperationsResponse> {
  const response = await fetch("/api/model/canvas/operations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const result = (await response.json()) as PersistCanvasOperationsResponse;

  if (!response.ok && !result.success) {
    return {
      ...result,
      statusCode: response.status,
    };
  }

  return result;
}
