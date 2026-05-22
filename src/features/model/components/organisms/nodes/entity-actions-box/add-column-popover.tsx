"use client";

import { useTableActions } from "@/features/model/hooks/use-table-actions";
import type { ColumnData } from "@/features/model/types/canvas";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/shared/components/ui/combobox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { columnSchema } from "@/features/model/lib/schema";
import { useEffect, useRef, useState } from "react";
import { PopoverHeader } from "../../../atoms/popover-header";

const DB_TYPES = [
  "uuid",
  "varchar",
  "text",
  "int",
  "bigint",
  "boolean",
  "timestamp",
  "date",
  "decimal",
  "json",
  "jsonb",
  "double precision",
  "real",
  "smallint",
  "char",
  "bytea",
];

export function ColumnConfigPopover({
  nodeId,
  column,
  onClose,
}: {
  nodeId: string;
  column?: ColumnData;
  onClose: () => void;
}) {
  const { addColumn, updateColumn, getTableData } = useTableActions();
  const data = getTableData(nodeId);

  // Track the ID of the column we're currently adding (if any)
  const [addedColumnId, setAddedColumnId] = useState<string | null>(null);

  const [name, setName] = useState(
    column?.name ?? `col_${(data?.columns?.length ?? 0) + 1}`,
  );
  const [type, setType] = useState(column?.type ?? "varchar");
  const [isPk, setIsPk] = useState(column?.isPk ?? false);
  const [isNullable, setIsNullable] = useState(column?.nullable ?? true);
  const [isUnique, setIsUnique] = useState(column?.isUnique ?? false);
  const [isAutoIncrement, setIsAutoIncrement] = useState(
    column?.isAutoIncrement ?? false,
  );
  const [defaultValue, setDefaultValue] = useState(column?.defaultValue ?? "");
  const [notes, setNotes] = useState(column?.notes ?? "");

  const hasAddedRef = useRef(false);
  const columnId = column?.id ?? addedColumnId;

  // 1. Add the column immediately on mount ONLY IF NOT EDITING
  useEffect(() => {
    if (column || hasAddedRef.current) return;
    hasAddedRef.current = true;

    const id = addColumn(nodeId, {
      name,
      type,
      isPk,
      nullable: isNullable,
      isUnique,
      isAutoIncrement,
      isUuid: type === "uuid",
      defaultValue,
      notes,
    });
    setAddedColumnId(id);
  }, [
    addColumn,
    nodeId,
    column,
    name,
    type,
    isPk,
    isNullable,
    isUnique,
    isAutoIncrement,
    defaultValue,
    notes,
  ]);

  useEffect(() => {
    if (!columnId) return;
    const parsed = columnSchema.safeParse({
      name,
      type,
      isPk,
      nullable: isNullable,
      isUnique,
      isAutoIncrement,
      isUuid: type === "uuid",
      defaultValue,
      notes,
    });
    if (!parsed.success) return;
    updateColumn(nodeId, columnId, parsed.data);
  }, [
    name,
    type,
    isPk,
    isNullable,
    isUnique,
    isAutoIncrement,
    defaultValue,
    notes,
    nodeId,
    columnId,
    updateColumn,
  ]);

  useEffect(() => {
    if (columnId && !column) {
      onClose();
    }
  }, [columnId, column, onClose]);

  return (
    <div className="p-1">
      <PopoverHeader
        title={column ? "Edit Column" : "New Column"}
        description={
          column ? `Modifying ${column.name}` : `Configuring for ${data?.name}`
        }
      />
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs font-semibold">Column Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-sm"
              placeholder="e.g. user_id"
              autoFocus={!column}
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs font-semibold">Type</Label>
            <Combobox
              items={DB_TYPES}
              defaultValue={type}
              onValueChange={(val) => val && setType(val)}
            >
              <ComboboxTrigger
                render={
                  <Button
                    variant="outline"
                    className="relative h-8 w-full justify-between px-2 text-xs font-normal"
                  >
                    <ComboboxValue />
                    <ChevronsUpDown
                      className="absolute top-1/2 right-2 -translate-y-1/2"
                      size={14}
                    />
                  </Button>
                }
              />
              <ComboboxContent>
                <ComboboxInput showTrigger={false} placeholder="Search" />
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {DB_TYPES.map((item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Default Value</Label>
            <Input
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              className="h-8 text-sm"
              placeholder="NULL"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[60px] resize-none text-sm"
              placeholder="Column description..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
          <div className="flex items-center gap-2">
            {(() => {
              const hasAnotherPk = data?.columns?.some(
                (c) => c.isPk && c.id !== columnId,
              );
              return (
                <>
                  <Checkbox
                    id="is-pk"
                    checked={isPk}
                    onCheckedChange={(val) => setIsPk(!!val)}
                    disabled={hasAnotherPk}
                  />
                  <Label
                    htmlFor="is-pk"
                    className={cn(
                      "cursor-pointer text-xs font-medium",
                      hasAnotherPk && "cursor-not-allowed opacity-50",
                    )}
                    title={
                      hasAnotherPk ? "Table already has a primary key" : ""
                    }
                  >
                    Primary Key
                  </Label>
                </>
              );
            })()}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="is-nullable"
              checked={isNullable}
              onCheckedChange={(val) => setIsNullable(!!val)}
            />
            <Label
              htmlFor="is-nullable"
              className="cursor-pointer text-xs font-medium"
            >
              Nullable
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="is-unique"
              checked={isUnique}
              onCheckedChange={(val) => setIsUnique(!!val)}
            />
            <Label
              htmlFor="is-unique"
              className="cursor-pointer text-xs font-medium"
            >
              Unique
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="is-autoincrement"
              checked={isAutoIncrement}
              onCheckedChange={(val) => setIsAutoIncrement(!!val)}
            />
            <Label
              htmlFor="is-autoincrement"
              className="cursor-pointer text-xs font-medium"
            >
              Auto Increment
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="is-uuid" checked={type === "uuid"} disabled />
            <Label htmlFor="is-uuid" className="text-xs font-medium opacity-70">
              UUID
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
