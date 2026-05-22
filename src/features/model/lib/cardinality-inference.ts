/**
 * Cardinality Inference Utility
 *
 * Auto-detects relationship cardinality based on:
 * - FK column constraints (UNIQUE, NOT NULL)
 * - Whether source table is a junction table
 * - Column properties (nullable, etc)
 */

import { ColumnData, CardinalityType, TableNodeData } from "../types/canvas";

/**
 * Infer cardinality based on FK column properties and tables
 */
export function inferCardinality(
  fkColumn: ColumnData,
  sourceTable: TableNodeData,
  targetTable: TableNodeData,
): CardinalityType {
  // Rule 0: Many-to-Many pattern (source is junction table)
  if (isJunctionTable(sourceTable)) {
    return "n:m";
  }

  // Rule 1: One-to-One (FK has UNIQUE constraint)
  if (fkColumn.isUnique) {
    return fkColumn.nullable ? "0..1" : "1:1";
  }

  // Rule 2: One-to-Many (FK is NOT unique, check nullable)
  if (!fkColumn.isUnique) {
    return fkColumn.nullable ? "0..n" : "1:n";
  }

  // Default fallback
  return "1:n";
}

/**
 * Detect if table is a junction/associative table for many-to-many relationships
 *
 * Pattern: table with 2+ FK columns and ≤3 total columns
 */
export function isJunctionTable(table: TableNodeData): boolean {
  const fkColumns = table.columns.filter((col) => col.isFk);
  const pkColumns = table.columns.filter((col) => col.isPk);

  return (
    fkColumns.length >= 2 && table.columns.length <= 3 && pkColumns.length <= 2
  );
}

/**
 * Validation result for cardinality selections
 */
export interface ValidationWarning {
  level: "info" | "warning" | "error";
  message: string;
  suggestion: string;
}

/**
 * Validate if cardinality matches FK column constraints
 */
export function validateCardinality(
  fkColumn: ColumnData,
  cardinality: CardinalityType,
  sourceTable: TableNodeData,
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Warning 1: 1:1 but FK not UNIQUE
  if (cardinality === "1:1" && !fkColumn.isUnique) {
    warnings.push({
      level: "warning",
      message: "1:1 relationship requires UNIQUE constraint on FK column",
      suggestion:
        "Add UNIQUE constraint to the FK column, or change cardinality to 1:n",
    });
  }

  // Warning 2: 0..1 but FK not UNIQUE or not nullable
  if (cardinality === "0..1" && (!fkColumn.nullable || !fkColumn.isUnique)) {
    warnings.push({
      level: "warning",
      message: "0..1 relationship requires FK to be NULLABLE and UNIQUE",
      suggestion: "Make FK column nullable and add UNIQUE constraint",
    });
  }

  // Warning 3: 0..n but FK not nullable
  if (cardinality === "0..n" && !fkColumn.nullable) {
    warnings.push({
      level: "warning",
      message: "0..n relationship requires FK to be NULLABLE",
      suggestion: "Make FK column nullable, or change cardinality to 1:n",
    });
  }

  // Warning 4: 1:n but FK is nullable (should be 0..n)
  if (cardinality === "1:n" && fkColumn.nullable) {
    warnings.push({
      level: "info",
      message: "1:n with NULLABLE FK column",
      suggestion: "Consider 0..n cardinality for optional relationships",
    });
  }

  // Warning 5: n:m but source is not junction table
  if (cardinality === "n:m" && !isJunctionTable(sourceTable)) {
    warnings.push({
      level: "warning",
      message: "n:m relationships typically use a junction table",
      suggestion:
        "Create a junction table with 2 FK columns, or use 1:n relationship",
    });
  }

  return warnings;
}

/**
 * Generate appropriate FK column name based on target table
 *
 * Pattern: {singularize(targetTableName)}_id
 * Examples: posts → post_id, users → user_id, categories → category_id
 */
export function generateFkColumnName(
  targetTableName: string,
  targetPkName: string = "id",
): string {
  const singular = singularize(targetTableName);
  return `${singular.toLowerCase()}_${targetPkName.toLowerCase()}`;
}

/**
 * Simple singularization (handles common patterns)
 *
 * Examples:
 *   categories → category
 *   classes → class
 *   users → user
 *   posts → post
 */
function singularize(name: string): string {
  if (name.endsWith("ies")) return name.slice(0, -3) + "y"; // categories → category
  if (name.endsWith("zes")) return name.slice(0, -2); // classes → class (zes→z)
  if (name.endsWith("ses")) return name.slice(0, -2); // classes → class
  if (name.endsWith("xes")) return name.slice(0, -2); // boxes → box
  if (name.endsWith("ches")) return name.slice(0, -2); // watches → watch
  if (name.endsWith("shes")) return name.slice(0, -2); // bushes → bush
  if (name.endsWith("es")) return name.slice(0, -2); // classes → class
  if (name.endsWith("s")) return name.slice(0, -1); // users → user
  return name;
}

/**
 * Check if source table has only ID column (candidate for auto-create FK)
 */
export function hasOnlyIdColumn(table: TableNodeData): boolean {
  if (table.columns.length !== 1) return false;
  const column = table.columns[0];
  return (
    !!column.isPk &&
    (column.name.toLowerCase() === "id" ||
      column.name.toLowerCase().endsWith("_id"))
  );
}

/**
 * Get appropriate constraints for FK column based on cardinality
 */
export interface FkColumnConstraints {
  nullable: boolean;
  isUnique: boolean;
}

export function getFkColumnConstraints(
  cardinality: CardinalityType,
): FkColumnConstraints {
  switch (cardinality) {
    case "1:1":
      return { nullable: false, isUnique: true };
    case "0..1":
      return { nullable: true, isUnique: true };
    case "1:n":
      return { nullable: false, isUnique: false };
    case "0..n":
      return { nullable: true, isUnique: false };
    case "n:m":
      return { nullable: false, isUnique: false }; // For junction table FKs
    default:
      return { nullable: false, isUnique: false };
  }
}
