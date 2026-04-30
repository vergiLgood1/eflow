import { importer, Parser } from "@dbml/core";
import { CanvasNode, ColumnData, RelationshipEdge, TableIndex, TableRecord, CardinalityType } from "../types/canvas";

/**
 * Converts SQL to the internal Canvas format (nodes and edges).
 */
export function sqlToCanvas(
    sql: string,
    type: "postgres" | "mysql" | "mssql" = "postgres"
): { nodes: CanvasNode[]; edges: RelationshipEdge[] } {
    try {
        const dbml = importer.import(sql, type);
        return dbmlToCanvas(dbml);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("SQL Import failed:", message);
        throw error;
    }
}

interface RecordsParseResult {
    /** DBML with all Records blocks removed, safe for @dbml/core */
    cleanedDbml: string;
    /** Map of table name -> array of row objects */
    recordsMap: Record<string, TableRecord[]>;
}

/**
 * Parses Records blocks (dbdiagram.io extension) out of a DBML string.
 * Returns both the cleaned DBML (for @dbml/core) and a map of seed rows per table.
 *
 * Records block format:
 *   Records tableName(col1, col2, col3) {
 *     value1, value2, value3
 *     ...
 *   }
 */
function parseRecordsBlocks(dbml: string): RecordsParseResult {
    const recordsMap: Record<string, TableRecord[]> = {};
    const RECORD_BLOCK_RE = /Records\s+(\w+)\s*\(([^)]+)\)\s*\{([^}]*)\}/gm;

    const cleanedDbml = dbml.replace(RECORD_BLOCK_RE, (_match, tableName: string, colsRaw: string, bodyRaw: string) => {
        const columns = colsRaw.split(",").map(c => c.trim()).filter(Boolean);

        const rows = bodyRaw
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                // Split by comma but respect single-quoted strings
                const values: string[] = [];
                let current = "";
                let inQuote = false;
                for (let i = 0; i < line.length; i++) {
                    const ch = line[i];
                    if (ch === "'" && line[i - 1] !== "\\") inQuote = !inQuote;
                    else if (ch === "," && !inQuote) {
                        values.push(current.trim().replace(/^'|'$/g, ""));
                        current = "";
                        continue;
                    }
                    current += ch;
                }
                if (current.trim()) values.push(current.trim().replace(/^'|'$/g, ""));

                const row: TableRecord = {};
                columns.forEach((col, idx) => {
                    row[col] = values[idx] ?? "";
                });
                return row;
            });

        if (rows.length > 0) recordsMap[tableName] = rows;
        return ""; // strip from DBML
    }).trim();

    return { cleanedDbml, recordsMap };
}

/**
 * Converts DBML string to the internal Canvas format.
 */
