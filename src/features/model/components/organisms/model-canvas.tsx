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
import type {
    RelationshipEdgeData,
    TableNodeData,
} from "../../types/canvas";
import { CanvasContextMenu } from "./canvas-context-menu";
import { RelationshipEdgeComponent } from "./edges/relationship-edge";
import { NoteNodeComponent } from "./nodes/note-node";
import { TableNodeComponent } from "./nodes/table-node";
import { ViewNodeComponent } from "./nodes/view-node";

const nodeTypes = {
    table: TableNodeComponent,
    view: ViewNodeComponent,
    note: NoteNodeComponent,
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
};

// ---- Component ----

interface ModelCanvasProps {
    dataModelId: string;
}

/**
 * Inner component runs inside ReactFlowProvider so we can use context hooks.
 */
function CanvasInner({ dataModelId }: ModelCanvasProps) {
    const nodes = useCanvasStore((s) => s.nodes);
    const edges = useCanvasStore((s) => s.edges);
    const onNodesChange = useCanvasStore((s) => s.onNodesChange);
    const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
    const onConnect = useCanvasStore((s) => s.onConnect);
    const setNodes = useCanvasStore((s) => s.setNodes);
    const setEdges = useCanvasStore((s) => s.setEdges);
    const addNode = useCanvasStore((s) => s.addNode);
    const activeTool = useCanvasStore((s) => s.activeTool);
    const setActiveTool = useCanvasStore((s) => s.setActiveTool);

    const { screenToFlowPosition } = useReactFlow();

    // Initialize mock data — replaced when DB loading is wired
    useEffect(() => {
        if (nodes.length === 0) {
            setNodes(INITIAL_NODES);
            setEdges(INITIAL_EDGES);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    return (
        <CanvasContextMenu>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onPaneClick={handlePaneClick}
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
    );
}

export function ModelCanvas({ dataModelId }: ModelCanvasProps) {
    return (
        <div className="w-full h-full bg-muted/5">
            <ReactFlowProvider>
                <CanvasInner dataModelId={dataModelId} />
            </ReactFlowProvider>
        </div>
    );
}
