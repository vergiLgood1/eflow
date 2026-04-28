import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { NoteNodeData } from "@/features/model/types/canvas";
import { cn } from "@/shared/lib/utils";

export const NoteNodeComponent = memo(({ data: rawData, selected }: NodeProps) => {
    const data = rawData as NoteNodeData;

    return (
        <div
            className={cn(
                "relative flex flex-col rounded p-3 text-sm shadow-md transition-all duration-200 min-h-[100px] min-w-[150px]",
                selected ? "ring-2 ring-primary ring-offset-2" : "",
                data.color ?? "bg-yellow-100 text-yellow-900"
            )}
            style={{
                fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif",
            }}
        >
            <div className="whitespace-pre-wrap">{data.content}</div>
        </div>
    );
});

NoteNodeComponent.displayName = "NoteNode";
