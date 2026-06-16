import type { Node, Edge } from "@xyflow/react";

// ---------------------------------------------------------------------------
// Column
// ---------------------------------------------------------------------------

export type ColumnType =
  | "int"
  | "bigint"
  | "varchar"
  | "text"
  | "boolean"
  | "timestamp"
  | "jsonb"
  | "uuid"
  | "custom";

export interface ColumnData {
  id: string;
  name: string;
  /** Accepts both ColumnType values and arbitrary strings for custom types. */
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  isIdx?: boolean;
  isUnique?: boolean;
  isAutoIncrement?: boolean;
  isUuid?: boolean;
  nullable?: boolean;
  defaultValue?: string;
  notes?: string;
  customType?: string;
}

// ---------------------------------------------------------------------------
// Node data interfaces
// Each explicitly extends Record<string, unknown> to satisfy
// the @xyflow/react `Node<TData extends Record<string, unknown>>` constraint.
// ---------------------------------------------------------------------------

export interface TableIndex {
  id: string;
  name: string;
  columns: string[]; // column names
  isUnique?: boolean;
  type?: "btree" | "hash" | "gist" | "gin";
}

export type TableRecord = Record<string, string>;

export interface TableNodeData extends Record<string, unknown> {
  name: string;
  columns: ColumnData[];
  indexes?: TableIndex[];
  /** Seed / sample data rows parsed from Records blocks */
  records?: TableRecord[];
  /** e.g. "postgres" | "mysql" – drives visual badge */
  dbType?: string;
  /** Hex or CSS colour for the header bar */
  color?: string;
  /** Optional notes for the table */
  notes?: string;
  /** Column IDs hidden in sidebar and canvas list */
  hiddenColumns?: string[];
  isNew?: boolean;
  isEditing?: boolean;
}

export interface ViewNodeData extends Record<string, unknown> {
  name: string;
  query: string;
  isNew?: boolean;
  isEditing?: boolean;
}

export interface NoteNodeData extends Record<string, unknown> {
  content: string;
  color?: string;
  isNew?: boolean;
}

export interface GroupNodeData extends Record<string, unknown> {
  name: string;
  description?: string;
  color?: string;
  isCollapsed?: boolean;
  expandedHeight?: number;
  isNew?: boolean;
  isEditing?: boolean;
}

// ---------------------------------------------------------------------------
// Typed React Flow node / edge aliases
// ---------------------------------------------------------------------------

export type TableNode = Node<TableNodeData, "table">;
export type ViewNode = Node<ViewNodeData, "view">;
export type NoteNode = Node<NoteNodeData, "note">;
export type GroupNode = Node<GroupNodeData, "group">;

export type CanvasNode = TableNode | ViewNode | NoteNode | GroupNode;

// ---------------------------------------------------------------------------
// Edge data
// ---------------------------------------------------------------------------

export type CardinalityType = "1:1" | "1:n" | "n:1" | "n:m" | "0..1" | "0..n";

export interface RelationshipEdgeData extends Record<string, unknown> {
  cardinality: CardinalityType;
  fkName?: string;
  onDelete?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION";
  onUpdate?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION";
}

export type RelationshipEdge = Edge<RelationshipEdgeData, "relationship">;

// ---------------------------------------------------------------------------
// Type guards — use these for narrowing instead of raw .type === "table" checks
// ---------------------------------------------------------------------------

export function isTableNode(node: Node): node is TableNode {
  return node.type === "table";
}

export function isViewNode(node: Node): node is ViewNode {
  return node.type === "view";
}

export function isNoteNode(node: Node): node is NoteNode {
  return node.type === "note";
}

export function isGroupNode(node: Node): node is GroupNode {
  return node.type === "group";
}

export function isRelationshipEdge(edge: Edge): edge is RelationshipEdge {
  return edge.type === "relationship";
}

export type CanvasTool =
  | "select"
  | "selection"
  | "table"
  | "view"
  | "note"
  | "group"
  | "rel-1-1"
  | "rel-1-n"
  | "rel-0-1"
  | "rel-0-n"
  | "rel-n-m";

export interface ModelSettings {
  showFkName: boolean;
  showRelType: boolean;
  idColumnType: string;
  varcharDefaultLength: number;
  decimalDefaultPrecision: number;
  decimalDefaultScale: number;
  defaultColumns: {
    id: string;
    name: string;
    type: string;
    nullable: boolean;
  }[];
}
