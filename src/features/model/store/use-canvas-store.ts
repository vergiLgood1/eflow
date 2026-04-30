"use client "

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

export type CanvasTool =
    | "select"
    | "table"
    | "view"
    | "note"
    | "group"
    | "rel-1-1"
    | "rel-1-n"
    | "rel-0-1"
    | "rel-0-n"
    | "rel-n-n";

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
    isAnimated: boolean;
    pendingConnectionSourceId: string | null;
    dragOverGroupId: string | null;

    /** 
     * Storage for all open workspaces. 
     */
    workspaces: Record<string, { nodes: Node[]; edges: Edge[]; viewport: Viewport }>;

    /** Undo/Redo history */
    history: { nodes: Node[]; edges: Edge[] }[];
    future: { nodes: Node[]; edges: Edge[] }[];

    // ---- React Flow event handlers ----
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;

    // ---- Setters ----
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    setViewport: (viewport: Viewport) => void;
    setActiveTool: (tool: CanvasTool) => void;
    toggleAnimation: () => void;
    markSaved: () => void;
    handleNodeClick: (id: string) => void;

    undo: () => void;
    redo: () => void;
    saveToHistory: () => void;

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
    removeNodes: (ids: string[]) => void;
    updateNode: (id: string, updates: Partial<Node>) => void;
    batchUpdateNodes: (updates: Record<string, Partial<Node>>) => void;
    duplicateNode: (id: string) => void;
    setDragOverGroupId: (id: string | null) => void;
    /**
     * Saves current state into 'fromId' and loads state from 'toId'.
     * If 'toId' doesn't exist in workspaces, it initializes with empty.
     */
    swapWorkspace: (fromId: string | null, toId: string) => void;

    // ---- Settings ----
    modelSettings: ModelSettings;
    updateModelSettings: (settings: Partial<ModelSettings>) => void;

    // ---- DBML Mode ----
    isDbmlModeOpen: boolean;
    toggleDbmlMode: () => void;
}

export interface ModelSettings {
    showFkName: boolean;
    showRelType: boolean;
    idColumnType: string;
    varcharDefaultLength: number;
    decimalDefaultPrecision: number;
    decimalDefaultScale: number;
    defaultColumns: {
        id: string;
        name: string;
        type: string;
        nullable: boolean;
    }[];
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
    isAnimated: false,
    pendingConnectionSourceId: null,
    dragOverGroupId: null,
    workspaces: {},
    history: [],
    future: [],
    modelSettings: {
        showFkName: true,
        showRelType: true,
        idColumnType: "int",
        varcharDefaultLength: 255,
        decimalDefaultPrecision: 10,
        decimalDefaultScale: 2,
        defaultColumns: []
    },

    updateModelSettings: (settings) => set((state) => ({
        modelSettings: { ...state.modelSettings, ...settings }
    })),
    
    isDbmlModeOpen: false,
    toggleDbmlMode: () => set((state) => ({ isDbmlModeOpen: !state.isDbmlModeOpen })),

    onNodesChange: (changes) =>
        set({ nodes: applyNodeChanges(changes, get().nodes), isDirty: true }),

    onEdgesChange: (changes) =>
        set({ edges: applyEdgeChanges(changes, get().edges), isDirty: true }),

    onConnect: (connection) => {
        const { activeTool, edges } = get();
        let cardinality = "1:n"; // Default

        if (activeTool.startsWith("rel-")) {
            cardinality = activeTool.replace("rel-", "").replace("-", ":");
            if (cardinality === "0:1") cardinality = "0..1";
            if (cardinality === "0:n") cardinality = "0..n";
        }

        const getMarkers = (card: string) => {
            // Mapping cardinality to standard marker IDs or types
            // For now using simple logic: if it has 'n', it's 'many' (arrow), if '1' it's 'one'
            const [source, target] = card.split(":");
            return {
                markerStart: source === "n" ? "marker-many" : "marker-one",
                markerEnd: target === "n" ? "marker-many" : "marker-one",
            };
        };

        const { markerStart, markerEnd } = getMarkers(cardinality);

        set({
            edges: addEdge(
                {
                    ...connection,
                    type: "relationship",
                    data: { cardinality },
                    markerStart,
                    markerEnd,
                },
                edges
            ),
            isDirty: true,
            activeTool: "select", // Reset to select after connecting
        });
    },

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    setViewport: (v) => {
        const { viewport } = get();
        if (v.x === viewport.x && v.y === viewport.y && v.zoom === viewport.zoom) return;
        set({ viewport: v });
    },
    setActiveTool: (tool) => set({ activeTool: tool, pendingConnectionSourceId: null }),
    setDragOverGroupId: (id) => set({ dragOverGroupId: id }),
    toggleAnimation: () => set((state) => ({ isAnimated: !state.isAnimated })),
    markSaved: () => set({ isDirty: false }),

