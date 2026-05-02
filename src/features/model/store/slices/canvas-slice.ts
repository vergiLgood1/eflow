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
import type { StateCreator } from "zustand";
import type { CanvasNode, CanvasTool, ModelSettings } from "../../types/canvas";

export interface CanvasSlice {
  dataModelId: string | null;
  setDataModelId: (id: string) => void;
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  isDirty: boolean;
  activeTool: CanvasTool;
  isAnimated: boolean;
  pendingConnectionSourceId: string | null;
  dragOverGroupId: string | null;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setViewport: (viewport: Viewport) => void;
  setActiveTool: (tool: CanvasTool) => void;
  toggleAnimation: () => void;
  markSaved: () => void;
  handleNodeClick: (id: string) => void;

  addNode: (node: CanvasNode) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  removeNode: (id: string) => void;
  removeNodes: (ids: string[]) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  batchUpdateNodes: (updates: Record<string, Partial<Node>>) => void;
  duplicateNode: (id: string) => void;
  setDragOverGroupId: (id: string | null) => void;

  modelSettings: ModelSettings;
  updateModelSettings: (settings: Partial<ModelSettings>) => void;

  isDbmlModeOpen: boolean;
  toggleDbmlMode: () => void;

  getTableCount: () => number;
  getViewCount: () => number;
}

type HistorySnapshot = { nodes: Node[]; edges: Edge[] };

