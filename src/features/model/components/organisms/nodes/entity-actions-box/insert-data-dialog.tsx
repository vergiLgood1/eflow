"use client";

import { InsertDataCell } from "@/features/model/components/molecules/insert-data-cell";
import { useInsertData } from "@/features/model/hooks/use-insert-data";
import { TableNodeData } from "@/features/model/types/canvas";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

interface InsertDataDialogProps {
  nodeId: string;
  data: TableNodeData;
  onClose: () => void;
}

export function InsertDataDialog({
  nodeId,
  data,
  onClose,
}: InsertDataDialogProps) {
  const {
    rows,
    handleAddRow,
    handleRemoveRow,
    handleInputChange,
    handleClearAll,
    handleSave,
  } = useInsertData(data, nodeId, onClose);

  return (
    <DialogContent className="flex h-[80vh] w-[1100px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden p-0 sm:max-w-none">
      <DialogHeader className="shrink-0 border-b px-4 py-3">
        <DialogTitle className="text-foreground text-sm font-semibold">
          Insert data
        </DialogTitle>
        <DialogDescription className="text-muted-foreground text-xs">
          Fill default values to insert into this table when the project
          initializes.
        </DialogDescription>
        <div className="text-muted-foreground mt-1 text-[11px] font-medium">
          Table: {data.name}
        </div>
      </DialogHeader>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden p-4">
        <div className="mb-3 flex shrink-0 items-center justify-between">
          <div className="text-foreground text-xs font-semibold">Rows</div>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 gap-2 text-xs"
            onClick={handleAddRow}
          >
            <Plus className="h-4 w-4" />
            Add row
          </Button>
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-hidden rounded border">
          <div className="h-full w-full overflow-auto text-[11px]">
            <Table className="w-max min-w-full border-collapse">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 text-[12px] font-semibold">
                  <TableHead className="w-[70px] px-3 py-2 text-left">
                    #
                  </TableHead>
                  {data.columns?.map((column) => (
                    <TableHead
                      key={column.id}
                      className="w-[220px] px-3 py-2 text-left"
                    >
                      <div className="truncate">{column.name}</div>
                      <div className="text-muted-foreground text-[10px] font-normal italic">
                        {column.type}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-[70px] px-3 py-2 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="text-[12px]">
                    <TableCell className="text-muted-foreground px-3 py-2">
                      {rowIndex + 1}
                    </TableCell>
                    {data.columns?.map((column) => (
                      <InsertDataCell
                        key={column.id}
                        column={column}
                        value={row[column.name] || ""}
                        onChange={(val) =>
                          handleInputChange(rowIndex, column.name, val)
                        }
                      />
                    ))}
                    <TableCell className="px-3 py-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                        disabled={rows.length <= 1}
                        onClick={() => handleRemoveRow(rowIndex)}
                        title="Remove row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="bg-muted/10 flex shrink-0 items-center justify-between border-t px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={handleClearAll}
        >
          Clear all data
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 text-xs"
            onClick={onClose}
          >
            Close
          </Button>
          <Button size="sm" className="h-8 px-6 text-xs" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
