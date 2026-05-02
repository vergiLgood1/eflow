import { CardinalityType, RelationshipEdgeData } from "@/features/model/types/canvas";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { memo, useState } from "react";
import { useCanvasStore } from "../../store/use-canvas-store";
import { EdgeMarkerDefinitions, getCardinalityDescription, getEdgeMarkers } from "./model-edge-markers";

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
    data: rawData,
}: EdgeProps) => {
    const data = rawData as RelationshipEdgeData | undefined;
    const showRelType = useCanvasStore(s => s.modelSettings.showRelType);
    const showFkName = useCanvasStore(s => s.modelSettings.showFkName);
    const edges = useCanvasStore(s => s.edges);
    const setEdges = useCanvasStore(s => s.setEdges);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 8,
    });

    // Get crow's foot markers based on cardinality
    const cardinality = data?.cardinality || "1:n";
    const markers = getEdgeMarkers(cardinality as CardinalityType);

    const edgeStyle = {
        ...style,
        color: style?.stroke || "currentColor",
        cursor: "context-menu",
        markerStart: markers.sourceMarker ? `url(#${markers.sourceMarker})` : undefined,
        markerEnd: markers.targetMarker ? `url(#${markers.targetMarker})` : undefined,
    };

    const handleEdgeContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleChangeCardinality = (newCardinality: CardinalityType) => {
        const updatedEdges = edges.map(edge =>
            edge.id === id
                ? { ...edge, data: { ...edge.data, cardinality: newCardinality } }
                : edge
        );
        setEdges(updatedEdges);
    };

    const handleDeleteEdge = () => {
        const updatedEdges = edges.filter(e => e.id !== id);
        setEdges(updatedEdges);
    };

    return (
        <>
            <EdgeMarkerDefinitions />
            <BaseEdge
                path={edgePath}
                markerStart={edgeStyle.markerStart}
                markerEnd={edgeStyle.markerEnd}
                style={edgeStyle}
                id={id}
                onContextMenu={handleEdgeContextMenu}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    }}
                    className="nodrag nopan absolute flex flex-col items-center gap-1 pointer-events-auto select-none"
                    onContextMenu={handleEdgeContextMenu}
                >
                    {data?.cardinality && showRelType && (
                        <div
                            className="bg-background px-1.5 py-0.5 rounded text-[10px] font-semibold border border-border text-foreground shadow-sm cursor-context-menu"
                            onContextMenu={handleEdgeContextMenu}
                        >
                            {getCardinalityDescription(data.cardinality as CardinalityType)}
                        </div>
                    )}
                    {data?.fkName && showFkName && (
                        <div
                            className="bg-background/90 px-1.5 py-0.5 rounded text-[9px] font-medium border border-border/50 text-muted-foreground shadow-sm cursor-context-menu"
                            onContextMenu={handleEdgeContextMenu}
                        >
                            {data.fkName}
                        </div>
                    )}
                </div>
            </EdgeLabelRenderer>

            {/* {contextMenu && data && (
                <RelationshipEdgeContextMenu
                    edgeId={id}
                    currentCardinality={data.cardinality}
                    position={contextMenu}
                    onChangeCardinality={handleChangeCardinality}
                    onDelete={handleDeleteEdge}
                    onClose={() => setContextMenu(null)}
                />
            )} */}
        </>
    );
});

RelationshipEdgeComponent.displayName = "RelationshipEdge";
