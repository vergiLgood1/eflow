"use client";

import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { useCanvasStore } from "@/features/model/store/use-canvas-store";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { PopoverHeader } from "../../../atoms/popover-header";

export function FKConfigPopover({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
    const { getTableData, getAllTables } = useTableActions();
    const addEdge = useCanvasStore((s) => s.onConnect);
    const edges = useCanvasStore((s) => s.edges);
    const setEdges = useCanvasStore((s) => s.setEdges);
    const sourceTable = getTableData(nodeId);
    const allTables = getAllTables();
    
    const [targetTableId, setTargetTableId] = useState("");
    const [sourceColumn, setSourceColumn] = useState("");
    const [targetColumn, setTargetColumn] = useState("");
    const [onDeleteAction, setOnDeleteAction] = useState("NO ACTION");
    const [onUpdateAction, setOnUpdateAction] = useState("NO ACTION");

    const targetTable = allTables.find(t => t.id === targetTableId);

    const handleSave = () => {
        if (!sourceColumn || !targetColumn || !targetTableId) {
            toast.error("Please select source column, target table, and target column.");
            return;
        }

        const newEdge = {
            id: crypto.randomUUID(),
            source: nodeId,
            target: targetTableId,
            sourceHandle: `${sourceColumn}-source`,
            targetHandle: `${targetColumn}-target`,
            type: "relationship" as const,
            data: {
                cardinality: "1:n" as const,
                onDelete: onDeleteAction,
                onUpdate: onUpdateAction,
            },
        };

        setEdges([...edges, newEdge]);
        toast.success("Foreign key relationship created.");
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

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">On Delete</Label>
                        <Select value={onDeleteAction} onValueChange={setOnDeleteAction}>
                            <SelectTrigger className="w-full h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {["NO ACTION", "CASCADE", "SET NULL", "RESTRICT"].map(action => (
                                    <SelectItem key={action} value={action} className="text-xs">{action}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">On Update</Label>
                        <Select value={onUpdateAction} onValueChange={setOnUpdateAction}>
                            <SelectTrigger className="w-full h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {["NO ACTION", "CASCADE", "SET NULL", "RESTRICT"].map(action => (
                                    <SelectItem key={action} value={action} className="text-xs">{action}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onClose}>Cancel</Button>
                    <Button size="sm" className="h-8 text-xs px-4" onClick={handleSave} disabled={!sourceColumn || !targetColumn || !targetTableId}>Add Relation</Button>
                </div>
            </div>
        </div>
    );
}
