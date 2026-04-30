import { RelationshipEdgeData } from "@/features/model/types/canvas";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { memo } from "react";
import { useCanvasStore } from "../../store/use-canvas-store";

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
    const { showRelType, showFkName } = useCanvasStore(s => s.modelSettings);

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
                <div
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    }}
                    className="nodrag nopan absolute flex flex-col items-center gap-1 pointer-events-auto select-none"
                >
                    {data?.cardinality && showRelType && (
                        <div className="bg-background px-1.5 py-0.5 rounded text-[10px] font-semibold border border-border text-foreground shadow-sm">
                            {data.cardinality}
                        </div>
                    )}
                    {data?.fkName && showFkName && (
                        <div className="bg-background/90 px-1.5 py-0.5 rounded text-[9px] font-medium border border-border/50 text-muted-foreground shadow-sm">
                            {data.fkName}
                        </div>
                    )}
                </div>
            </EdgeLabelRenderer>
        </>
    );
});

RelationshipEdgeComponent.displayName = "RelationshipEdge";