export interface HistorySlice {
  history: HistorySnapshot[];
  future: HistorySnapshot[];
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

export const createCanvasSlice: StateCreator<
  CanvasSlice & HistorySlice,
  [],
  [],
  CanvasSlice
> = (set, get) => ({
  dataModelId: null,
  setDataModelId: (id) => set({ dataModelId: id }),
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  isDirty: false,
  activeTool: "select",
  isAnimated: false,
  pendingConnectionSourceId: null,
  dragOverGroupId: null,

  modelSettings: {
    showFkName: true,
    showRelType: true,
    idColumnType: "int",
    varcharDefaultLength: 255,
    decimalDefaultPrecision: 10,
    decimalDefaultScale: 2,
    defaultColumns: [],
  },

  updateModelSettings: (settings) =>
    set((state) => ({
      modelSettings: { ...state.modelSettings, ...settings },
    })),

  isDbmlModeOpen: false,
  toggleDbmlMode: () => set((state) => ({ isDbmlModeOpen: !state.isDbmlModeOpen })),

  getTableCount: () => get().nodes.filter((node) => node.type === "table").length,
  getViewCount: () => get().nodes.filter((node) => node.type === "view").length,

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes), isDirty: true }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges), isDirty: true }),

  onConnect: (connection) => {
    const { activeTool, edges, nodes } = get();
    const { cardinality, markerStart, markerEnd } = getRelationshipConfig(activeTool);

    // Auto-create FK column if dragging from a node
    if (connection.source && connection.target) {
      const sourceNode = nodes.find(n => n.id === connection.source);
      const targetNode = nodes.find(n => n.id === connection.target);
      
      if (sourceNode && targetNode && cardinality !== "n:m") {
        const sourcePk = (sourceNode.data as any)?.columns?.find((c: any) => c.isPk);
        const sourceName = (sourceNode.data as any)?.name || "table";
        const fkName = `${sourceName.toLowerCase()}_${sourcePk?.name || 'id'}`;
        
        // Check if FK column already exists in target table
        const existingFk = (targetNode.data as any)?.columns?.find((c: any) => 
          c.name === fkName || (c.isFk && c.name.includes(sourceName.toLowerCase()))
        );

        if (!existingFk) {
          const newFkColumn = {
            id: crypto.randomUUID(),
            name: fkName,
            type: sourcePk?.type || "INT",
            nullable: cardinality.startsWith("0"),
            isPk: false,
            isFk: true,
            isUnique: cardinality === "1:1" || cardinality === "0..1",
            defaultValue: undefined,
          };

          const updatedTargetColumns = [...(targetNode.data as any)?.columns || [], newFkColumn];
          get().updateNodeData(connection.target, { columns: updatedTargetColumns });
        }
      }
    }

    set({
      isDirty: true,
      activeTool: "select",
    });

    setTimeout(() => {
      set({
        edges: addEdge(
          {
            ...connection,
            type: "relationship",
            data: { cardinality },
            markerStart,
            markerEnd,
          },
          get().edges
        ),
        isDirty: true,
      });
    }, 250);
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
    const { activeTool, pendingConnectionSourceId, edges, nodes } = get();

    if (!activeTool.startsWith("rel-")) return;

    if (!pendingConnectionSourceId) {
      set({ pendingConnectionSourceId: id });
      return;
    }

    if (pendingConnectionSourceId === id) return;

    const cardinality = getRelationshipConfig(activeTool).cardinality;
    const sourceNode = nodes.find(n => n.id === pendingConnectionSourceId);
    const targetNode = nodes.find(n => n.id === id);

    if (!sourceNode || !targetNode) return;

    // Handle n:m relationship - auto-create junction table
    if (cardinality === "n:m") {
      const sourceName = (sourceNode.data as any)?.name || "table1";
      const targetName = (targetNode.data as any)?.name || "table2";
      let junctionTableName = `${sourceName}_${targetName}_junction`;
      
      // Check if junction table name exists, add suffix if needed
      let suffix = 1;
      while (nodes.some(n => (n.data as any)?.name === junctionTableName)) {
        junctionTableName = `${sourceName}_${targetName}_junction_${suffix}`;
        suffix++;
      }
      
      const junctionId = crypto.randomUUID();
      const sourceFkName = `${sourceName.toLowerCase()}_id`;
      const targetFkName = `${targetName.toLowerCase()}_id`;
      
      // Get PK columns
      const sourcePk = (sourceNode.data as any)?.columns?.find((c: any) => c.isPk);
      const targetPk = (targetNode.data as any)?.columns?.find((c: any) => c.isPk);
      
      // Create junction table
      const junctionTable = {
        id: junctionId,
        type: "table",
        position: { 
          x: (sourceNode.position.x + targetNode.position.x) / 2, 
          y: (sourceNode.position.y + targetNode.position.y) / 2 
        },
        data: {
          name: junctionTableName,
          color: "#6b7280",
          columns: [
            { 
              id: crypto.randomUUID(), 
              name: "id", 
              type: "INT", 
              isPk: true, 
              isUnique: true, 
              isIdx: false, 
              nullable: false 
            },
            { 
              id: crypto.randomUUID(), 
              name: sourceFkName, 
              type: sourcePk?.type || "INT", 
              nullable: false, 
              isPk: false, 
              isFk: true, 
              isUnique: false, 
              isIdx: false 
            },
            { 
              id: crypto.randomUUID(), 
              name: targetFkName, 
              type: targetPk?.type || "INT", 
              nullable: false, 
              isPk: false, 
              isFk: true, 
              isUnique: false, 
              isIdx: false 
            },
          ],
        },
      };

      // Create edges: source → junction, target → junction
      const edge1 = {
        id: crypto.randomUUID(),
        source: pendingConnectionSourceId,
        target: junctionId,
        sourceHandle: `${sourcePk?.id || ""}-source`,
        targetHandle: `${junctionTable.data.columns[1].id}-target`,
        type: "relationship" as const,
        data: { cardinality: "1:n" as const, fkName: sourceFkName },
      };
      const edge2 = {
        id: crypto.randomUUID(),
        source: id,
        target: junctionId,
        sourceHandle: `${targetPk?.id || ""}-source`,
        targetHandle: `${junctionTable.data.columns[2].id}-target`,
        type: "relationship" as const,
        data: { cardinality: "1:n" as const, fkName: targetFkName },
      };

      get().saveToHistory();
      
      set({
        nodes: [...nodes, junctionTable],
        pendingConnectionSourceId: null,
        activeTool: "select",
        isDirty: true,
      });

      setTimeout(() => {
        set({
          edges: [...get().edges, edge1, edge2],
          isDirty: true,
        });
      }, 250);

      return;
    }

    // Handle non-n:m relationships - auto-create FK column in target table
    const sourcePk = (sourceNode.data as any)?.columns?.find((c: any) => c.isPk);
    const sourcePkId = sourcePk?.id || "";
    const sourceName = (sourceNode.data as any)?.name || "table";
    const fkName = `${sourceName.toLowerCase()}_${sourcePk?.name || 'id'}`;
    
    // Check if FK column already exists
    const existingFk = (targetNode.data as any)?.columns?.find((c: any) => 
      c.name === fkName || (c.isFk && c.name.includes(sourceName.toLowerCase()))
    );

    let targetFkId = existingFk?.id;
    
    // Create FK column if it doesn't exist
    if (!existingFk) {
      const newFkColumn = {
        id: crypto.randomUUID(),
        name: fkName,
        type: sourcePk?.type || "INT",
        nullable: cardinality.startsWith("0"),
        isPk: false,
        isFk: true,
        isUnique: cardinality === "1:1" || cardinality === "0..1",
        defaultValue: undefined,
      };

      // Add FK column to target table
      const updatedTargetColumns = [...(targetNode.data as any)?.columns || [], newFkColumn];
      get().updateNodeData(id, { columns: updatedTargetColumns });
      targetFkId = newFkColumn.id;
    }

    // Create edge with FK column reference
    const { cardinality: finalCardinality, markerStart, markerEnd } = getRelationshipConfig(activeTool);

    get().saveToHistory();
    set({
      pendingConnectionSourceId: null,
      activeTool: "select",
      isDirty: true,
    });

    setTimeout(() => {
      set({
        edges: addEdge({
          id: crypto.randomUUID(),
          source: pendingConnectionSourceId,
          target: id,
          sourceHandle: `${sourcePkId}-source`,
          targetHandle: `${targetFkId}-target`,
          type: "relationship",
          data: { cardinality: finalCardinality, fkName: fkName },
          markerStart,
          markerEnd,
        }, get().edges),
        isDirty: true,
      });
    }, 250);
  },

  addNode: (node) => {
    get().saveToHistory();
    set({ nodes: [...get().nodes, node], isDirty: true });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
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
    const parent = nodes.find((n) => n.id === id);

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
              hidden: false,
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
          if (node.parentId && ids.includes(node.parentId)) {
            const parent = currentNodes.find((n) => n.id === node.parentId);
            return {
              ...node,
              parentId: undefined,
              extent: undefined,
              position: {
                x: node.position.x + (parent?.position.x || 0),
                y: node.position.y + (parent?.position.y || 0),
              },
              hidden: false,
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
});

function getRelationshipConfig(activeTool: CanvasTool): {
  cardinality: string;
  markerStart: string;
  markerEnd: string;
} {
  let cardinality = "1:n";

  if (activeTool.startsWith("rel-")) {
    cardinality = activeTool.replace("rel-", "").replace("-", ":");
    if (cardinality === "0:1") cardinality = "0..1";
    if (cardinality === "0:n") cardinality = "0..n";
  }

  const parts = cardinality.includes("..") ? cardinality.split("..") : cardinality.split(":");
  const source = parts[0];
  const target = parts[1];

  const markerStart = source === "n" ? "marker-many" : source === "0" ? "marker-one" : "marker-one";
  const markerEnd = target === "n" || target === "m" ? "marker-many" : "marker-one";

  return { cardinality, markerStart, markerEnd };
}
