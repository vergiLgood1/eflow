"use client";

import {
    addEdge,
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    ReactFlow,
    useEdgesState,
    useNodesState,
    type Connection
} from "@xyflow/react";
import { useCallback } from "react";

import "@xyflow/react/dist/style.css";

const initialNodes = [
    {
        id: "1",
        position: { x: 100, y: 100 },
        data: { label: "Table: users" },
        type: "default",
    },
    {
        id: "2",
        position: { x: 400, y: 100 },
        data: { label: "Table: profiles" },
        type: "default",
    },
];

const initialEdges = [
    { id: "e1-2", source: "1", target: "2", label: "1:1 relationship" },
];

export function WorkspaceModelCanvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div className="w-full h-full bg-muted/5">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                className="bg-dot-pattern"


            >
                <Controls />
                <MiniMap position="top-right" />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
