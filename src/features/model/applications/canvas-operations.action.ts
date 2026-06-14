"use server";

import { db } from "@/db/prisma";
import {
  ActionResponse,
  AppError,
  handleActionError,
} from "@/shared/lib/error";
import {
  CanvasOperation,
  PersistCanvasOperationsInput,
  persistCanvasOperationsSchema,
} from "../types/canvas-operation.schema";
import { persistCanvasOperation } from "./canvas-persistence.service";
import { requireDataModelMember } from "./model-access";

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
    const operations = compactCanvasOperations(data.operations);

    const version = await db.$transaction(
      async (tx) => {
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

        for (const operation of operations) {
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
      },
      { timeout: 15000 },
    );

    return { success: true, data: { version } };
  } catch (error) {
    return handleActionError(error);
  }
}

function compactCanvasOperations(
  operations: CanvasOperation[],
): CanvasOperation[] {
  const compacted: CanvasOperation[] = [];

  for (const operation of operations) {
    if (operation.type === "node.upsert") {
      removePriorOperation(compacted, "node.upsert", operation.node.id);
    }

    if (operation.type === "edge.upsert") {
      removePriorOperation(compacted, "edge.upsert", operation.edge.id);
    }

    compacted.push(operation);
  }

  return compacted;
}

function removePriorOperation(
  operations: CanvasOperation[],
  type: "node.upsert" | "edge.upsert",
  id: string,
): void {
  const index = operations.findIndex((operation) => {
    if (type === "node.upsert") {
      return operation.type === type && operation.node.id === id;
    }

    return operation.type === type && operation.edge.id === id;
  });

  if (index >= 0) operations.splice(index, 1);
}
