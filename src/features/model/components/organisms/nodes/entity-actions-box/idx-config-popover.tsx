"use client";

import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useState } from "react";
import { PopoverHeader } from "../../../atoms/popover-header";
import { toast } from "sonner";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

export function IDXConfigPopover({
  nodeId,
  onClose,
}: {
  nodeId: string;
  onClose: () => void;
}) {
  const { getTableData, addIndex } = useTableActions();
  const table = getTableData(nodeId);

  const [name, setName] = useState("");
  const [type, setType] = useState<"btree" | "hash" | "gist" | "gin">("btree");
  const [isUnique, setIsUnique] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleSave = () => {
    if (selectedColumns.length === 0) {
      toast.error("Select at least one column");
      return;
    }
    addIndex(nodeId, {
      name: name || `idx_${table?.name}_${selectedColumns.join("_")}`,
      columns: selectedColumns,
      type,
      isUnique,
    });
    toast.success("Index created successfully");
    onClose();
  };

  const toggleColumn = (colName: string) => {
    setSelectedColumns((prev) =>
      prev.includes(colName)
        ? prev.filter((c) => c !== colName)
        : [...prev, colName],
    );
  };

  return (
    <div className="space-y-4 p-1">
      <PopoverHeader
        title="New Index"
        description={`Optimizing queries for ${table?.name}`}
      />

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Index Name</Label>
          <Input
            placeholder="idx_name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 w-full text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Columns</Label>
          <ScrollArea className="bg-muted/10 h-32 rounded-md border p-2">
            <div className="space-y-2">
              {table?.columns.map((col) => (
                <div key={col.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`col-${col.id}`}
                    checked={selectedColumns.includes(col.name)}
                    onCheckedChange={() => toggleColumn(col.name)}
                  />
                  <Label
                    htmlFor={`col-${col.id}`}
                    className="cursor-pointer truncate text-xs"
                  >
                    {col.name}{" "}
                    <span className="text-muted-foreground text-[10px] uppercase opacity-70">
                      ({col.type})
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full space-y-1.5">
            <Label className="text-xs">Method</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as typeof type)}
            >
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="btree" className="text-xs">
                  B-Tree
                </SelectItem>
                <SelectItem value="hash" className="text-xs">
                  Hash
                </SelectItem>
                <SelectItem value="gist" className="text-xs">
                  GiST
                </SelectItem>
                <SelectItem value="gin" className="text-xs">
                  GIN
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-end px-1 pb-1.5">
            <div className="flex items-center gap-2">
              <Checkbox
                id="idx-unique"
                checked={isUnique}
                onCheckedChange={(v) => setIsUnique(!!v)}
              />
              <Label htmlFor="idx-unique" className="cursor-pointer text-xs">
                Unique
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button size="sm" className="h-8 px-4 text-xs" onClick={handleSave}>
            Create Index
          </Button>
        </div>
      </div>
    </div>
  );
}
