import { CanvasNode, RelationshipEdge, isTableNode, isRelationshipEdge, TableNode } from "../types/canvas";
import { format } from "sql-formatter";

export function generateSQL(nodes: CanvasNode[], edges: RelationshipEdge[]): string {
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
        const sourceNode = nodes.find(n => n.id === edge.source) as TableNode;
        const targetNode = nodes.find(n => n.id === edge.target) as TableNode;

        if (!sourceNode || !targetNode) return;

        // In a real app, we might need to know which columns are being linked.
        // For now, let's assume the relationship implies a FK from source to target PK
        // or we use the data in the edge if available.
        // NOTE: Our current schema doesn't explicitly store which columns are linked in the edge.
        // We might need to guess or extend the schema.
        
        // Simple heuristic for now: assume target PK is being referenced by a column in source named [target_table]_id
        const targetPk = targetNode.data.columns.find(c => c.isPk)?.name || "id";
        const fkColumn = sourceNode.data.columns.find(c => c.isFk && c.name.toLowerCase().includes(targetNode.data.name.toLowerCase()))?.name 
                        || `${targetNode.data.name.toLowerCase()}_id`;

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
