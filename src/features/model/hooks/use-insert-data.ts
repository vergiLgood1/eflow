import { useState } from "react";
import { toast } from "sonner";
import { TableNodeData, TableRecord } from "@/features/model/types/canvas";
import { useCanvasStore } from "@/features/model/store/use-canvas-store";

export type RowData = Record<string, string>;

export function useInsertData(
  data: TableNodeData,
  nodeId: string,
  onClose: () => void,
) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  // Seed rows from existing records on the node (populated from DBML Records blocks)
  const seedRows = (): RowData[] => {
    if (data.records && data.records.length > 0) {
      return data.records.map((r) => {
        const row: RowData = {};
        data.columns?.forEach((col) => {
          row[col.name] = r[col.name] ?? "";
        });
        return row;
      });
    }
    return [getDefaultValues(0)];
  };

  const getDefaultValues = (rowIndex: number): RowData => {
    const defaults: RowData = {};
    data.columns?.forEach((column) => {
      const type = column.type.toLowerCase();
      if (type === "uuid") {
        defaults[column.name] = crypto.randomUUID();
      } else if (
        (type === "int" || type === "integer" || type === "serial") &&
        (column.isPk || column.name.toLowerCase() === "id")
      ) {
        defaults[column.name] = rowIndex.toString();
      } else if (type === "boolean") {
        defaults[column.name] = "false";
      }
    });
    return defaults;
  };

  const [rows, setRows] = useState<RowData[]>(seedRows);

  const handleAddRow = () => {
    setRows((prev) => [...prev, getDefaultValues(prev.length)]);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    rowIndex: number,
    columnName: string,
    value: string,
  ) => {
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

    // 1. Persist records back to the node so DBML roundtrip works
    const records: TableRecord[] = rows.map((row) => {
      const record: TableRecord = {};
      data.columns.forEach((col) => {
        record[col.name] = row[col.name] ?? "";
      });
      return record;
    });
    updateNodeData(nodeId, { records });

    // 2. Build SQL INSERT statements and copy to clipboard
    const columnNames = data.columns.map((col) => col.name).join(", ");
    const allSql = rows
      .map((row) => {
        const formattedValues = data.columns
          .map((column) => {
            const val = row[column.name];

            if (val === undefined || val === "") {
              return column.nullable ? "NULL" : "''";
            }

            const type = column.type.toLowerCase();
            if (
              [
                "int",
                "integer",
                "bigint",
                "smallint",
                "decimal",
                "numeric",
                "float",
                "real",
                "double precision",
                "boolean",
              ].includes(type)
            ) {
              return val;
            }

            return `'${val.replace(/'/g, "''")}'`;
          })
          .join(", ");

        return `INSERT INTO ${data.name} (${columnNames}) VALUES (${formattedValues});`;
      })
      .join("\n");

    navigator.clipboard.writeText(allSql);
    toast.success(
      `Saved ${rows.length} row(s) · INSERT SQL copied to clipboard`,
    );
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
