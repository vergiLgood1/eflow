"use client";

import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useState } from "react";
import { PopoverHeader } from "../../../atoms/popover-header";
import { toast } from "sonner";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

export function IDXConfigPopover({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
    const { getTableData, addIndex } = useTableActions();
    const table = getTableData(nodeId);

    const [name, setName] = useState("");
    const [type, setType] = useState<any>("btree");
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
            isUnique
        });
        toast.success("Index created successfully");
        onClose();
    };

    const toggleColumn = (colName: string) => {
        setSelectedColumns(prev => 
            prev.includes(colName) 
                ? prev.filter(c => c !== colName) 
                : [...prev, colName]
        );
    };

    return (
        <div className="p-1 space-y-4">
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
                        className="w-full h-8 text-xs"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs">Columns</Label>
                    <ScrollArea className="h-32 border rounded-md p-2 bg-muted/10">
                        <div className="space-y-2">
                            {table?.columns.map((col) => (
                                <div key={col.id} className="flex items-center gap-2">
                                    <Checkbox 
                                        id={`col-${col.id}`} 
                                        checked={selectedColumns.includes(col.name)}
                                        onCheckedChange={() => toggleColumn(col.name)}
                                    />
                                    <Label htmlFor={`col-${col.id}`} className="text-xs cursor-pointer truncate">
                                        {col.name} <span className="text-[10px] text-muted-foreground uppercase opacity-70">({col.type})</span>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="space-y-1.5 w-full">
                        <Label className="text-xs">Method</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="w-full h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="btree" className="text-xs">B-Tree</SelectItem>
                                <SelectItem value="hash" className="text-xs">Hash</SelectItem>
                                <SelectItem value="gist" className="text-xs">GiST</SelectItem>
                                <SelectItem value="gin" className="text-xs">GIN</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col justify-end pb-1.5 px-1">
                        <div className="flex items-center gap-2">
                            <Checkbox id="idx-unique" checked={isUnique} onCheckedChange={(v) => setIsUnique(!!v)} />
                            <Label htmlFor="idx-unique" className="text-xs cursor-pointer">Unique</Label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onClose}>Cancel</Button>
                    <Button size="sm" className="h-8 text-xs px-4" onClick={handleSave}>Create Index</Button>
                </div>
            </div>
        </div>
    );
}
