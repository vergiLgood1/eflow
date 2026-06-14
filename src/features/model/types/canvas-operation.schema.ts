import { z } from "zod";
import type {
  GroupNode,
  NoteNode,
  RelationshipEdge,
  TableNode,
  ViewNode,
} from "./canvas";

const positionSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
});

const edgeTypeSchema = z.literal("relationship");

const columnSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.string().min(1),
    isPk: z.boolean().optional(),
    isFk: z.boolean().optional(),
    isIdx: z.boolean().optional(),
    isUnique: z.boolean().optional(),
    isAutoIncrement: z.boolean().optional(),
    isUuid: z.boolean().optional(),
    nullable: z.boolean().optional(),
    defaultValue: z.string().nullable().optional(),
    notes: z.string().optional(),
    customType: z.string().nullable().optional(),
  })
  .passthrough();

const tableDataSchema = z
  .object({
    name: z.string().min(1),
    columns: z.array(columnSchema),
    indexes: z.array(z.record(z.string(), z.unknown())).optional(),
    records: z.array(z.record(z.string(), z.string())).optional(),
    color: z.string().optional(),
    notes: z.string().optional(),
    hiddenColumns: z.array(z.string()).optional(),
    dbType: z.string().optional(),
    isNew: z.boolean().optional(),
    isEditing: z.boolean().optional(),
  })
  .passthrough();

const viewDataSchema = z
  .object({
    name: z.string().min(1),
    query: z.string(),
    isNew: z.boolean().optional(),
    isEditing: z.boolean().optional(),
  })
  .passthrough();

const noteDataSchema = z
  .object({
    content: z.string(),
    color: z.string().optional(),
    isNew: z.boolean().optional(),
  })
  .passthrough();

const groupDataSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    color: z.string().optional(),
    isCollapsed: z.boolean().optional(),
    expandedHeight: z.number().finite().optional(),
    isNew: z.boolean().optional(),
    isEditing: z.boolean().optional(),
  })
  .passthrough();

const baseNodeSnapshotSchema = z.object({
  id: z.string().min(1),
  position: positionSchema,
  parentId: z.string().nullable().optional(),
  hidden: z.boolean().optional(),
  style: z.record(z.string(), z.unknown()).optional(),
});

const nodeSnapshotSchema = z.discriminatedUnion("type", [
  baseNodeSnapshotSchema.extend({
    type: z.literal("table"),
    data: tableDataSchema,
  }),
  baseNodeSnapshotSchema.extend({
    type: z.literal("view"),
    data: viewDataSchema,
  }),
  baseNodeSnapshotSchema.extend({
    type: z.literal("note"),
    data: noteDataSchema,
  }),
  baseNodeSnapshotSchema.extend({
    type: z.literal("group"),
    data: groupDataSchema,
  }),
]);

const relationshipDataSchema = z
  .object({
    cardinality: z.string().optional(),
    fkName: z.string().optional(),
    onDelete: z.string().optional(),
    onUpdate: z.string().optional(),
  })
  .passthrough();

const edgeSnapshotSchema = z.object({
  id: z.string().min(1),
  type: edgeTypeSchema,
  source: z.string().min(1),
  target: z.string().min(1),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
  data: relationshipDataSchema.optional(),
});

export const canvasOperationSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("node.upsert"), node: nodeSnapshotSchema }),
  z.object({
    type: z.literal("node.move"),
    nodeId: z.string().min(1),
    position: positionSchema,
    parentId: z.string().nullable().optional(),
    hidden: z.boolean().optional(),
  }),
  z.object({ type: z.literal("node.delete"), nodeId: z.string().min(1) }),
  z.object({ type: z.literal("edge.upsert"), edge: edgeSnapshotSchema }),
  z.object({ type: z.literal("edge.delete"), edgeId: z.string().min(1) }),
]);

export const persistCanvasOperationsSchema = z.object({
  dataModelId: z.string().min(1),
  diagramId: z.string().min(1),
  diagramName: z.string().min(1),
  baseVersion: z.number().int().positive().nullable().optional(),
  operations: z.array(canvasOperationSchema).min(1),
});

export type CanvasOperation =
  | { type: "node.upsert"; node: TableNode | ViewNode | NoteNode | GroupNode }
  | {
      type: "node.move";
      nodeId: string;
      position: { x: number; y: number };
      parentId?: string | null;
      hidden?: boolean;
    }
  | { type: "node.delete"; nodeId: string }
  | { type: "edge.upsert"; edge: RelationshipEdge }
  | { type: "edge.delete"; edgeId: string };

export interface PersistCanvasOperationsInput {
  dataModelId: string;
  diagramId: string;
  diagramName: string;
  baseVersion?: number | null;
  operations: CanvasOperation[];
}
