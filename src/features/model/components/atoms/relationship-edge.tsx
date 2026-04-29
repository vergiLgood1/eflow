import { memo } from "react";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { RelationshipEdgeData } from "@/features/model/types/canvas";

// EdgeProps (without generic) is compatible with EdgeTypes.
// We narrow `data` inside the body: semantically safe because React Flow
// always passes the correct data shape for the registered edge type.
export const RelationshipEdgeComponent = memo(({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style,
    markerEnd,
    markerStart,
    data: rawData,
}: EdgeProps) => {
    const data = rawData as RelationshipEdgeData | undefined;

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 8,
    });

    const edgeStyle = {
        ...style,
        color: style?.stroke || "currentColor",
    };

    return (
        <>
            <BaseEdge path={edgePath} markerStart={markerStart} markerEnd={markerEnd} style={edgeStyle} id={id} />
            <EdgeLabelRenderer>
                {data?.cardinality && (
                    <div
                        style={{
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        }}
                        className="nodrag nopan absolute bg-background px-1.5 py-0.5 rounded text-[10px] font-semibold border border-border text-foreground pointer-events-auto select-none"
                    >
                        {data.cardinality}
                    </div>
                )}
            </EdgeLabelRenderer>
        </>
    );
});

RelationshipEdgeComponent.displayName = "RelationshipEdge";
