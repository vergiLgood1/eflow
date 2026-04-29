import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { ColumnData, TableNodeData } from "@/features/model/types/canvas";
import { Button } from "@/shared/components/ui/button";
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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Database, Link2, Pencil, Plus, Table2, Trash2, Zap } from "lucide-react";
import { memo, useState } from "react";
import { EntityActionsBox } from "./entity-actions-box";
import { ColumnConfigPopover } from "./entity-actions-box/add-column-popover";
import { FKConfigPopover } from "./entity-actions-box/fk-config-popover";
import { IDXConfigPopover } from "./entity-actions-box/idx-config-popover";
import { TRGConfigDialog } from "./entity-actions-box/trg-config-dialog";

// --- Subcomponents ---

const NODE_POSITIONS = [
    Position.Top,
    Position.Right,
    Position.Bottom,
    Position.Left,
];

const NodeHandles = () => (
    <>
        {NODE_POSITIONS.flatMap((pos) => [
            <Handle key={`s-${pos}`} type="source" position={pos} id={`source-${pos}`} className="opacity-0 w-1 h-1" />,
            <Handle key={`t-${pos}`} type="target" position={pos} id={`target-${pos}`} className="opacity-0 w-1 h-1" />,
        ])}
    </>
);

const ActionButton = ({
    icon,
    tooltip,
    children,
    destructive,
}: {
    icon: React.ReactNode;
    tooltip: string;
    children?: React.ReactNode;
    destructive?: boolean;
}) => {
    const btn = (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "h-5 w-5",
                destructive && "hover:bg-destructive/10 hover:text-destructive"
            )}
        >
            {icon}
        </Button>
    );

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children ? (
                    <Popover>
                        <PopoverTrigger asChild>{btn}</PopoverTrigger>
                        <PopoverContent className="w-[450px] shadow-xl border-border/50" side="right" align="start">
                            {children}
                        </PopoverContent>
                    </Popover>
                ) : (
                    btn
                )}
            </TooltipTrigger>
            <TooltipContent className="text-[10px] py-1 px-2">
                {tooltip}
            </TooltipContent>
        </Tooltip>
    );
};

const ColumnRow = ({ nodeId, column }: { nodeId: string; column: ColumnData }) => {
    const { removeColumn } = useTableActions();

    return (
        <div className="group/col flex items-center gap-2 px-2.5 py-1 text-xs hover:bg-foreground/5 cursor-pointer transition">

            {/* Icon */}
            <span className="flex h-4 w-4 items-center justify-center">
                {column.isPk && <span className="text-primary text-[10px] font-bold">PK</span>}
                {column.isFk && <Link2 className="h-3 w-3 text-muted-foreground" />}
            </span>

            {/* Name */}
            <span className="flex-1 truncate text-[13px] font-medium">
                {column.name}
            </span>

            {/* Type */}
            <span className="text-[11px] text-muted-foreground font-mono group-hover/col:opacity-0 transition">
                {column.type}
            </span>

            {/* Actions */}
            <div className="absolute right-2 flex gap-1 opacity-0 group-hover/col:opacity-100 transition">
                <ActionButton icon={<Pencil className="h-3 w-3" />} tooltip="Edit column">
                    <ColumnConfigPopover nodeId={nodeId} column={column} onClose={() => { }} />
                </ActionButton>

                <ActionButton
                    icon={<Trash2 className="h-3 w-3" />}
                    tooltip="Delete column"
                    destructive
                >
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            removeColumn(nodeId, column.id);
                        }}
                    />
                </ActionButton>
            </div>

            {/* Handles */}
            <Handle type="source" position={Position.Right} id={`${column.id}-source`} className="opacity-0 w-1 h-1" />
            <Handle type="target" position={Position.Left} id={`${column.id}-target`} className="opacity-0 w-1 h-1" />
        </div>
    );
};

type FooterTab = "fk" | "idx" | "trg";

const FOOTER_TABS = [
    { id: "fk", label: "FK", icon: Link2, title: "Foreign keys" },
    { id: "idx", label: "IDX", icon: Database, title: "Indexes" },
    { id: "trg", label: "TRG", icon: Zap, title: "Triggers" },
] as const;

