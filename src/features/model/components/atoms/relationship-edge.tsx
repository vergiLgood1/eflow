import {
  CardinalityType,
  isRelationshipEdge,
  RelationshipEdgeData,
} from "@/features/model/types/canvas";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";
import { memo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useCanvasStore } from "../../store/use-canvas-store";
import {
  EdgeMarkerDefinitions,
  getCardinalityDescription,
  getEdgeMarkers,
} from "./model-edge-markers";
import { RelationshipEdgeContextMenu } from "./relationship-edge-context-menu";

// EdgeProps (without generic) is compatible with EdgeTypes.
// We narrow `data` inside the body: semantically safe because React Flow
// always passes the correct data shape for the registered edge type.
export const RelationshipEdgeComponent = memo(
  ({
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
    const showRelType = useCanvasStore((s) => s.modelSettings.showRelType);
    const showFkName = useCanvasStore((s) => s.modelSettings.showFkName);
    const edges = useCanvasStore((s) => s.edges);
    const setEdges = useCanvasStore((s) => s.setEdges);
    const enqueueOperation = useCanvasStore((s) => s.enqueueOperation);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      markerStart: markers.sourceMarker
        ? `url(#${markers.sourceMarker})`
        : undefined,
      markerEnd: markers.targetMarker
        ? `url(#${markers.targetMarker})`
        : undefined,
    };

    const handleEdgeContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsMenuOpen(true);
    };

    const handleLabelClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsMenuOpen(true);
    };

    const handleChangeCardinality = (newCardinality: CardinalityType) => {
      let updatedRelationshipEdge = null;
      const updatedEdges = edges.map((edge) =>
        edge.id === id && isRelationshipEdge(edge)
          ? (updatedRelationshipEdge = {
              ...edge,
              data: { ...edge.data, cardinality: newCardinality },
            })
          : edge,
      );

      setEdges(updatedEdges);
      if (updatedRelationshipEdge) {
        enqueueOperation({ type: "edge.upsert", edge: updatedRelationshipEdge });
      }
    };

    const handleDeleteEdge = () => {
      const updatedEdges = edges.filter((e) => e.id !== id);
      setEdges(updatedEdges);
      enqueueOperation({ type: "edge.delete", edgeId: id });
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
            className="nodrag nopan pointer-events-auto absolute flex flex-col items-center gap-1 select-none"
            onContextMenu={handleEdgeContextMenu}
          >
            {data?.cardinality && showRelType && (
              <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <PopoverTrigger asChild>
                  <button
                    className="bg-background border-border text-foreground cursor-context-menu rounded border px-1.5 py-0.5 text-[10px] font-semibold shadow-sm"
                    onClick={handleLabelClick}
                    onContextMenu={handleEdgeContextMenu}
                    type="button"
                  >
                    {getCardinalityDescription(
                      data.cardinality as CardinalityType,
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="border-border/50 w-56 p-0 shadow-xl"
                  side="right"
                  align="start"
                  onClick={(e) => e.stopPropagation()}
                  onContextMenu={(e) => e.stopPropagation()}
                >
                  <RelationshipEdgeContextMenu
                    edgeId={id}
                    currentCardinality={data.cardinality as CardinalityType}
                    onChangeCardinality={handleChangeCardinality}
                    onDelete={handleDeleteEdge}
                    onClose={() => setIsMenuOpen(false)}
                  />
                </PopoverContent>
              </Popover>
            )}
            {data?.fkName && showFkName && (
              <div
                className="bg-background/90 border-border/50 text-muted-foreground cursor-context-menu rounded border px-1.5 py-0.5 text-[9px] font-medium shadow-sm"
                onContextMenu={handleEdgeContextMenu}
              >
                {data.fkName}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      </>
    );
  },
);

RelationshipEdgeComponent.displayName = "RelationshipEdge";
