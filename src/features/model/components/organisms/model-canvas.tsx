"use client";

import {
    Background,
    BackgroundVariant,
    ConnectionMode,
    Controls,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
    useReactFlow,
    type Edge,
    type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";
import colors from "tailwindcss/colors";

import { useCanvasStore } from "../../store/use-canvas-store";
import { useWorkspaceStore } from "../../store/use-workspace-store";
import type {
    RelationshipEdgeData,
    TableNodeData,
} from "../../types/canvas";
import { ModelEdgeMarkers } from "../atoms/model-edge-markers";
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

// ---- Mock data (temporary — replaced once DB loading is wired) ----

const INITIAL_NODES: Node[] = [
    {
        id: "1",
        position: { x: 100, y: 100 },
        type: "table",
        data: {
            name: "users",
            color: colors.blue[500],
            columns: [
                { id: "c1", name: "id", type: "uuid", isPk: true },
                { id: "c2", name: "email", type: "varchar" },
                { id: "c3", name: "created_at", type: "timestamp" },
            ],
        } satisfies TableNodeData,
    },
    {
        id: "2",
        position: { x: 500, y: 100 },
        type: "table",
        data: {
            name: "profiles",
            color: colors.blue[500],
            columns: [
                { id: "c4", name: "id", type: "uuid", isPk: true },
                { id: "c5", name: "user_id", type: "uuid", isFk: true },
                { id: "c6", name: "bio", type: "text" },
            ],
        } satisfies TableNodeData,
    },
];

const INITIAL_EDGES: Edge[] = [
    {
        id: "e1-2",
        source: "1",
        target: "2",
        type: "relationship",
        data: { cardinality: "1:1" } satisfies RelationshipEdgeData,
    },
];

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
}

/**
 * Inner component runs inside ReactFlowProvider so we can use context hooks.
 */
