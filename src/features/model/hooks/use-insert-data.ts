import { useState } from "react";
import { toast } from "sonner";
import { TableNodeData } from "@/features/model/types/canvas";

export type RowData = Record<string, string>;

export function useInsertData(data: TableNodeData, onClose: () => void) {
    const getDefaultValues = (rowIndex: number): RowData => {
        const defaults: RowData = {};
        data.columns?.forEach((column) => {
            const type = column.type.toLowerCase();
            if (type === "uuid") {
                defaults[column.name] = crypto.randomUUID();
            } else if ((type === "int" || type === "integer" || type === "serial") && (column.isPk || column.name.toLowerCase() === "id")) {
                defaults[column.name] = (rowIndex + 1).toString();
            } else if (type === "boolean") {
                defaults[column.name] = "false";
            }
        });
        return defaults;
    };

    const [rows, setRows] = useState<RowData[]>([getDefaultValues(0)]);

    const handleAddRow = () => {
        setRows((prev) => [...prev, getDefaultValues(prev.length)]);
    };

    const handleRemoveRow = (index: number) => {
        if (rows.length <= 1) return;
        setRows((prev) => prev.filter((_, i) => i !== index));
    };

    const handleInputChange = (rowIndex: number, columnName: string, value: string) => {
        setRows((prev) => {
            const newRows = [...prev];
            newRows[rowIndex] = { ...newRows[rowIndex], [columnName]: value };
            return newRows;
        });
    };

    const handleClearAll = () => {
        setRows([getDefaultValues(0)]);
    };

    const handleSave = () => {
        if (!data.columns || data.columns.length === 0) {
            toast.error("No columns to insert into!");
            return;
        }

        const columnNames = data.columns.map((column) => column.name).join(", ");

        const allSql = rows.map((row) => {
            const formattedValues = data.columns.map((column) => {
                const val = row[column.name];
                
                if (val === undefined || val === "") {
                    return column.nullable ? "NULL" : "''";
                }

                const type = column.type.toLowerCase();
                
                if (["int", "bigint", "smallint", "decimal", "double precision", "real", "boolean"].includes(type)) {
                    return val;
                }
                
                return `'${val.replace(/'/g, "''")}'`;
            }).join(", ");

            return `INSERT INTO ${data.name} (${columnNames}) VALUES (${formattedValues});`;
        }).join("\n");

        navigator.clipboard.writeText(allSql);
        toast.success(`${rows.length} rows of Insert SQL copied to clipboard!`);
        onClose();
    };

    return {
        rows,
        handleAddRow,
        handleRemoveRow,
        handleInputChange,
        handleClearAll,
        handleSave,
    };
}
