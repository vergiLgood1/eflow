"use client";

import { useTableActions } from "@/features/model/hooks/use-table-actions";
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
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PopoverHeader } from "../../../atoms/popover-header";

const DB_TYPES = [
    "uuid", "varchar", "text", "int", "bigint", "boolean", "timestamp",
    "date", "decimal", "json", "jsonb", "double precision", "real",
    "smallint", "char", "bytea",
];

export function AddColumnPopover({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
    const { addColumn, updateColumn, getTableData } = useTableActions();
    const data = getTableData(nodeId);

    // Track the ID of the column we're currently "adding" (editing)
    const [columnId, setColumnId] = useState<string | null>(null);

    const [name, setName] = useState(`col_${(data?.columns?.length ?? 0) + 1}`);
    const [type, setType] = useState("varchar");
    const [search, setSearch] = useState("");
    const [isPk, setIsPk] = useState(false);
    const [isNullable, setIsNullable] = useState(true);

    const hasAddedRef = useRef(false);

    // 1. Add the column immediately on mount
    useEffect(() => {
        if (hasAddedRef.current) return;
        hasAddedRef.current = true;

        const id = addColumn(nodeId, {
            name: `col_${(data?.columns?.length ?? 0) + 1}`,
            type: "varchar",
            isPk: false,
            nullable: true,
        });
        setColumnId(id);
    }, [addColumn, nodeId]);


    useEffect(() => {
        if (!columnId) return;
        updateColumn(nodeId, columnId, {
            name,
            type,
            isPk,
            nullable: isNullable,
        });
    }, [name, type, isPk, isNullable, nodeId, columnId, updateColumn]);

    return (
        <div className="p-1">
            <PopoverHeader title="New Column" description={`Configuring for ${data?.name}`} />
            <div className="space-y-3">
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
                    <Combobox items={DB_TYPES} defaultValue={DB_TYPES[1]}>
                        <ComboboxTrigger render={
                            <ComboboxTrigger
                                render={
                                    <Button variant="outline" className="w-64 justify-between font-normal relative">
                                        <ComboboxValue />
                                        <ChevronsUpDown className="absolute right-2 top-1/2 -translate-y-1/2" size={16} />
                                    </Button>
                                }
                            />
                        }>
                        </ComboboxTrigger>
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
            </div>
        </div>
    );
}
