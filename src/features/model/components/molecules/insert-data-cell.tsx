import { ColumnData } from "@/features/model/types/canvas";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { TableCell } from "@/shared/components/ui/table";

interface InsertDataCellProps {
  column: ColumnData;
  value: string;
  onChange: (value: string) => void;
}

export function InsertDataCell({
  column,
  value,
  onChange,
}: InsertDataCellProps) {
  const type = column.type.toLowerCase();

  return (
    <TableCell className="px-3 py-2">
      {type === "boolean" ? (
        <div className="flex h-[26px] items-center justify-start">
          <Switch
            checked={value === "true"}
            onCheckedChange={(checked) => onChange(checked ? "true" : "false")}
          />
        </div>
      ) : (
        <Input
          type={
            [
              "int",
              "bigint",
              "smallint",
              "decimal",
              "double precision",
              "real",
            ].includes(type)
              ? "number"
              : type === "date"
                ? "date"
                : type === "timestamp"
                  ? "datetime-local"
                  : "text"
          }
          className="h-[26px] bg-transparent px-2 text-[11px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={column.nullable ? "NULL" : ""}
        />
      )}
    </TableCell>
  );
}
