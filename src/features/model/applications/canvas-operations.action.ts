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
  const latestByKey = new Map<string, CanvasOperation>();
  const keyOrder: string[] = [];

  for (const operation of operations) {
    const key = getCompactionKey(operation);

    if (!latestByKey.has(key)) keyOrder.push(key);
    latestByKey.set(key, operation);
  }

  return keyOrder
    .map((key) => latestByKey.get(key))
    .filter((operation): operation is CanvasOperation => Boolean(operation));
}

function getCompactionKey(operation: CanvasOperation): string {
  if (operation.type === "node.upsert") return `node.upsert:${operation.node.id}`;
  if (operation.type === "edge.upsert") return `edge.upsert:${operation.edge.id}`;
  if (operation.type === "node.move") return `node.move:${operation.nodeId}`;
  if (operation.type === "node.delete") return `node.delete:${operation.nodeId}`;
  return `edge.delete:${operation.edgeId}`;
}
