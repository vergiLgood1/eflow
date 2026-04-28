import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Table2, Pencil, Trash2, Link2, Database, Zap } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TableNodeData, ColumnData } from "@/features/workspace/types/canvas";
import { cn } from "@/shared/lib/utils";
import { EntityActionsBox } from "./entity-actions-box";

// --- Subcomponents ---

const NodeHandle = ({ type, position, id }: { type: "source" | "target"; position: Position; id: string }) => (
    <Handle
        type={type}
        position={position}
        id={id}
        className="w-1 h-1 bg-transparent border-0 opacity-0 transition-opacity"
    />
);

const ColumnRow = ({ column }: { column: ColumnData }) => (
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
                <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        </div>
        {/* Column-level handles for future connections */}
        <Handle type="source" position={Position.Right} id={`${column.id}-source`} className="opacity-0 w-1 h-1 right-0" />
        <Handle type="target" position={Position.Left} id={`${column.id}-target`} className="opacity-0 w-1 h-1 left-0" />
    </div>
);

const TableFooter = () => (
    <div className="w-full border-t border-border/50 bg-foreground/5 rounded-b-[6px]">
        <div className="flex h-9 items-center gap-1 px-2">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                <Link2 className="h-3 w-3 mr-1.5" /> FK
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                <Database className="h-3 w-3 mr-1.5" /> IDX
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                <Zap className="h-3 w-3 mr-1.5" /> TRG
            </Button>
        </div>
    </div>
);

// --- Main Node Component ---

// NodeProps (without generic) is compatible with NodeTypes.
// We narrow `data` inside the body: this is semantically safe because
// React Flow always passes the correct data shape for the registered node type.
export const TableNodeComponent = memo(({ id, data: rawData, selected }: NodeProps) => {
    const data = rawData as TableNodeData;

    return (
        <div
            className={cn(
                "group/node relative flex flex-col rounded-[6px] bg-card text-card-foreground text-[12px] transition-all duration-200",
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
                className="flex h-9 items-center gap-2 px-3 font-bold text-primary-foreground rounded-t-[5px] border-b border-border/40 bg-primary"
                style={data.color ? { backgroundColor: data.color } : undefined}
            >
                <span className="text-primary-foreground/90">
                    <Table2 className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 truncate">
                    {data.name}
                </span>
            </div>

            {/* Columns List */}
            <div className="flex-1 py-1 overflow-y-auto max-h-[300px]">
                {data.columns?.map((col) => (
                    <ColumnRow key={col.id} column={col} />
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
    );
});

TableNodeComponent.displayName = "TableNode";
