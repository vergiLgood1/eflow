"use client";

import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { TableNodeData } from "@/features/model/types/canvas";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useState } from "react";
import { PopoverHeader } from "../../../atoms/popover-header";

export function FKConfigPopover({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
    const { getTableData, getAllTables } = useTableActions();
    const sourceTable = getTableData(nodeId);
    const allTables = getAllTables();
    
    const [targetTableId, setTargetTableId] = useState("");
    const [sourceColumn, setSourceColumn] = useState("");
    const [targetColumn, setTargetColumn] = useState("");

    const targetTable = allTables.find(t => t.id === targetTableId);

    const handleSave = () => {
        // Implement FK saving logic here
        onClose();
    };

    return (
        <div className="p-1 space-y-4">
            <PopoverHeader 
                title="New Foreign Key" 
                description={`Defining relationship for ${sourceTable?.name}`} 
            />
            
            <div className="space-y-3">
                <div className="space-y-1.5">
                    <Label className="text-xs">Target Table</Label>
                    <Select value={targetTableId} onValueChange={setTargetTableId}>
                        <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue placeholder="Select table..." />
                        </SelectTrigger>
                        <SelectContent>
                            {allTables.filter(t => t.id !== nodeId).map(t => (
                                <SelectItem key={t.id} value={t.id} className="text-xs">{t.data.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Source Column</Label>
                        <Select value={sourceColumn} onValueChange={setSourceColumn}>
                            <SelectTrigger className="w-full h-8 text-xs">
                                <SelectValue placeholder="Column..." />
                            </SelectTrigger>
                            <SelectContent>
                                {sourceTable?.columns?.map(col => (
                                    <SelectItem key={col.id} value={col.id} className="text-xs">{col.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Target Column</Label>
                        <Select value={targetColumn} onValueChange={setTargetColumn} disabled={!targetTableId}>
                            <SelectTrigger className="w-full h-8 text-xs">
                                <SelectValue placeholder="Column..." />
                            </SelectTrigger>
                            <SelectContent>
                                {targetTable?.data.columns?.map(col => (
                                    <SelectItem key={col.id} value={col.id} className="text-xs">{col.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onClose}>Cancel</Button>
                    <Button size="sm" className="h-8 text-xs px-4" onClick={handleSave}>Add Relation</Button>
                </div>
            </div>
        </div>
    );
}
