"use client";

import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";

import { useCanvasDebouncedSync } from "../../hooks/use-canvas-debounced-sync";
import { useCanvasStore } from "../../store/use-canvas-store";
import { useWorkspaceStore } from "../../store/use-workspace-store";
import type { GroupNodeData } from "../../types/canvas";
import { EdgeMarkerDefinitions as ModelEdgeMarkers } from "../atoms/model-edge-markers";
import { RelationshipEdgeComponent } from "../atoms/relationship-edge";
import { CanvasContextMenu } from "./canvas-context-menu";
import { GroupNodeComponent } from "./nodes/group-node";
import { NoteNodeComponent } from "./nodes/note-node";
import { TableNodeComponent } from "./nodes/table-node";
import { ViewNodeComponent } from "./nodes/view-node";

const nodeTypes = {
  table: TableNodeComponent,
  view: ViewNodeComponent,
  note: NoteNodeComponent,
  group: GroupNodeComponent,
};

const edgeTypes = {
  relationship: RelationshipEdgeComponent,
};

// Canvas starts empty — users build their schema from scratch

// ---- Cursor styles per active tool ----

const TOOL_CURSOR: Record<string, string> = {
  select: "default",
  table: "crosshair",
  view: "crosshair",
  note: "crosshair",
  group: "crosshair",
};

// ---- Component ----