const TableFooter = ({ nodeId }: { nodeId: string }) => {
    const [activeTab, setActiveTab] = useState<FooterTab | null>(null);
    const [isTrgDialogOpen, setIsTrgDialogOpen] = useState(false);
    const [isFkPopoverOpen, setIsFkPopoverOpen] = useState(false);
    const [isIdxPopoverOpen, setIsIdxPopoverOpen] = useState(false);

    const activeTabData = FOOTER_TABS.find(tab => tab.id === activeTab);

    const handleTabClick = (tabId: FooterTab) => {
        setActiveTab(prev => prev === tabId ? null : tabId);
    };

    return (
        <div className="w-full border-t border-border/50 bg-foreground/5 rounded-b-[6px] flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
            {/* Tabs Header */}
            <div className="flex h-9 items-center gap-1 px-2 bg-background/5 border-b border-border/10">
                {FOOTER_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <Button
                            key={tab.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTabClick(tab.id)}
                            className={cn(
                                "h-7 px-2 text-[10px] font-bold transition-all duration-200 gap-1.5",
                                isActive
                                    ? "bg-foreground/20 text-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                            )}
                        >
                            <Icon className="h-3 w-3 opacity-80" /> {tab.label}
                        </Button>
                    );
                })}

                <div className="flex-1" />

                {activeTab && (
                    <div className="flex items-center">
                        {activeTab === "trg" ? (
                            <Dialog open={isTrgDialogOpen} onOpenChange={setIsTrgDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors animate-in fade-in zoom-in duration-200"
                                        title={`Add ${activeTabData?.label}`}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <TRGConfigDialog nodeId={nodeId} onClose={() => setIsTrgDialogOpen(false)} />
                            </Dialog>
                        ) : (
                            <Popover 
                                open={activeTab === "fk" ? isFkPopoverOpen : isIdxPopoverOpen} 
                                onOpenChange={activeTab === "fk" ? setIsFkPopoverOpen : setIsIdxPopoverOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors animate-in fade-in zoom-in duration-200"
                                        title={`Add ${activeTabData?.label}`}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] shadow-2xl border-border/50" side="top" align="end" sideOffset={10}>
                                    {activeTab === "fk" ? (
                                        <FKConfigPopover nodeId={nodeId} onClose={() => setIsFkPopoverOpen(false)} />
                                    ) : (
                                        <IDXConfigPopover nodeId={nodeId} onClose={() => setIsIdxPopoverOpen(false)} />
                                    )}
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                )}
            </div>

            {/* Collapsible Content Area (In-flow) */}
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out overflow-hidden bg-background/20",
                    activeTab
                        ? "max-h-[200px] opacity-100 border-t border-border/20"
                        : "max-h-0 opacity-0 border-t-0 pointer-events-none"
                )}
            >
                <div className="px-3 py-2.5 text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-80">
                    {activeTabData?.title}
                </div>
                <div className="px-1 pb-3">
                    <div className="px-2 py-3 text-[11px] text-muted-foreground italic border border-dashed border-border/40 rounded mx-1 bg-foreground/2">
                        No {activeTabData?.title.toLowerCase()} yet.
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Node Component ---
export const TableNodeComponent = memo(({ id, data: rawData, selected }: NodeProps) => {
    const data = rawData as TableNodeData;

    return (
        <TooltipProvider delayDuration={0}>
            <div
                className={cn(
                    "group/node relative flex flex-col w-[240px] rounded-md border bg-card text-[12px]",
                    selected
                        ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.15),0_4px_20px_hsl(var(--foreground)/0.12)]"
                        : "border-border shadow-md"
                )}
            >
                {/* Actions */}
                {selected && <EntityActionsBox nodeId={id} data={data} />}

                {/* Header */}
                <div
                    className="flex h-9 items-center gap-2 px-3 font-bold text-primary-foreground rounded-t-md border-b border-border/40 bg-primary"
                    style={data.color ? { backgroundColor: data.color } : undefined}
                >
                    <Table2 className="h-4 w-4 opacity-90" />
                    <span className="truncate">{data.name}</span>
                </div>

                {/* Columns */}
                <div className="flex-1 py-1 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-border/50">
                    {data.columns
                        ?.filter((col) => !(data.hiddenColumns as string[] || []).includes(col.id))
                        .map((col) => (
                            <ColumnRow key={col.id} nodeId={id} column={col} />
                        ))}
                </div>

                {/* Footer */}
                <TableFooter nodeId={id} />

                {/* Handles */}
                <NodeHandles />
            </div>
        </TooltipProvider>
    );
});