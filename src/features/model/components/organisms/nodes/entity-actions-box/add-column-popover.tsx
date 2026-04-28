"use client";

import { useCanvasStore } from "@/features/model/store/use-canvas-store";
import { TableNodeData, ColumnData } from "@/features/model/types/canvas";
import { useState } from "react";
import { PopoverHeader } from "./popover-header";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/shared/components/ui/combobox";

const DB_TYPES = [
    "uuid", "varchar", "text", "int", "bigint", "boolean", "timestamp",
    "date", "decimal", "json", "jsonb", "double precision", "real",
    "smallint", "char", "bytea",
];

export function AddColumnPopover({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
    const updateNodeData = useCanvasStore((s) => s.updateNodeData);
    const nodes = useCanvasStore((s) => s.nodes);
    const node = nodes.find((n) => n.id === nodeId);
    const data = node?.data as TableNodeData | undefined;

    const [name, setName] = useState("new_column");
    const [type, setType] = useState("varchar");
    const [search, setSearch] = useState("");
    const [isPk, setIsPk] = useState(false);
    const [isNullable, setIsNullable] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data) return;

        const newColumn: ColumnData = {
            id: crypto.randomUUID(),
            name,
            type,
            isPk,
            nullable: isNullable,
        };

        updateNodeData(nodeId, {
            ...data,
            columns: [...(data.columns ?? []), newColumn],
        });
        onClose();
    };

    const filteredTypes = DB_TYPES.filter((t) =>
        t.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-1">
            <PopoverHeader title="Add New Column" description={`Adding to ${data?.name}`} />
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Column Name</Label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-8 text-sm"
                        placeholder="e.g. user_id"
                        autoFocus
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Type</Label>
                    <Combobox
                        value={type}
                        onValueChange={(val) => setType(val ?? "")}
                        onInputValueChange={setSearch}
                    >
                        <ComboboxInput placeholder="Search type..." className="h-8 text-xs font-mono" />
                        <ComboboxContent>
                            <ComboboxList className="max-h-48 overflow-y-auto">
                                {filteredTypes.map((t) => (
                                    <ComboboxItem key={t} value={t} className="font-mono text-xs">
                                        {t}
                                    </ComboboxItem>
                                ))}
                                {filteredTypes.length === 0 && (
                                    <div className="p-4 text-xs text-center text-muted-foreground">
                                        No results found for "{search}"
                                    </div>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="flex items-center gap-2">
                        <Checkbox id="is-pk" checked={isPk} onCheckedChange={(val) => setIsPk(!!val)} />
                        <Label htmlFor="is-pk" className="text-xs cursor-pointer font-medium">Primary Key</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="is-nullable" checked={isNullable} onCheckedChange={(val) => setIsNullable(!!val)} />
                        <Label htmlFor="is-nullable" className="text-xs cursor-pointer font-medium">Nullable</Label>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-1 border-t border-border mt-2 pt-2">
                    <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" size="sm" className="h-7 text-xs">
                        Add Column
                    </Button>
                </div>
            </form>
        </div>
    );
}