function ModelCanvasInner({ dataModelId }: ModelCanvasProps) {
    const nodes = useCanvasStore((s) => s.nodes);
    const edges = useCanvasStore((s) => s.edges);
    const viewport = useCanvasStore((s) => s.viewport);
    const onNodesChange = useCanvasStore((s) => s.onNodesChange);
    const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
    const onConnect = useCanvasStore((s) => s.onConnect);
    const setNodes = useCanvasStore((s) => s.setNodes);
    const setEdges = useCanvasStore((s) => s.setEdges);
    const addNode = useCanvasStore((s) => s.addNode);
    const activeTool = useCanvasStore((s) => s.activeTool);
    const setActiveTool = useCanvasStore((s) => s.setActiveTool);
    const isAnimated = useCanvasStore((s) => s.isAnimated);

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
    const activeTabId = useWorkspaceStore((s) => s.activeTabId);

    // Sync viewport from store when the TAB changes
    useEffect(() => {
        if (activeTabId) {
            setViewport(viewport);
        }
    }, [activeTabId, setViewport, viewport]);

    // Initialize mock data if store is empty
    useEffect(() => {
        if (nodes.length === 0) {
            setNodes(INITIAL_NODES);
            setEdges(INITIAL_EDGES);
        }
    }, [nodes.length, setNodes, setEdges]);

    // Handle pane click — place node at cursor when a tool is active
    const handlePaneClick = useCallback(
        (event: React.MouseEvent) => {
            if (activeTool === "select") return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            switch (activeTool) {
                case "table":
                    addNode({
                        id: crypto.randomUUID(),
                        type: "table",
                        position,
                        data: {
                            name: "new_table",
                            color: colors.blue[500],
                            columns: [
                                { id: crypto.randomUUID(), name: "id", type: "uuid", isPk: true },
                            ],
                        },
                    });
                    break;
                case "view":
                    addNode({
                        id: crypto.randomUUID(),
                        type: "view",
                        position,
                        data: {
                            name: "new_view",
                            query: "SELECT * FROM ...;",
                        },
                    });
                    break;
                case "note":
                    addNode({
                        id: crypto.randomUUID(),
                        type: "note",
                        position,
                        data: {
                            content: "New note...\nDouble click to edit.",
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
                            description: "Logical grouping",
                        },
                    });
                    break;
            }

            // Reset to select after placing
            setActiveTool("select");
        },
        [activeTool, addNode, screenToFlowPosition, setActiveTool]
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
        (_: any, node: Node) => {
            if (node.type === 'group') return;

            const centerX = node.position.x + (node.measured?.width ?? 0) / 2;
            const centerY = node.position.y + (node.measured?.height ?? 0) / 2;

            let absCenterX = centerX;
            let absCenterY = centerY;

            if (node.parentId) {
                const parent = nodes.find(n => n.id === node.parentId);
                if (parent) {
                    absCenterX += parent.position.x;
                    absCenterY += parent.position.y;
                }
            }

            const groupNode = nodes.find(
                (n) =>
                    n.type === 'group' &&
                    n.id !== node.id &&
                    absCenterX >= n.position.x &&
                    absCenterX <= n.position.x + (n.measured?.width ?? 0) &&
                    absCenterY >= n.position.y &&
                    absCenterY <= n.position.y + (n.measured?.height ?? 0)
            );

            setDragOverGroupId(groupNode?.id ?? null);
        },
        [nodes, setDragOverGroupId]
    );

    const onNodeDragStop = useCallback(
        (_: any, node: Node) => {
            setDragOverGroupId(null); // Clear feedback
            if (node.type === 'group') return;

            // Find if dropped inside a group
            // We use the center of the node for detection
            const centerX = node.position.x + (node.measured?.width ?? 0) / 2;
            const centerY = node.position.y + (node.measured?.height ?? 0) / 2;

            // If node ALREADY has a parent, centerX/Y are relative to that parent.
            // We need absolute coordinates for comparison with all group nodes.
            let absCenterX = centerX;
            let absCenterY = centerY;

            if (node.parentId) {
                const parent = nodes.find(n => n.id === node.parentId);
                if (parent) {
                    absCenterX += parent.position.x;
                    absCenterY += parent.position.y;
                }
            }

            const groupNode = nodes.find(
                (n) =>
                    n.type === 'group' &&
                    n.id !== node.id &&
                    absCenterX >= n.position.x &&
                    absCenterX <= n.position.x + (n.measured?.width ?? 0) &&
                    absCenterY >= n.position.y &&
                    absCenterY <= n.position.y + (n.measured?.height ?? 0)
            );

            if (groupNode && node.parentId !== groupNode.id) {
                // Parented to a (new) group
                const relativeX = absCenterX - (node.measured?.width ?? 0) / 2 - groupNode.position.x;
                const relativeY = absCenterY - (node.measured?.height ?? 0) / 2 - groupNode.position.y;
                
                const isGroupCollapsed = (groupNode.data as any)?.isCollapsed || false;

                updateNode(node.id, {
                    parentId: groupNode.id,
                    position: { x: relativeX, y: relativeY },
                    hidden: isGroupCollapsed
                });
            } else if (!groupNode && node.parentId) {
                // Dragged out of group
                const parent = nodes.find(n => n.id === node.parentId);
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
        [nodes, updateNode, setDragOverGroupId]
    );

    return (
        <div className="w-full h-full bg-muted/5 relative">
            <ModelEdgeMarkers />
            <CanvasContextMenu>
                <ReactFlow
                    nodes={nodes.map(n => ({
                        ...n,
                        selected: n.id === pendingSourceId ? true : n.selected
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
                >
                    <Controls />
                    <MiniMap position="top-right" />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>
            </CanvasContextMenu>
        </div>
    );
}

export function ModelCanvas(props: ModelCanvasProps) {
    return (
        <ReactFlowProvider>
            <ModelCanvasInner {...props} />
        </ReactFlowProvider>
    );
}
