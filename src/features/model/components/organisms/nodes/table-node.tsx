import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { ColumnData, TableNodeData } from "@/features/model/types/canvas";
import { Button } from "@/shared/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";
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

// --- Subcomponents ---

const NodeHandle = ({ type, position, id }: { type: "source" | "target"; position: Position; id: string }) => (
    <Handle
        type={type}
        position={position}
        id={id}
        className="w-1 h-1 bg-transparent border-0 opacity-0 transition-opacity"
    />
);

const ColumnRow = ({ nodeId, column }: { nodeId: string; column: ColumnData }) => {
    const { removeColumn } = useTableActions();

    return (
        <div className="group/col flex w-full items-center gap-1 px-2.5 py-1 text-left text-xs outline-none transition-all duration-150 hover:bg-foreground/5 cursor-pointer">
            <span className="flex h-4 w-4 items-center justify-center opacity-90">
                {column.isPk && <span className="text-primary font-bold text-[10px]">PK</span>}
                {column.isFk && <Link2 className="h-3 w-3 text-muted-foreground" />}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium tracking-wide text-foreground">
                {column.name}
            </span>
            <div className="ml-auto relative flex h-5 items-center justify-end">
                <div className="flex items-center gap-1 transition-opacity opacity-100 group-hover/col:opacity-0">
                    <span className="min-w-[44px] text-right text-[11px] text-muted-foreground font-mono">
                        {column.type}
                    </span>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center gap-1 transition-opacity opacity-0 pointer-events-none group-hover/col:opacity-100 group-hover/col:pointer-events-auto">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-5 w-5">
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[450px] shadow-xl border-border/50" side="right" align="start">
                                        <ColumnConfigPopover
                                            nodeId={nodeId}
                                            column={column}
                                            onClose={() => { }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-[10px] py-1 px-2">Edit column</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeColumn(nodeId, column.id);
                                }}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-[10px] py-1 px-2">Delete column</TooltipContent>
                    </Tooltip>
                </div>
            </div>
            {/* Column-level handles for future connections */}
            <Handle type="source" position={Position.Right} id={`${column.id}-source`} className="opacity-0 w-1 h-1 right-0" />
            <Handle type="target" position={Position.Left} id={`${column.id}-target`} className="opacity-0 w-1 h-1 left-0" />
        </div>
    );
};

type FooterTab = "fk" | "idx" | "trg";

const FOOTER_TABS = [
    { id: "fk", label: "FK", icon: Link2, title: "Foreign keys" },
    { id: "idx", label: "IDX", icon: Database, title: "Indexes" },
    { id: "trg", label: "TRG", icon: Zap, title: "Triggers" },
] as const;

const TableFooter = () => {
    const [activeTab, setActiveTab] = useState<FooterTab | null>(null);
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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors animate-in fade-in zoom-in duration-200"
                        title={`Add ${activeTabData?.label}`}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
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

// NodeProps (without generic) is compatible with NodeTypes.
// We narrow `data` inside the body: this is semantically safe because
// React Flow always passes the correct data shape for the registered node type.
export const TableNodeComponent = memo(({ id, data: rawData, selected }: NodeProps) => {
    const data = rawData as TableNodeData;

    return (
        <TooltipProvider delayDuration={0}>
            <div
                className={cn(
                    "group/node relative flex flex-col rounded-[6px] bg-card text-card-foreground text-[12px] transition-all",
                    selected ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.15),0_4px_20px_hsl(var(--foreground)/0.12)]" : "border-border shadow-md"
                )}
                style={{
                    width: "240px",
                    borderWidth: "1px",
                    borderStyle: "solid",
                }}
            >
                {/* Entity actions box — sits behind table (z-index: -1), visible portion sticks out to the right/top */}
                {selected && <EntityActionsBox nodeId={id} data={data} />}

                {/* Header */}
                <div
                    className={cn(
                        "flex h-9 items-center gap-2 px-3 font-bold text-primary-foreground rounded-t-[5px] border-b border-border/40 bg-primary transition-all duration-300 ease-in-out"
                    )}
                    style={data.color ? { backgroundColor: data.color } : undefined}
                >
                    <span className="text-primary-foreground/90">
                        <Table2 className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate tracking-tight">
                        {data.name}
                    </span>
                </div>

                {/* Columns List */}
                <div className="flex-1 py-1 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-border/50">
                    {data.columns?.map((col) => (
                        <ColumnRow key={col.id} nodeId={id} column={col} />
                    ))}
                </div>

                {/* Footer */}
                <TableFooter />

                {/* Handles */}
                <NodeHandle type="source" position={Position.Top} id="source-top" />
                <NodeHandle type="target" position={Position.Top} id="target-top" />
                <NodeHandle type="source" position={Position.Right} id="source-right" />
                <NodeHandle type="target" position={Position.Right} id="target-right" />
                <NodeHandle type="source" position={Position.Bottom} id="source-bottom" />
                <NodeHandle type="target" position={Position.Bottom} id="target-bottom" />
                <NodeHandle type="source" position={Position.Left} id="source-left" />
                <NodeHandle type="target" position={Position.Left} id="target-left" />
            </div>
        </TooltipProvider>
    );
});

TableNodeComponent.displayName = "TableNode";

