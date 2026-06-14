import {
  CanvasNode,
  RelationshipEdge,
  isTableNode,
  isRelationshipEdge,
  TableNode,
} from "../types/canvas";
import { format } from "sql-formatter";

export function generateSQL(
  nodes: CanvasNode[],
  edges: RelationshipEdge[],
): string {
  const tableNodes = nodes.filter(isTableNode);
  const relationshipEdges = edges.filter(isRelationshipEdge);

  let sql = "";

  // 1. Generate CREATE TABLE statements
  tableNodes.forEach((node) => {
    const { name, columns } = node.data;
    sql += `CREATE TABLE "${name}" (\n`;

    const columnDefs = columns.map((col) => {
      let def = `  "${col.name}" ${col.type.toUpperCase()}`;

      if (col.isPk) def += " PRIMARY KEY";
      if (col.isAutoIncrement) def += " GENERATED ALWAYS AS IDENTITY";
      if (!col.nullable && !col.isPk) def += " NOT NULL";
      if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;
      if (col.isUnique) def += " UNIQUE";

      return def;
    });

    sql += columnDefs.join(",\n");
    sql += "\n);\n\n";
  });

  // 2. Generate FOREIGN KEY constraints
  relationshipEdges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source) as TableNode;
    const targetNode = nodes.find((n) => n.id === edge.target) as TableNode;

    if (!sourceNode || !targetNode) return;

    const sourceColumnId = edge.sourceHandle
      ?.replace(/-source$/, "")
      .replace(/-target$/, "");
    const targetColumnId = edge.targetHandle
      ?.replace(/-source$/, "")
      .replace(/-target$/, "");
    const fkColumn =
      sourceNode.data.columns.find((column) => column.id === sourceColumnId)
        ?.name ?? resolveLegacyFkColumn(sourceNode, targetNode);
    const targetPk =
      targetNode.data.columns.find((column) => column.id === targetColumnId)
        ?.name ?? targetNode.data.columns.find((column) => column.isPk)?.name;

    if (!fkColumn || !targetPk) return;

    sql += `ALTER TABLE "${sourceNode.data.name}" ADD CONSTRAINT "${edge.data?.fkName || `fk_${sourceNode.data.name}_${targetNode.data.name}`}" \n`;
    sql += `FOREIGN KEY ("${fkColumn}") REFERENCES "${targetNode.data.name}" ("${targetPk}")`;

    if (edge.data?.onDelete) sql += ` ON DELETE ${edge.data.onDelete}`;
    if (edge.data?.onUpdate) sql += ` ON UPDATE ${edge.data.onUpdate}`;

    sql += ";\n\n";
  });

  try {
    return format(sql, { language: "postgresql" });
  } catch (e) {
    console.error("SQL Formatting failed", e);
    return sql;
  }
}

function resolveLegacyFkColumn(
  sourceNode: TableNode,
  targetNode: TableNode,
): string | undefined {
  const targetName = targetNode.data.name.toLowerCase();

  return (
    sourceNode.data.columns.find(
      (column) => column.isFk && column.name.toLowerCase().includes(targetName),
    )?.name ??
    sourceNode.data.columns.find((column) => column.isFk)?.name ??
    sourceNode.data.columns.find(
      (column) =>
        column.name.toLowerCase().endsWith("_id") &&
        column.name.toLowerCase().includes(targetName),
    )?.name
  );
}