    handleNodeClick: (id) => {
        const { activeTool, pendingConnectionSourceId, edges } = get();
        
        // Only proceed if a relationship tool is active
        if (!activeTool.startsWith("rel-")) return;

        if (!pendingConnectionSourceId) {
            // First click: select source
            set({ pendingConnectionSourceId: id });
        } else {
            // Second click: select target and create edge
            if (pendingConnectionSourceId === id) return; // Can't connect to self

            let cardinality = activeTool.replace("rel-", "").replace("-", ":");
            if (cardinality === "0:1") cardinality = "0..1";
            if (cardinality === "0:n") cardinality = "0..n";

            const getMarkers = (card: string) => {
                const parts = card.includes("..") ? card.split("..") : card.split(":");
                const s = parts[0];
                const t = parts[1];
                return {
                    markerStart: (s === "n" || s === "0") ? "marker-many" : "marker-one",
                    markerEnd: (t === "n" || t === "0") ? "marker-many" : "marker-one",
                };
            };

            const { markerStart, markerEnd } = getMarkers(cardinality);

            get().saveToHistory();
            
            set({
                edges: addEdge(
                    {
                        id: crypto.randomUUID(),
                        source: pendingConnectionSourceId,
                        target: id,
                        type: "relationship",
                        data: { cardinality },
                        markerStart,
                        markerEnd,
                    },
                    edges
                ),
                pendingConnectionSourceId: null,
                activeTool: "select",
                isDirty: true
            });
        }
    },

    saveToHistory: () => {
        const { nodes, edges, history } = get();
        // Limit history to 50 steps
        const newHistory = [...history, { nodes: [...nodes], edges: [...edges] }].slice(-50);
        set({ history: newHistory, future: [] });
    },

    undo: () => {
        const { history, future, nodes, edges } = get();
        if (history.length === 0) return;

        const previous = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        set({
            nodes: previous.nodes,
            edges: previous.edges,
            history: newHistory,
            future: [{ nodes, edges }, ...future].slice(0, 50),
            isDirty: true
        });
    },

    redo: () => {
        const { history, future, nodes, edges } = get();
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        set({
            nodes: next.nodes,
            edges: next.edges,
            history: [...history, { nodes, edges }].slice(-50),
            future: newFuture,
            isDirty: true
        });
    },

    // CanvasNode extends Node so this assignment is valid without a cast.
    addNode: (node) => {
        get().saveToHistory();
        set({ nodes: [...get().nodes, node], isDirty: true });
    },

    // Spread is safe: node.data is Record<string, unknown>, incoming data
    // is the same type. No unknown or any involved.
    updateNodeData: (id, data) => {
    // No history for every keystroke? Usually better to save on blur/end
        set({
            nodes: get().nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, ...data } }
                    : node
            ),
            isDirty: true,
        });
    },

    updateNode: (id, updates) =>
        set({
            nodes: get().nodes.map((node) =>
                node.id === id ? { ...node, ...updates } : node
            ),
            isDirty: true,
        }),

    batchUpdateNodes: (updates) =>
        set({
            nodes: get().nodes.map((node) => {
                const nodeUpdates = updates[node.id];
                return nodeUpdates ? { ...node, ...nodeUpdates } : node;
            }),
            isDirty: true,
        }),

    removeNode: (id) => {
        get().saveToHistory();
        const nodes = get().nodes;
        const parent = nodes.find(n => n.id === id);
        
        set({
            nodes: nodes
                .filter((node) => node.id !== id)
                .map((node) => {
                    if (node.parentId === id && parent) {
                        return {
                            ...node,
                            parentId: undefined,
                            extent: undefined,
                            position: {
                                x: node.position.x + parent.position.x,
                                y: node.position.y + parent.position.y,
                            },
                            hidden: false // Ensure they are visible if the parent was collapsed
                        };
                    }
                    return node;
                }),
            edges: get().edges.filter(
                (edge) => edge.source !== id && edge.target !== id
            ),
            isDirty: true,
        });
    },

    removeNodes: (ids) => {
        get().saveToHistory();
        const currentNodes = get().nodes;
        
        set({
            nodes: currentNodes
                .filter((node) => !ids.includes(node.id))
                .map((node) => {
                    // If this node was a child of any removed node, unparent it
                    if (node.parentId && ids.includes(node.parentId)) {
                        const parent = currentNodes.find(n => n.id === node.parentId);
                        return {
                            ...node,
                            parentId: undefined,
                            extent: undefined,
                            position: {
                                x: node.position.x + (parent?.position.x || 0),
                                y: node.position.y + (parent?.position.y || 0),
                            },
                            hidden: false
                        };
                    }
                    return node;
                }),
            edges: get().edges.filter(
                (edge) => !ids.includes(edge.source) && !ids.includes(edge.target)
            ),
            isDirty: true,
        });
    },

    duplicateNode: (id) => {
        const node = get().nodes.find((node) => node.id === id);
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

    swapWorkspace: (fromId, toId) => {
        const { nodes, edges, viewport, workspaces } = get();

        const nextWorkspaces = { ...workspaces };

        // 1. Save current state to old workspace if it exists
        if (fromId) {
            nextWorkspaces[fromId] = { nodes, edges, viewport };
        }

        // 2. Load new state or initialize
        const target = nextWorkspaces[toId] || {
            nodes: [],
            edges: [],
            viewport: { x: 0, y: 0, zoom: 1 }
        };

        set({
            nodes: target.nodes,
            edges: target.edges,
            viewport: target.viewport,
            workspaces: nextWorkspaces,
            isDirty: false // Reset dirty state on switch
        });
    },
}));