interface ModelCanvasProps {
  dataModelId: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

/**
 * Inner component runs inside ReactFlowProvider so we can use context hooks.
 */
function ModelCanvasInner({
  dataModelId,
  initialNodes = [],
  initialEdges = [],
}: ModelCanvasProps) {
  const activeTabId = useWorkspaceStore((s) => s.activeTabId);
  const diagramId = `${dataModelId}-default`;

  const { setWorkspaceData, setDataModelId } = useCanvasStore();

  useEffect(() => {
    setDataModelId(dataModelId);
  }, [dataModelId, setDataModelId]);

  useEffect(() => {
    if (initialNodes.length > 0 || initialEdges.length > 0) {
      setWorkspaceData(diagramId, {
        nodes: initialNodes,
        edges: initialEdges,
      });
    }
  }, [diagramId, initialNodes, initialEdges, setWorkspaceData]);

  useCanvasDebouncedSync(dataModelId);

  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const pendingEdges = useCanvasStore((s) => s.pendingEdges);
  const flushPendingEdges = useCanvasStore((s) => s.flushPendingEdges);
  const viewport = useCanvasStore((s) => s.viewport);
  const onNodesChange = useCanvasStore((s) => s.onNodesChange);
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
  const onConnect = useCanvasStore((s) => s.onConnect);
  const addNode = useCanvasStore((s) => s.addNode);
  const activeTool = useCanvasStore((s) => s.activeTool);
  const setActiveTool = useCanvasStore((s) => s.setActiveTool);
  const isAnimated = useCanvasStore((s) => s.isAnimated);
  const getTableCount = useCanvasStore((s) => s.getTableCount);
  const getViewCount = useCanvasStore((s) => s.getViewCount);

  const { screenToFlowPosition, setViewport } = useReactFlow();

  // Map global animation state to edges
  const edgesWithAnimation = edges.map((edge) => ({
    ...edge,
    animated: isAnimated,
    style: {
      ...edge.style,
      strokeDasharray: "5,5",
    },
  }));

  const setViewportStore = useCanvasStore((s) => s.setViewport);

  // Sync viewport from store when the TAB changes
  useEffect(() => {
    if (activeTabId) {
      setViewport(viewport);
    }
  }, [activeTabId, setViewport, viewport]);

  // Flush pending edges to allow React Flow to mount handles first
  useEffect(() => {
    if (pendingEdges && pendingEdges.length > 0) {
      flushPendingEdges();
    }
  }, [pendingEdges, flushPendingEdges]);

  // Handle pane click — place node at cursor when a tool is active
  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (activeTool === "select") return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      switch (activeTool) {
        case "table": {
          const settings = useCanvasStore.getState().modelSettings;

          // Create default columns based on settings
          const defaultCols = settings.defaultColumns.map((col) => ({
            id: crypto.randomUUID(),
            name: col.name,
            type: col.type,
            nullable: col.nullable,
            isPk: false,
            isUnique: false,
            isIdx: false,
          }));

          // Complete column list starting with ID
          const columns = [
            {
              id: crypto.randomUUID(),
              name: "id",
              type: settings.idColumnType,
              isPk: true,
              isUnique: true,
              isIdx: false,
              nullable: false,
            },
            ...defaultCols,
          ];

          addNode({
            id: crypto.randomUUID(),
            type: "table",
            position,
            data: {
              name: `table_${getTableCount() + 1}`,
              color: "#3b82f6", // Default blue
              columns,
              isNew: true,
              isEditing: true,
            },
          });
          break;
        }
        case "view":
          addNode({
            id: crypto.randomUUID(),
            type: "view",
            position,
            data: {
              name: `view_${getViewCount() + 1}`,
              query: "SELECT * FROM ...;",
              isNew: true,
              isEditing: true,
            },
          });
          break;
        case "note":
          addNode({
            id: crypto.randomUUID(),
            type: "note",
            position,
            data: {
              content: "",
              isNew: true,
            },
          });
          break;
        case "group":
          addNode({
            id: crypto.randomUUID(),
            type: "group",
            position,
            style: { width: 600, height: 400, backgroundColor: "transparent" },
            data: {
              name: "New Group",
              description: "",
              isNew: true,
              isEditing: true,
            },
          });
          break;
      }

      // Reset to select after placing
      setActiveTool("select");
    },
    [
      activeTool,
      addNode,
      screenToFlowPosition,
      setActiveTool,
      getTableCount,
      getViewCount,
    ],
  );

  // Allow Escape to cancel the active tool
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeTool !== "select") {
        setActiveTool("select");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTool, setActiveTool]);

  const handleNodeClick = useCanvasStore((s) => s.handleNodeClick);
  const pendingSourceId = useCanvasStore((s) => s.pendingConnectionSourceId);
  const updateNode = useCanvasStore((s) => s.updateNode);
  const setDragOverGroupId = useCanvasStore((s) => s.setDragOverGroupId);

  const onNodeDrag = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.type === "group") return;

      const centerX = node.position.x + (node.measured?.width ?? 0) / 2;
      const centerY = node.position.y + (node.measured?.height ?? 0) / 2;

      let absCenterX = centerX;
      let absCenterY = centerY;

      if (node.parentId) {
        const parent = nodes.find((n) => n.id === node.parentId);
        if (parent) {
          absCenterX += parent.position.x;
          absCenterY += parent.position.y;
        }
      }

      const groupNode = nodes.find(
        (n) =>
          n.type === "group" &&
          n.id !== node.id &&
          absCenterX >= n.position.x &&
          absCenterX <= n.position.x + (n.measured?.width ?? 0) &&
          absCenterY >= n.position.y &&
          absCenterY <= n.position.y + (n.measured?.height ?? 0),
      );

      setDragOverGroupId(groupNode?.id ?? null);
    },
    [nodes, setDragOverGroupId],
  );

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setDragOverGroupId(null); // Clear feedback
      if (node.type === "group") return;

      // Find if dropped inside a group
      // We use the center of the node for detection
      const centerX = node.position.x + (node.measured?.width ?? 0) / 2;
      const centerY = node.position.y + (node.measured?.height ?? 0) / 2;

      // If node ALREADY has a parent, centerX/Y are relative to that parent.
      // We need absolute coordinates for comparison with all group nodes.
      let absCenterX = centerX;
      let absCenterY = centerY;

      if (node.parentId) {
        const parent = nodes.find((n) => n.id === node.parentId);
        if (parent) {
          absCenterX += parent.position.x;
          absCenterY += parent.position.y;
        }
      }

      const groupNode = nodes.find(
        (n) =>
          n.type === "group" &&
          n.id !== node.id &&
          absCenterX >= n.position.x &&
          absCenterX <= n.position.x + (n.measured?.width ?? 0) &&
          absCenterY >= n.position.y &&
          absCenterY <= n.position.y + (n.measured?.height ?? 0),
      );

      if (groupNode && node.parentId !== groupNode.id) {
        // Parented to a (new) group
        const relativeX =
          absCenterX - (node.measured?.width ?? 0) / 2 - groupNode.position.x;
        const relativeY =
          absCenterY - (node.measured?.height ?? 0) / 2 - groupNode.position.y;

        const isGroupCollapsed =
          (groupNode.data as GroupNodeData | undefined)?.isCollapsed || false;

        updateNode(node.id, {
          parentId: groupNode.id,
          position: { x: relativeX, y: relativeY },
          hidden: isGroupCollapsed,
        });
      } else if (!groupNode && node.parentId) {
        // Dragged out of group
        const parent = nodes.find((n) => n.id === node.parentId);
        if (parent) {
          const globalX = node.position.x + parent.position.x;
          const globalY = node.position.y + parent.position.y;

          updateNode(node.id, {
            parentId: undefined,
            position: { x: globalX, y: globalY },
            extent: undefined,
          });
        }
      }
    },
    [nodes, updateNode, setDragOverGroupId],
  );

  const proOptions = { hideAttribution: true };

  return (
    <div className="bg-muted/5 relative h-full w-full">
      <ModelEdgeMarkers />
      <CanvasContextMenu>
        <ReactFlow
          nodes={nodes.map((n) => ({
            ...n,
            selected: n.id === pendingSourceId ? true : n.selected,
          }))}
          edges={edgesWithAnimation}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={handlePaneClick}
          onNodeClick={(_, node) => handleNodeClick(node.id)}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onMoveEnd={(_, vp) => setViewportStore(vp)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          className="bg-dot-pattern"
          style={{ cursor: TOOL_CURSOR[activeTool] ?? "default" }}
          proOptions={proOptions}
        >
          {/* <Controls /> */}
          <MiniMap bgColor="bg-background" position="top-right" />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </CanvasContextMenu>
    </div>
  );
}

export function ModelCanvas(props: ModelCanvasProps) {
  return <ModelCanvasInner {...props} />;
}
