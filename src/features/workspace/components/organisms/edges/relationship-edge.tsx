import { memo } from "react";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { RelationshipEdgeData } from "@/features/workspace/types/canvas";

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

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} id={id} />
            <EdgeLabelRenderer>
                {data?.cardinality && (
                    <div
                        style={{
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            background: "hsl(var(--background))",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: 600,
                            border: "1px solid hsl(var(--border))",
                            color: "hsl(var(--foreground))",
                            pointerEvents: "all",
                        }}
                        className="nodrag nopan"
                    >
                        {data.cardinality}
                    </div>
                )}
            </EdgeLabelRenderer>
        </>
    );
});

RelationshipEdgeComponent.displayName = "RelationshipEdge";
