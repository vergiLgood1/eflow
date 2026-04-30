import { memo, useState, useEffect } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Eye, FileCode2 } from "lucide-react";
import { ViewNodeData } from "@/features/model/types/canvas";
import { cn } from "@/shared/lib/utils";
import { useCanvasStore } from "@/features/model/store/use-canvas-store";

const NodeHandle = ({ type, position, id }: { type: "source" | "target"; position: Position; id: string }) => (
    <Handle
        type={type}
        position={position}
        id={id}
        className="w-1 h-1 bg-transparent border-0 opacity-0 transition-opacity"
    />
);

export const ViewNodeComponent = memo(({ id, data: rawData, selected }: NodeProps) => {
    const data = rawData as ViewNodeData;
    const updateNodeData = useCanvasStore((s) => s.updateNodeData);
    const [isEditing, setIsEditing] = useState(data.isEditing || false);
    const [editName, setEditName] = useState(data.name);

    // Auto-focus logic for new views
    useEffect(() => {
        if (data.isEditing) {
            setIsEditing(true);
            // Clear the flag after picking it up
            updateNodeData(id, { isEditing: false, isNew: false });
        }
    }, [data.isEditing, id, updateNodeData]);

    const handleSave = () => {
        setIsEditing(false);
        if (editName.trim() && editName !== data.name) {
            updateNodeData(id, { name: editName.trim() });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") {
            setIsEditing(false);
            setEditName(data.name);
        }
    };

    return (
        <div 
            className={cn(
                "group/node relative flex flex-col rounded-[6px] bg-card text-card-foreground text-[12px] transition-all duration-200 border",
                selected ? "border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15),0_4px_20px_hsl(var(--foreground)/0.12)]" : "border-border shadow-md"
            )}
            style={{ width: "240px" }}
        >
            {/* Header */}
            <div 
                className="flex h-9 items-center gap-2 px-3 font-bold text-white rounded-t-[5px] border-b border-border/40 bg-indigo-500"
                onDoubleClick={() => setIsEditing(true)}
            >
                <span className="text-white/90">
                    <Eye className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 truncate">
                    {isEditing ? (
                        <input
                            autoFocus
                            className="bg-transparent border-none outline-none text-white placeholder:text-white/50 w-full font-bold"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span className="truncate">{data.name}</span>
                    )}
                </div>
            </div>

            {/* Content Preview */}
            <div className="flex-1 p-3 overflow-y-auto max-h-[150px] bg-foreground/5 text-muted-foreground font-mono text-[10px] whitespace-pre-wrap rounded-b-[5px]">
                <div className="flex items-center gap-2 mb-2 text-foreground font-sans font-semibold">
                    <FileCode2 className="h-3 w-3" /> SQL Query
                </div>
                {data.query}
            </div>

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

ViewNodeComponent.displayName = "ViewNode";
