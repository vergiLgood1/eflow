"use client";

import {
    ColorPicker,
    ColorPickerAlpha,
    ColorPickerFormat,
    ColorPickerHue,
    ColorPickerOutput,
    ColorPickerSelection,
} from "@/shared/components/color-picker";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/shared/components/ui/combobox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import Color from "color";
import {
    ClipboardEdit,
    Copy,
    Database,
    Palette,
    Plus,
    RotateCcw,
    Settings,
    Table2,
    Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import colors from "tailwindcss/colors";
import { useCanvasStore } from "../../../store/use-canvas-store";
import type { ColumnData, TableNodeData } from "../../../types/canvas";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

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

const PRESET_COLORS = [
    colors.blue[500],
    colors.green[500],
    colors.purple[500],
    colors.orange[500],
    colors.red[500],
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function PopoverHeader({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-3 border-b border-border pb-2">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {description && <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EntityActionsBoxProps {
    nodeId: string;
    data: TableNodeData;
}

// ---------------------------------------------------------------------------
// Icon button used inside the actions box
// ---------------------------------------------------------------------------

function BoxIconButton({
    tooltip,
    icon,
    className,
    onClick,
}: {
    tooltip: string;
    icon: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "text-primary-foreground transition-opacity hover:opacity-70 cursor-pointer",
                        className,
                    )}
                    onClick={onClick}
                >
                    {icon}
                </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[10px] py-1 px-2">
                {tooltip}
            </TooltipContent>
        </Tooltip>
    );
}

// ---------------------------------------------------------------------------
// Add Column Popover
// ---------------------------------------------------------------------------

function AddColumnPopover({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
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

// ---------------------------------------------------------------------------
// Notes Popover
// ---------------------------------------------------------------------------

function NotesPopover({ nodeId, data, onClose }: { nodeId: string; data: TableNodeData; onClose: () => void }) {
    const updateNodeData = useCanvasStore((s) => s.updateNodeData);
    const [notes, setNotes] = useState(data.notes ?? "");

    // Real-time synchronization
    useEffect(() => {
        if (notes !== data.notes) {
            updateNodeData(nodeId, { ...data, notes });
        }
    }, [notes, nodeId, data, updateNodeData]);

    return (
        <div className="grid gap-2 min-w-[280px]">
            <div className="border-b border-border pb-2 mb-1">
                <div className="text-sm font-semibold text-foreground">Notes</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Table: {data.name}</div>
            </div>

            <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-foreground/80">Table Documentation</Label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[140px] w-full resize-y rounded border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/50 transition-colors focus:border-primary/50"
                    placeholder="Write notes about this table…"
                    autoFocus
                />
            </div>

            <div className="flex justify-end gap-2 pt-1 border-t border-border mt-2 pt-2">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Properties Popover
// ---------------------------------------------------------------------------

function PropertiesPopover({ nodeId, data, onClose }: { nodeId: string; data: TableNodeData; onClose: () => void }) {
    const updateNodeData = useCanvasStore((s) => s.updateNodeData);

    const [name, setName] = useState(data.name);
    const [color, setColor] = useState(data.color ?? colors.blue[500]);
    const [showPicker, setShowPicker] = useState(false);

    // Real-time synchronization
    useEffect(() => {
        if (name !== data.name || color !== data.color) {
            updateNodeData(nodeId, { ...data, name, color });
        }
    }, [name, color, nodeId, data, updateNodeData]);

    const handleReset = () => {
        setColor(colors.blue[500]);
        setShowPicker(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onClose();
    };

    return (
        <div className="p-1">
            <PopoverHeader title="Table Properties" description="Configure table settings" />
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Table Name</Label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Header Color</Label>
                    <div className="flex flex-wrap gap-2 pt-1 mb-3">
                        {PRESET_COLORS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                className={cn(
                                    "size-6 rounded-full transition-all hover:scale-110",
                                    color === c ? "ring-2 ring-primary ring-offset-1" : "ring-0"
                                )}
                                style={{ backgroundColor: c }}
                                onClick={() => {
                                    setColor(c);
                                    setShowPicker(false);
                                }}
                            />
                        ))}

                        <div className="flex items-center gap-1 ml-auto">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className={cn("h-7 w-7", showPicker && "bg-accent")}
                                onClick={() => setShowPicker(!showPicker)}
                            >
                                <Palette className="size-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={handleReset}
                            >
                                <RotateCcw className="size-4" />
                            </Button>
                        </div>
                    </div>

                    {showPicker && (
                        <div className="pt-2 border-t border-border mt-2">
                            <ColorPicker
                                value={color}
                                onChange={(val) => {
                                    if (Array.isArray(val)) {
                                        const [r, g, b, a] = val;
                                        setColor(Color.rgb(r, g, b).alpha(a).toString());
                                    }
                                }}
                                className="space-y-2"
                            >
                                <ColorPickerSelection className="h-32 rounded-md" />
                                <ColorPickerHue />
                                <ColorPickerAlpha />
                                <div className="flex items-center gap-2">
                                    <ColorPickerOutput />
                                    <ColorPickerFormat />
                                </div>
                            </ColorPicker>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2 pt-1 border-t border-border mt-2 pt-2">
                    <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" size="sm" className="h-7 text-xs">
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Delete Confirmation Popover
// ---------------------------------------------------------------------------

function DeletePopover({ nodeId, tableName, onClose }: { nodeId: string; tableName: string; onClose: () => void }) {
    const removeNode = useCanvasStore((s) => s.removeNode);

    const handleDelete = () => {
        removeNode(nodeId);
        onClose();
    };

    return (
        <div className="p-1">
            <PopoverHeader title="Delete Table" description="This action cannot be undone" />
            <div className="space-y-3">
                <p className="text-sm">
                    Are you sure you want to delete table <span className="font-semibold text-destructive">{tableName}</span>?
                </p>
                <p className="text-xs text-muted-foreground">This will also remove all connected relationships in the diagram.</p>
                <div className="flex justify-end gap-2 pt-1 border-t border-border mt-2 pt-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={handleDelete}>
                        Confirm Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// EntityActionsBox — top-right corner behind the table card (z-[-1])
// Matches ERFlow reference: right-[-35px] top-[-26px] w-[120px] h-[90px]
// ---------------------------------------------------------------------------

export function EntityActionsBox({ nodeId, data }: EntityActionsBoxProps) {
    const duplicateNode = useCanvasStore((s) => s.duplicateNode);
    const nodes = useCanvasStore((s) => s.nodes);

    const [openPopover, setOpenPopover] = useState<"column" | "notes" | "properties" | "delete" | null>(null);

    const handleDuplicate = () => {
        duplicateNode(nodeId);
    };

    return (
        <div
            className={cn(
                "nopan nodrag absolute right-[-35px] top-[-26px] z-[-1]",
                "h-[90px] w-[120px] rounded opacity-95",
                "shadow-[0_4px_15px_hsl(var(--foreground)/0.12)]",
                !data.color && "bg-primary"
            )}
            style={data.color ? { backgroundColor: data.color } : {}}
        >
            {/* ---- Top row: Notes, Duplicate, Table View, DB, Add Column ---- */}

            <Popover>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-1.5 top-[5px] size-5 rounded-full hover:bg-foreground/10 text-primary-foreground"
                            >
                                <ClipboardEdit className="size-[18px]" />
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">Notes</TooltipContent>
                </Tooltip>
                <PopoverContent side="right" align="start" className="w-80 shadow-xl border-border/50">
                    <NotesPopover nodeId={nodeId} data={data} onClose={() => { }} />
                </PopoverContent>
            </Popover>

            <BoxIconButton
                tooltip="Duplicate"
                className="absolute left-7 top-[5px]"
                icon={<Copy className="size-[18px]" />}
                onClick={handleDuplicate}
            />

            <BoxIconButton
                tooltip="Table View"
                className="absolute left-[50px] top-[5px]"
                icon={<Table2 className="size-[18px]" />}
            />

            <BoxIconButton
                tooltip="Database"
                className="absolute left-[72px] top-2"
                icon={<Database className="size-3.5" />}
            />

            {/* Add Column */}
            <Popover open={openPopover === "column"} onOpenChange={(open) => setOpenPopover(open ? "column" : null)}>
                <PopoverTrigger asChild>
                    <div className="absolute left-[92px] top-[5px]">
                        <BoxIconButton
                            tooltip="Add Column"
                            icon={<Plus className="size-[18px]" />}
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-72" side="right" align="start">
                    <AddColumnPopover nodeId={nodeId} onClose={() => setOpenPopover(null)} />
                </PopoverContent>
            </Popover>

            {/* ---- Right column: Settings, Delete ---- */}

            <Popover open={openPopover === "properties"} onOpenChange={(open) => setOpenPopover(open ? "properties" : null)}>
                <PopoverTrigger asChild>
                    <div className="absolute left-[92px] top-[30px]">
                        <BoxIconButton
                            tooltip="Properties"
                            icon={<Settings className="size-[18px]" />}
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-72" side="right" align="start">
                    <PropertiesPopover nodeId={nodeId} data={data} onClose={() => setOpenPopover(null)} />
                </PopoverContent>
            </Popover>

            <Popover open={openPopover === "delete"} onOpenChange={(open) => setOpenPopover(open ? "delete" : null)}>
                <PopoverTrigger asChild>
                    <div className="absolute left-[92px] top-[55px]">
                        <BoxIconButton
                            tooltip="Delete"
                            icon={<Trash2 className="size-[18px]" />}
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-64" side="right" align="start">
                    <DeletePopover nodeId={nodeId} tableName={data.name} onClose={() => setOpenPopover(null)} />
                </PopoverContent>
            </Popover>
        </div>
    );
}
