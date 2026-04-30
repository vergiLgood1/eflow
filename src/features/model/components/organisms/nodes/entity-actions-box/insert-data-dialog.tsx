"use client";

import { InsertDataCell } from "@/features/model/components/molecules/insert-data-cell";
import { useInsertData } from "@/features/model/hooks/use-insert-data";
import { TableNodeData } from "@/features/model/types/canvas";
import { Button } from "@/shared/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

interface InsertDataDialogProps {
    nodeId: string;
    data: TableNodeData;
    onClose: () => void;
}

export function InsertDataDialog({ nodeId, data, onClose }: InsertDataDialogProps) {
    const {
        rows,
        handleAddRow,
        handleRemoveRow,
        handleInputChange,
        handleClearAll,
        handleSave,
    } = useInsertData(data, nodeId, onClose);

    return (
        <DialogContent className="flex h-[80vh] w-[1100px] max-w-[calc(100vw-2rem)] sm:max-w-none flex-col overflow-hidden p-0">
            <DialogHeader className="shrink-0 border-b px-4 py-3">
                <DialogTitle className="text-sm font-semibold text-foreground">Insert data</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                    Fill default values to insert into this table when the project initializes.
                </DialogDescription>
                <div className="mt-1 text-[11px] text-muted-foreground font-medium">Table: {data.name}</div>
            </DialogHeader>

            <div className="flex min-w-0 flex-1 flex-col p-4 overflow-hidden">
                <div className="mb-3 flex items-center justify-between shrink-0">
                    <div className="text-xs font-semibold text-foreground">Rows</div>
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

                <div className="min-h-0 min-w-0 flex-1 rounded border overflow-hidden">
                    <div className="h-full w-full overflow-auto text-[11px]">
                        <Table className="w-max border-collapse min-w-full">
                            <TableHeader>
                                <TableRow className="bg-muted/50 text-[12px] font-semibold hover:bg-muted/50">
                                    <TableHead className="px-3 py-2 text-left w-[70px]">#</TableHead>
                                    {data.columns?.map((column) => (
                                        <TableHead key={column.id} className="px-3 py-2 text-left w-[220px]">
                                            <div className="truncate">{column.name}</div>
                                            <div className="text-[10px] font-normal text-muted-foreground italic">
                                                {column.type}
                                            </div>
                                        </TableHead>
                                    ))}
                                    <TableHead className="px-3 py-2 text-right w-[70px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row, rowIndex) => (
                                    <TableRow key={rowIndex} className="text-[12px]">
                                        <TableCell className="px-3 py-2 text-muted-foreground">
                                            {rowIndex + 1}
                                        </TableCell>
                                        {data.columns?.map((column) => (
                                            <InsertDataCell
                                                key={column.id}
                                                column={column}
                                                value={row[column.name] || ""}
                                                onChange={(val) => handleInputChange(rowIndex, column.name, val)}
                                            />
                                        ))}
                                        <TableCell className="px-3 py-2 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
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

            <div className="shrink-0 flex items-center justify-between border-t px-4 py-3 bg-muted/10">
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
                    <Button
                        size="sm"
                        className="h-8 text-xs px-6"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </DialogContent>
    );
}
