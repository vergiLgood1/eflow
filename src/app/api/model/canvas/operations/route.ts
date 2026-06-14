import { persistCanvasOperations } from "@/features/model/applications/model.action";
import {
  type PersistCanvasOperationsInput,
  persistCanvasOperationsSchema,
} from "@/features/model/types/canvas-operation.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request): Promise<NextResponse> {
  const startedAt = performance.now();

  try {
    const body = persistCanvasOperationsSchema.parse(
      await request.json(),
    ) as unknown as PersistCanvasOperationsInput;
    const result = await persistCanvasOperations(body);
    const durationMs = Math.round(performance.now() - startedAt);

    if (!result.success) {
      const status = result.statusCode ?? statusFromErrorCode(result.code);
      console.error("[canvas:persist] failed", {
        status,
        code: result.code,
        error: result.error,
        dataModelId: body.dataModelId,
        diagramId: body.diagramId,
        baseVersion: body.baseVersion ?? null,
        operations: summarizeOperations(body.operations),
        durationMs,
      });

      return NextResponse.json(result, { status });
    }

    console.info("[canvas:persist] saved", {
      dataModelId: body.dataModelId,
      diagramId: body.diagramId,
      baseVersion: body.baseVersion ?? null,
      nextVersion: result.data?.version,
      operations: summarizeOperations(body.operations),
      durationMs,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);

    if (error instanceof ZodError) {
      console.error("[canvas:persist] invalid payload", {
        issues: error.issues,
        durationMs,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Invalid canvas operation payload",
          code: "VALIDATION_ERROR",
          data: error.flatten(),
        },
        { status: 422 },
      );
    }

    console.error("[canvas:persist] unexpected error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      durationMs,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}

function statusFromErrorCode(code: string | undefined): number {
  if (code === "VERSION_CONFLICT") return 409;
  if (code === "VALIDATION_ERROR") return 422;
  if (code === "RELATIONSHIP_COLUMN_MISSING") return 422;
  return 400;
}

function summarizeOperations(
  operations: { type: string; node?: { id: string }; edge?: { id: string } }[],
): { count: number; types: Record<string, number>; ids: string[] } {
  const types: Record<string, number> = {};
  const ids: string[] = [];

  for (const operation of operations) {
    types[operation.type] = (types[operation.type] ?? 0) + 1;
    const id = operation.node?.id ?? operation.edge?.id;
    if (id) ids.push(id);
  }

  return { count: operations.length, types, ids: ids.slice(0, 10) };
}
