import {
    type Connection,
    type Edge,
    type EdgeChange,
    type Node,
    type NodeChange,
    type Viewport,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
} from "@xyflow/react";
import { create } from "zustand";
import type { CanvasNode } from "../types/canvas";

// ---------------------------------------------------------------------------
// Active tool — determines what happens on the next canvas click
// ---------------------------------------------------------------------------

export type CanvasTool = "select" | "table" | "view" | "note";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

interface CanvasState {
    /**
     * Use the base `Node` type here so that React Flow's `applyNodeChanges`
     * return value is directly assignable without any casts. Components
     * narrow to `TableNode | ViewNode | ...` via the exported type guards.
     */
    nodes: Node[];
    edges: Edge[];
    viewport: Viewport;
    isDirty: boolean;
    activeTool: CanvasTool;

    // ---- React Flow event handlers ----
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;

    // ---- Setters ----
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    setViewport: (viewport: Viewport) => void;
    setActiveTool: (tool: CanvasTool) => void;
    markSaved: () => void;

    // ---- Node mutations ----
    /** Accepts the fully-typed CanvasNode union — stored as base Node. */
    addNode: (node: CanvasNode) => void;
    /**
     * Merges a partial data object into the matching node's data bag.
     * Using `Record<string, unknown>` keeps the signature generic while
     * remaining compatible with every data interface that extends it.
     */
    updateNodeData: (id: string, data: Record<string, unknown>) => void;
    removeNode: (id: string) => void;
    duplicateNode: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useCanvasStore = create<CanvasState>((set, get) => ({
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    isDirty: false,
    activeTool: "select",

    // applyNodeChanges returns Node[] — perfectly assignable, no cast needed.
    onNodesChange: (changes) =>
        set({ nodes: applyNodeChanges(changes, get().nodes), isDirty: true }),

    // applyEdgeChanges returns Edge[] — same reasoning.
    onEdgesChange: (changes) =>
        set({ edges: applyEdgeChanges(changes, get().edges), isDirty: true }),

    // addEdge returns Edge[] — same reasoning.
    onConnect: (connection) =>
        set({ edges: addEdge(connection, get().edges), isDirty: true }),

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    setViewport: (viewport) => set({ viewport }),
    setActiveTool: (tool) => set({ activeTool: tool }),
    markSaved: () => set({ isDirty: false }),

    // CanvasNode extends Node so this assignment is valid without a cast.
    addNode: (node) => set({ nodes: [...get().nodes, node], isDirty: true }),

    // Spread is safe: node.data is Record<string, unknown>, incoming data
    // is the same type. No unknown or any involved.
    updateNodeData: (id, data) =>
        set({
            nodes: get().nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, ...data } }
                    : node
            ),
            isDirty: true,
        }),

    removeNode: (id) =>
        set({
            nodes: get().nodes.filter((node) => node.id !== id),
            edges: get().edges.filter(
                (edge) => edge.source !== id && edge.target !== id
            ),
            isDirty: true,
        }),

    duplicateNode: (id) => {
        const node = get().nodes.find((n) => n.id === id);
        if (!node) return;

        const newId = crypto.randomUUID();
        const duplicated: Node = {
            ...node,
            id: newId,
            position: { x: node.position.x + 30, y: node.position.y + 30 },
            selected: false,
        };
        set({ nodes: [...get().nodes, duplicated], isDirty: true });
    },
}));
