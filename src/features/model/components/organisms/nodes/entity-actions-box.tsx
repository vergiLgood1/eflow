"use client";

import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { TableNodeData } from "@/features/model/types/canvas";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
    Dialog,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
    TooltipProvider
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import {
    BookCopy,
    ClipboardEdit,
    Copy,
    CopyPlusIcon,
    Database,
    Plus,
    Settings,
    Table2,
    Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { BoxIconButton } from "../../atoms/box-icon-button";
import { ColumnConfigPopover } from "./entity-actions-box/add-column-popover";
import { DeletePopover } from "./entity-actions-box/delete-popover";
import { InsertDataDialog } from "./entity-actions-box/insert-data-dialog";
import { NotesPopover } from "./entity-actions-box/notes-popover";
import { PropertiesPopover } from "./entity-actions-box/properties-popover";



interface EntityActionsBoxProps {
    nodeId: string;
    data: TableNodeData;
}

export function EntityActionsBox({ nodeId, data }: EntityActionsBoxProps) {
    const { duplicateTable, copyInsertSql } = useTableActions();
    const [openPopover, setOpenPopover] = useState<"column" | "notes" | "properties" | "delete" | null>(null);
    const [isInsertDialogOpen, setIsInsertDialogOpen] = useState(false);

    const handleDuplicate = () => {
        duplicateTable(nodeId);
    };

    const handleCopyInsert = () => {
        copyInsertSql(nodeId);
    };

    return (
        <TooltipProvider delayDuration={0}>
            <div
                className={cn(
                    "nopan nodrag absolute right-[-35px] top-[-26px] z-[-1]",
                    "h-[90px] w-[120px] rounded opacity-95",
                    "shadow-[0_4px_15px_hsl(var(--foreground)/0.12)]",
                    "transition-all duration-300 ease-in-out",
                    !data.color && "bg-primary"
                )}
                style={data.color ? { backgroundColor: data.color } : {}}
            >
                {/* Notes */}
                <Popover open={openPopover === "notes"} onOpenChange={(open) => setOpenPopover(open ? "notes" : null)}>
                    <PopoverTrigger asChild>
                        <BoxIconButton
                            tooltip="Notes"
                            icon={<ClipboardEdit className="size-[18px]" />}
                            className="absolute left-1.5 top-[5px] size-5 rounded-full hover:bg-foreground/10"
                        />
                    </PopoverTrigger>
                    <PopoverContent side="right" align="start" className="w-[460px] shadow-xl border-border/50">
                        <NotesPopover nodeId={nodeId} data={data} onClose={() => setOpenPopover(null)} />
                    </PopoverContent>
                </Popover>

                <BoxIconButton
                    tooltip="Duplicate"
                    className="absolute left-7 top-[5px]"
                    icon={<Copy className="size-[18px]" />}
                    onClick={handleDuplicate}
                />

                <BoxIconButton
                    tooltip="Copy Insert"
                    className="absolute left-[50px] top-[5px]"
                    icon={<CopyPlusIcon className="size-[18px]" />}
                    onClick={handleCopyInsert}
                />

                {/* Insert Data */}
                <Dialog open={isInsertDialogOpen} onOpenChange={setIsInsertDialogOpen}>
                    <DialogTrigger asChild>
                        <BoxIconButton
                            tooltip="Insert Data"
                            className="absolute left-[72px] top-2"
                            icon={<Database className="size-3.5" />}
                        />
                    </DialogTrigger>
                    <InsertDataDialog nodeId={nodeId} data={data} onClose={() => setIsInsertDialogOpen(false)} />
                </Dialog>

                {/* Add Column */}
                <Popover open={openPopover === "column"} onOpenChange={(open) => setOpenPopover(open ? "column" : null)}>
                    <PopoverTrigger asChild>
                        <BoxIconButton
                            tooltip="Add Column"
                            icon={<Plus className="size-[18px]" />}
                            className="absolute left-[92px] top-[5px]"
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-[450px] shadow-xl border-border/50" side="right" align="start">
                        <ColumnConfigPopover nodeId={nodeId} onClose={() => setOpenPopover(null)} />
                    </PopoverContent>
                </Popover>

                {/* Properties */}
                <Popover open={openPopover === "properties"} onOpenChange={(open) => setOpenPopover(open ? "properties" : null)}>
                    <PopoverTrigger asChild>
                        <BoxIconButton
                            tooltip="Properties"
                            icon={<Settings className="size-[18px]" />}
                            className="absolute left-[92px] top-[30px]"
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-72 shadow-xl border-border/50" side="right" align="start">
                        <PropertiesPopover nodeId={nodeId} data={data} onClose={() => setOpenPopover(null)} />
                    </PopoverContent>
                </Popover>

                {/* Delete */}
                <Popover open={openPopover === "delete"} onOpenChange={(open) => setOpenPopover(open ? "delete" : null)}>
                    <PopoverTrigger asChild>
                        <BoxIconButton
                            tooltip="Delete"
                            icon={<Trash2 className="size-[18px]" />}
                            className="absolute left-[92px] top-[55px]"
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 shadow-xl border-border/50" side="right" align="start">
                        <DeletePopover nodeId={nodeId} tableName={data.name} onClose={() => setOpenPopover(null)} />
                    </PopoverContent>
                </Popover>
            </div>
        </TooltipProvider>
    );
}
