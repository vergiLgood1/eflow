"use client";

import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { useCanvasStore } from "@/features/model/store/use-canvas-store";
import { CardinalityType, TableNodeData } from "@/features/model/types/canvas";
import { 
  inferCardinality, 
  validateCardinality, 
  hasOnlyIdColumn 
} from "@/features/model/lib/cardinality-inference";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { AlertCircle, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PopoverHeader } from "../../../atoms/popover-header";

export function FKConfigPopover({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
    const { getTableData, getAllTables, addColumn } = useTableActions();
    const edges = useCanvasStore((s) => s.edges);
    const setEdges = useCanvasStore((s) => s.setEdges);
    const sourceTable = getTableData(nodeId);
    const allTables = getAllTables();
    
    const [targetTableId, setTargetTableId] = useState("");
    const [sourceColumn, setSourceColumn] = useState("");
    const [targetColumn, setTargetColumn] = useState("");
    const [cardinality, setCardinality] = useState<CardinalityType>("1:n");
    const [onDeleteAction, setOnDeleteAction] = useState("NO ACTION");
    const [onUpdateAction, setOnUpdateAction] = useState("NO ACTION");
    const [autoCreateFk, setAutoCreateFk] = useState(false);
    const [validationWarnings, setValidationWarnings] = useState<Array<{ level: string; message: string; suggestion: string }>>([]);

    const targetTable = allTables.find(t => t.id === targetTableId);
    const sourceFkColumn = sourceTable?.columns.find(c => c.id === sourceColumn);
    const targetPkColumn = targetTable?.data.columns?.find(c => c.isPk);

    // Auto-detect cardinality when FK column changes
    useEffect(() => {
        if (sourceColumn && targetTableId && sourceFkColumn && targetTable?.data && sourceTable) {
            const detected = inferCardinality(sourceFkColumn, sourceTable, targetTable.data as TableNodeData);
            setCardinality(detected);

            // Validate constraints
            const warnings = validateCardinality(sourceFkColumn, detected, sourceTable);
            setValidationWarnings(warnings);
        }
    }, [sourceColumn, targetTableId, sourceFkColumn, sourceTable, targetTable]);

    // Auto-suggest FK creation if source table has only ID column
    useEffect(() => {
        if (targetTableId && sourceTable && hasOnlyIdColumn(sourceTable)) {
            setAutoCreateFk(true);
        } else {
            setAutoCreateFk(false);
        }
    }, [targetTableId, sourceTable]);

    const handleSave = () => {
        if (!sourceColumn && !autoCreateFk) {
            toast.error("Please select source column or enable auto-create FK.");
            return;
        }

        if (!targetColumn || !targetTableId) {
            toast.error("Please select target table and target column.");
            return;
        }

    let finalSourceColumnId = sourceColumn;
    let fkColumnName = sourceFkColumn?.name || "";

    // Auto-create FK column if enabled
    if (autoCreateFk && !sourceColumn) {
        if (!sourceTable || !targetPkColumn) {
            toast.error("Cannot auto-create FK column: source or target table missing.");
            return;
        }

        const fkName = `${targetTable?.data.name.toLowerCase()}_${targetPkColumn.name.toLowerCase()}`;
        const newColumn = {
            name: fkName,
            type: targetPkColumn?.type || "INT",
            nullable: cardinality.includes("0"),
            isPk: false,
            isFk: true,
            isUnique: cardinality === "1:1" || cardinality === "0..1",
            defaultValue: undefined as string | undefined,
        };

        const newColumnId = addColumn(nodeId, newColumn);
        if (!newColumnId) {
            toast.error("Failed to create FK column.");
            return;
        }
        finalSourceColumnId = newColumnId;
        fkColumnName = fkName;
        toast.success(`Auto-created FK column: ${fkName}`);
    }

    const newEdge = {
        id: crypto.randomUUID(),
        source: nodeId,
        target: targetTableId,
        sourceHandle: `${finalSourceColumnId}-source`,
        targetHandle: `${targetColumn}-target`,
        type: "relationship" as const,
        data: {
            cardinality,
            onDelete: onDeleteAction,
            onUpdate: onUpdateAction,
            fkName: fkColumnName || `${targetTable?.data.name.toLowerCase()}_${targetPkColumn?.name || "id"}`,
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

                {/* Auto-Create FK Option */}
                {autoCreateFk && (
                    <Alert className="border-blue-200 bg-blue-50">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-xs text-blue-900">Auto-Create FK Column</AlertTitle>
                        <AlertDescription className="text-xs text-blue-800">
                            Source table has only ID. Auto-creating FK column for the relationship.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Source Column</Label>
                        <Select value={sourceColumn} onValueChange={setSourceColumn} disabled={autoCreateFk}>
                            <SelectTrigger className="w-full h-8 text-xs">
                                <SelectValue placeholder={autoCreateFk ? "Auto-created" : "Column..."} />
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

                {/* Validation Warnings */}
                {validationWarnings.length > 0 && (
                    <div className="space-y-1.5">
                        {validationWarnings.map((warning, idx) => (
                            <Alert 
                                key={idx} 
                                className={warning.level === "warning" ? "border-yellow-200 bg-yellow-50" : "border-blue-200 bg-blue-50"}
                            >
                                <AlertCircle className={`h-4 w-4 ${warning.level === "warning" ? "text-yellow-600" : "text-blue-600"}`} />
                                <AlertTitle className={`text-xs ${warning.level === "warning" ? "text-yellow-900" : "text-blue-900"}`}>
                                    {warning.message}
                                </AlertTitle>
                                <AlertDescription className={`text-xs ${warning.level === "warning" ? "text-yellow-800" : "text-blue-800"}`}>
                                    {warning.suggestion}
                                </AlertDescription>
                            </Alert>
                        ))}
                    </div>
                )}

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

                <div className="space-y-1.5">
                    <Label className="text-xs">Cardinality <span className="text-blue-600">(Auto-detected)</span></Label>
                    <Select value={cardinality} onValueChange={(val) => setCardinality(val as CardinalityType)}>
                        <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1:1" className="text-xs">1:1 (One-to-One)</SelectItem>
                            <SelectItem value="0..1" className="text-xs">0..1 (Optional One-to-One)</SelectItem>
                            <SelectItem value="1:n" className="text-xs">1:n (One-to-Many)</SelectItem>
                            <SelectItem value="0..n" className="text-xs">0..n (Optional One-to-Many)</SelectItem>
                            <SelectItem value="n:m" className="text-xs">n:m (Many-to-Many)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onClose}>Cancel</Button>
                    <Button size="sm" className="h-8 text-xs px-4" onClick={handleSave} disabled={(!sourceColumn && !autoCreateFk) || !targetColumn || !targetTableId}>
                        Add Relation
                    </Button>
                </div>
            </div>
        </div>
    );
}