export function dbmlToCanvas(dbml: string): { nodes: CanvasNode[]; edges: RelationshipEdge[] } {
    if (!dbml.trim()) return { nodes: [], edges: [] };

    const { cleanedDbml, recordsMap } = parseRecordsBlocks(dbml);
    if (!cleanedDbml) return { nodes: [], edges: [] };

    // Log the parsed DBML in development
    if (process.env.NODE_ENV === "development") {
        console.debug("[dbmlToCanvas] Parsing DBML:\n", cleanedDbml);
        if (Object.keys(recordsMap).length > 0) {
            console.debug("[dbmlToCanvas] Records:", recordsMap);
        }
    }

    try {
        const database = Parser.parse(cleanedDbml, "dbml");
        const nodes: CanvasNode[] = [];
        const edges: RelationshipEdge[] = [];

        let x = 100;
        let y = 100;

        database.schemas.forEach(schema => {
            // 1. Tables
            schema.tables.forEach(table => {
                const columns: ColumnData[] = table.fields.map(field => ({
                    id: Math.random().toString(36).substring(2, 9),
                    name: field.name,
                    type: field.type.type_name,
                    isPk: field.pk,
                    isUnique: field.unique,
                    nullable: !field.not_null,
                    defaultValue: field.dbdefault?.value,
                    notes: field.note,
                    isAutoIncrement: field.increment
                }));

                const indexes: TableIndex[] = table.indexes.map(idx => ({
                    id: Math.random().toString(36).substring(2, 9),
                    name: idx.name || "",
                    columns: idx.columns.map(c => c.value as string),
                    isUnique: idx.unique,
                    type: idx.type as TableIndex["type"]
                }));

                nodes.push({
                    id: table.name,
                    type: "table",
                    position: { x, y },
                    data: {
                        name: table.name,
                        columns,
                        indexes,
                        notes: table.note,
                        color: table.headerColor || "#3b82f6",
                        // Attach seed records if the DBML had a matching Records block
                        ...(recordsMap[table.name] ? { records: recordsMap[table.name] } : {}),
                    }
                });

                x += 350;
                if (x > 1400) {
                    x = 100;
                    y += 450;
                }
            });

            // 2. Refs
            schema.refs.forEach(ref => {
                const source = ref.endpoints[0];
                const target = ref.endpoints[1];
                if (!source || !target) return;

                let cardinality: CardinalityType = "1:n";
                if (source.relation === "1" && target.relation === "1") cardinality = "1:1";
                if (source.relation === "*" && target.relation === "1") cardinality = "1:n";
                if (source.relation === "1" && target.relation === "*") cardinality = "1:n";
                if (source.relation === "*" && target.relation === "*") cardinality = "n:m";

                edges.push({
                    id: `edge-${ref.name || Math.random().toString(36).substring(2, 9)}`,
                    source: source.tableName,
                    target: target.tableName,
                    type: "relationship",
                    data: {
                        cardinality,
                        fkName: ref.name,
                        onDelete: normalizeRefAction(ref.onDelete),
                        onUpdate: normalizeRefAction(ref.onUpdate)
                    }
                });
            });
        });

        return { nodes, edges };
    } catch (e: unknown) {
        let message = "Invalid DBML syntax";

        if (typeof e === "string") {
            // @dbml/core sometimes throws a raw string
            message = e || message;
        } else if (Array.isArray(e) && e.length > 0) {
            // Array of diagnostic objects
            const first = e[0] as { message?: string; diag?: { message?: string } };
            message = first?.message || first?.diag?.message || message;
        } else if (e && typeof e === "object") {
            if ("message" in e && typeof e.message === "string") {
                message = e.message;
            } else if ("errors" in e && Array.isArray(e.errors) && e.errors.length > 0) {
                const firstError = e.errors[0] as { message?: string };
                message = firstError?.message || message;
            } else if ("diags" in e && Array.isArray(e.diags) && e.diags.length > 0) {
                const firstDiag = e.diags[0] as { message?: string };
                message = firstDiag?.message || message;
            } else {
                // Last resort — stringify everything so the console shows something useful
                try {
                    const raw = JSON.stringify(e, Object.getOwnPropertyNames(e as object));
                    console.warn("[dbmlToCanvas] Opaque parser error (full dump):", raw);
                } catch {
                    console.warn("[dbmlToCanvas] Opaque parser error (unstringifiable):", e);
                }
            }
        }

        console.error("[dbmlToCanvas] Import failed:", message);
        throw new Error(message);
    }
}

/**
 * Syncs new data into existing nodes to preserve positions.
 */
export function syncCanvasData(
    currentNodes: CanvasNode[],
    currentEdges: RelationshipEdge[],
    newNodes: CanvasNode[],
    newEdges: RelationshipEdge[]
): { nodes: CanvasNode[]; edges: RelationshipEdge[] } {
    const updatedNodes = newNodes.map(newNode => {
        const existingNode = currentNodes.find(n => n.data.name === newNode.data.name);
        if (existingNode) {
            return {
                ...newNode,
                id: existingNode.id, // Keep existing ID for React Flow stability
                position: existingNode.position, // Preserve position!
            };
        }
        return newNode;
    });

    // Handle edges: we need to map source/target names to the new IDs if they changed,
    // but in our current import logic we use table names as IDs, so it might be fine.
    // However, if we move to UUIDs, we'd need a mapping table here.

    return { nodes: updatedNodes, edges: newEdges };
}

type RefAction = "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION" | undefined;

function normalizeRefAction(action: string | undefined): RefAction | undefined {
    if (!action) return undefined;
    const normalized = action.toUpperCase();
    if (normalized === "CASCADE") return "CASCADE";
    if (normalized === "SET NULL") return "SET NULL";
    if (normalized === "RESTRICT") return "RESTRICT";
    if (normalized === "NO ACTION") return "NO ACTION";
    return undefined;
}
