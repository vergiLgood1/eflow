import { memo, useState, useEffect } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Eye, FileCode2 } from "lucide-react";
import { ViewNodeData } from "@/features/model/types/canvas";
import { cn } from "@/shared/lib/utils";
import { useCanvasStore } from "@/features/model/store/use-canvas-store";

const NodeHandle = ({
  type,
  position,
  id,
}: {
  type: "source" | "target";
  position: Position;
  id: string;
}) => (
  <Handle
    type={type}
    position={position}
    id={id}
    className="h-1 w-1 border-0 bg-transparent opacity-0 transition-opacity"
  />
);

export const ViewNodeComponent = memo(function ViewNodeComponent({
  id,
  data: rawData,
  selected,
}: NodeProps) {
  const data = rawData as ViewNodeData;
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const [isEditing, setIsEditing] = useState(data.isEditing || false);
  const [editName, setEditName] = useState(data.name);

  useEffect(() => {
    if (data.isEditing) {
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
        "group/node bg-card text-card-foreground relative flex flex-col rounded-[6px] border text-[12px] transition-all duration-200",
        selected
          ? "border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15),0_4px_20px_hsl(var(--foreground)/0.12)]"
          : "border-border shadow-md",
      )}
      style={{ width: "240px" }}
    >
      {/* Header */}
      <div
        className="border-border/40 flex h-9 items-center gap-2 rounded-t-[5px] border-b bg-indigo-500 px-3 font-bold text-white"
        onDoubleClick={() => setIsEditing(true)}
      >
        <span className="text-white/90">
          <Eye className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1 truncate">
          {isEditing ? (
            <input
              autoFocus
              className="w-full border-none bg-transparent font-bold text-white outline-none placeholder:text-white/50"
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
      <div className="bg-foreground/5 text-muted-foreground max-h-[150px] flex-1 overflow-y-auto rounded-b-[5px] p-3 font-mono text-[10px] whitespace-pre-wrap">
        <div className="text-foreground mb-2 flex items-center gap-2 font-sans font-semibold">
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
