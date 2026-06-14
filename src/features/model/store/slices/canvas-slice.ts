import {
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type Viewport,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import type { StateCreator } from "zustand";
import type {
  CanvasNode,
  CanvasTool,
  ModelSettings,
  RelationshipEdgeData,
} from "../../types/canvas";
import type { CanvasOperation } from "../../types/canvas-operation.schema";

export type CanvasSaveStatus = "idle" | "saving" | "saved" | "error";

export interface CanvasSlice {
  dataModelId: string | null;
  setDataModelId: (id: string) => void;
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  isDirty: boolean;
  pendingOperations: CanvasOperation[];
  saveStatus: CanvasSaveStatus;
  lastSavedAt: Date | null;
  lastSaveError: string | null;
  revision: number | null;
  activeTool: CanvasTool;
  isAnimated: boolean;
  pendingConnectionSourceId: string | null;
  dragOverGroupId: string | null;
  pendingEdges: Edge[];
  flushPendingEdges: () => void;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setViewport: (viewport: Viewport) => void;
  setActiveTool: (tool: CanvasTool) => void;
  toggleAnimation: () => void;
  markSaved: () => void;
  enqueueOperation: (operation: CanvasOperation) => void;
  takePendingOperations: () => CanvasOperation[];
  restorePendingOperations: (operations: CanvasOperation[]) => void;
  markSaving: () => void;
  markSaveFailed: (
    error: string,
    operations: CanvasOperation[],
    shouldRestoreOperations?: boolean,
  ) => void;
  markOperationsSaved: (version: number) => void;
  setRevision: (version: number) => void;
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
  pendingOperations: [],
  saveStatus: "idle",
  lastSavedAt: null,
  lastSaveError: null,
  revision: null,
  activeTool: "select",
  isAnimated: false,
  pendingConnectionSourceId: null,
  dragOverGroupId: null,
  pendingEdges: [],
  flushPendingEdges: () => {
    const { pendingEdges, edges, nodes } = get();
    if (pendingEdges.length === 0) return;
    set({
      edges: [...edges, ...pendingEdges],
      pendingEdges: [],
      isDirty: true,
    });
    const relatedNodes = new Map<string, CanvasNode>();

    for (const edge of pendingEdges) {
      if (edge.type !== "relationship") continue;

      const sourceNode = nodes.find((node) => node.id === edge.source);
      const targetNode = nodes.find((node) => node.id === edge.target);

      if (sourceNode && isCanvasNode(sourceNode)) {
        relatedNodes.set(sourceNode.id, sourceNode);
      }

      if (targetNode && isCanvasNode(targetNode)) {
        relatedNodes.set(targetNode.id, targetNode);
      }
    }

    for (const node of relatedNodes.values()) {
      get().enqueueOperation({ type: "node.upsert", node });
    }

    for (const edge of pendingEdges) {
      if (edge.type === "relationship") {
        get().enqueueOperation({
          type: "edge.upsert",
          edge: {
            id: edge.id,
            type: "relationship",
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle,
            data: normalizeRelationshipEdgeData(edge.data),
          },
        });
      }
    }
  },

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
  toggleDbmlMode: () =>
    set((state) => ({ isDbmlModeOpen: !state.isDbmlModeOpen })),

  getTableCount: () =>
    get().nodes.filter((node) => node.type === "table").length,
  getViewCount: () => get().nodes.filter((node) => node.type === "view").length,

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes), isDirty: true }),

  onEdgesChange: (changes) => {
    const previousEdges = get().edges;
    const nextEdges = applyEdgeChanges(changes, previousEdges);
    const removedEdgeIds = changes
      .filter((change) => change.type === "remove")
      .map((change) => change.id);

    set({ edges: nextEdges, isDirty: true });

    for (const edgeId of removedEdgeIds) {
      get().enqueueOperation({ type: "edge.delete", edgeId });
    }
  },

  onConnect: (connection) => {
    const { activeTool, edges, nodes } = get();
    const { cardinality, markerStart, markerEnd } =
      getRelationshipConfig(activeTool);

    let finalSourceId = connection.source;
    let finalTargetId = connection.target;
    let finalSourceHandle = connection.sourceHandle;
    let finalTargetHandle = connection.targetHandle;
    let finalFkName = "";

    // Auto-create FK column if dragging from a node
    if (connection.source && connection.target) {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (sourceNode && targetNode && cardinality !== "n:m") {
        const { parent, child } = detectRelationshipDependency(
          sourceNode,
          targetNode,
        );

        finalSourceId = parent.id;
        finalTargetId = child.id;

        const parentPk = (parent.data as any)?.columns?.find(
          (c: any) => c.isPk,
        );
        const parentName = (parent.data as any)?.name || "table";
        const fkName = `${parentName.toLowerCase()}_${parentPk?.name || "id"}`;
        finalFkName = fkName;

        // Check if FK column already exists in child table
        const existingFk = (child.data as any)?.columns?.find(
          (c: any) =>
            c.name === fkName ||
            (c.isFk && c.name.includes(parentName.toLowerCase())),
        );

        let childFkId = existingFk?.id;

        if (!existingFk) {
          const newFkColumn = {
            id: crypto.randomUUID(),
            name: fkName,
            type: parentPk?.type || "INT",
            nullable: cardinality.startsWith("0"),
            isPk: false,
            isFk: true,
            isUnique: cardinality === "1:1" || cardinality === "0..1",
            defaultValue: undefined,
          };

          const updatedChildColumns = [
            ...((child.data as any)?.columns || []),
            newFkColumn,
          ];
          get().updateNodeData(child.id, { columns: updatedChildColumns });
          childFkId = newFkColumn.id;
        }

        const isGeneralHandle =
          connection.sourceHandle?.startsWith("source-") ||
          connection.sourceHandle?.startsWith("target-");

        if (isGeneralHandle) {
          finalSourceHandle = `${parentPk?.id}-source`;
          finalTargetHandle = `${childFkId}-target`;
        } else {
          if (parent.id !== connection.source) {
            finalSourceHandle =
              connection.targetHandle?.replace("-target", "-source") ?? null;
            finalTargetHandle =
              connection.sourceHandle?.replace("-source", "-target") ?? null;
          }
        }
      }
    }

    set({
      isDirty: true,
      activeTool: "select",
      pendingEdges: [
        ...get().pendingEdges,
        {
          id: crypto.randomUUID(),
          ...connection,
          source: finalSourceId,
          target: finalTargetId,
          sourceHandle: finalSourceHandle,
          targetHandle: finalTargetHandle,
          type: "relationship",
          data: { cardinality, fkName: finalFkName },
          markerStart,
          markerEnd,
        } as Edge,
      ],
    });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setViewport: (v) => {
    const { viewport } = get();
    if (v.x === viewport.x && v.y === viewport.y && v.zoom === viewport.zoom)
      return;
    set({ viewport: v });
  },
  setActiveTool: (tool) =>
    set({ activeTool: tool, pendingConnectionSourceId: null }),
  setDragOverGroupId: (id) => set({ dragOverGroupId: id }),
  toggleAnimation: () => set((state) => ({ isAnimated: !state.isAnimated })),
  markSaved: () => set({ isDirty: false }),
  enqueueOperation: (operation) =>
    set((state) => ({
      pendingOperations: [...state.pendingOperations, operation],
      saveStatus: state.saveStatus === "saving" ? "saving" : "idle",
      lastSaveError: null,
    })),
  takePendingOperations: () => {
    const operations = get().pendingOperations;
    set({ pendingOperations: [] });
    return operations;
  },
  restorePendingOperations: (operations) =>
    set((state) => ({
      pendingOperations: [...operations, ...state.pendingOperations],
    })),
  markSaving: () => set({ saveStatus: "saving", lastSaveError: null }),
  markSaveFailed: (error, operations, shouldRestoreOperations = true) =>
    set((state) => ({
      pendingOperations: shouldRestoreOperations
        ? [...operations, ...state.pendingOperations]
        : state.pendingOperations,
      saveStatus: "error",
      lastSaveError: error,
      isDirty: shouldRestoreOperations || state.pendingOperations.length > 0,
    })),
  markOperationsSaved: (version) =>
    set({
      saveStatus: "saved",
      lastSavedAt: new Date(),
      lastSaveError: null,
      revision: version,
      isDirty: get().pendingOperations.length > 0,
    }),
  setRevision: (version) => set({ revision: version }),

  handleNodeClick: (id) => {
    const { activeTool, pendingConnectionSourceId, edges, nodes } = get();

    if (!activeTool.startsWith("rel-")) return;

    if (!pendingConnectionSourceId) {
      set({ pendingConnectionSourceId: id });
      return;
    }

    if (pendingConnectionSourceId === id) return;

    const cardinality = getRelationshipConfig(activeTool).cardinality;
    const sourceNode = nodes.find((n) => n.id === pendingConnectionSourceId);
    const targetNode = nodes.find((n) => n.id === id);

    if (!sourceNode || !targetNode) return;

    // Handle n:m relationship - auto-create junction table
    if (cardinality === "n:m") {
      const sourceName = (sourceNode.data as any)?.name || "table1";
      const targetName = (targetNode.data as any)?.name || "table2";
      let junctionTableName = `${sourceName}_${targetName}_junction`;

      // Check if junction table name exists, add suffix if needed
      let suffix = 1;
      while (nodes.some((n) => (n.data as any)?.name === junctionTableName)) {
        junctionTableName = `${sourceName}_${targetName}_junction_${suffix}`;
        suffix++;
      }

      const junctionId = crypto.randomUUID();
      const sourceFkName = `${sourceName.toLowerCase()}_id`;
      const targetFkName = `${targetName.toLowerCase()}_id`;

      // Get PK columns
      const sourcePk = (sourceNode.data as any)?.columns?.find(
        (c: any) => c.isPk,
      );
      const targetPk = (targetNode.data as any)?.columns?.find(
        (c: any) => c.isPk,
      );

      // Create junction table
      const junctionTable = {
        id: junctionId,
        type: "table",
        position: {
          x: (sourceNode.position.x + targetNode.position.x) / 2,
          y: (sourceNode.position.y + targetNode.position.y) / 2,
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
              nullable: false,
            },
            {
              id: crypto.randomUUID(),
              name: sourceFkName,
              type: sourcePk?.type || "INT",
              nullable: false,
              isPk: false,
              isFk: true,
              isUnique: false,
              isIdx: false,
            },
            {
              id: crypto.randomUUID(),
              name: targetFkName,
              type: targetPk?.type || "INT",
              nullable: false,
              isPk: false,
              isFk: true,
              isUnique: false,
              isIdx: false,
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
        pendingEdges: [...get().pendingEdges, edge1 as Edge, edge2 as Edge],
        isDirty: true,
      });

      return;
    }

    // Handle non-n:m relationships - auto-create FK column in CHILD table
    const { parent, child } = detectRelationshipDependency(
      sourceNode,
      targetNode,
    );

    const parentPk = (parent.data as any)?.columns?.find((c: any) => c.isPk);
    const parentPkId = parentPk?.id || "";
    const parentName = (parent.data as any)?.name || "table";
    const fkName = `${parentName.toLowerCase()}_${parentPk?.name || "id"}`;

    // Check if FK column already exists
    const existingFk = (child.data as any)?.columns?.find(
      (c: any) =>
        c.name === fkName ||
        (c.isFk && c.name.includes(parentName.toLowerCase())),
    );

    let childFkId = existingFk?.id;

    // Create FK column if it doesn't exist
    if (!existingFk) {
      const newFkColumn = {
        id: crypto.randomUUID(),
        name: fkName,
        type: parentPk?.type || "INT",
        nullable: cardinality.startsWith("0"),
        isPk: false,
        isFk: true,
        isUnique: cardinality === "1:1" || cardinality === "0..1",
        defaultValue: undefined,
      };

      // Add FK column to child table
      const updatedChildColumns = [
        ...((child.data as any)?.columns || []),
        newFkColumn,
      ];
      get().updateNodeData(child.id, { columns: updatedChildColumns });
      childFkId = newFkColumn.id;
    }

    // Create edge with FK column reference
    const {
      cardinality: finalCardinality,
      markerStart,
      markerEnd,
    } = getRelationshipConfig(activeTool);

    get().saveToHistory();
    set({
      pendingConnectionSourceId: null,
      activeTool: "select",
      pendingEdges: [
        ...get().pendingEdges,
        {
          id: crypto.randomUUID(),
          source: parent.id,
          target: child.id,
          sourceHandle: `${parentPkId}-source`,
          targetHandle: `${childFkId}-target`,
          type: "relationship",
          data: { cardinality: finalCardinality, fkName: fkName },
          markerStart,
          markerEnd,
        } as Edge,
      ],
      isDirty: true,
    });
  },

  addNode: (node) => {
    get().saveToHistory();
    set({ nodes: [...get().nodes, node], isDirty: true });
    get().enqueueOperation({ type: "node.upsert", node });
  },

  updateNodeData: (id, data) => {
    const nextNodes = get().nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
    );
    set({
      nodes: nextNodes,
      isDirty: true,
    });
    const updatedNode = nextNodes.find((node) => node.id === id);
    if (updatedNode && isCanvasNode(updatedNode)) {
      get().enqueueOperation({ type: "node.upsert", node: updatedNode });
    }
  },

  updateNode: (id, updates) => {
    const nextNodes = get().nodes.map((node) =>
      node.id === id ? { ...node, ...updates } : node,
    );
    set({
      nodes: nextNodes,
      isDirty: true,
    });
    const updatedNode = nextNodes.find((node) => node.id === id);
    if (updatedNode && isCanvasNode(updatedNode)) {
      get().enqueueOperation({ type: "node.upsert", node: updatedNode });
    }
  },

  batchUpdateNodes: (updates) => {
    const nextNodes = get().nodes.map((node) => {
      const nodeUpdates = updates[node.id];
      return nodeUpdates ? { ...node, ...nodeUpdates } : node;
    });
    set({
      nodes: nextNodes,
      isDirty: true,
    });
    for (const node of nextNodes) {
      if (updates[node.id] && isCanvasNode(node)) {
        get().enqueueOperation({ type: "node.upsert", node });
      }
    }
  },

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
        (edge) => edge.source !== id && edge.target !== id,
      ),
      isDirty: true,
    });
    get().enqueueOperation({ type: "node.delete", nodeId: id });
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
        (edge) => !ids.includes(edge.source) && !ids.includes(edge.target),
      ),
      isDirty: true,
    });
    for (const id of ids) {
      get().enqueueOperation({ type: "node.delete", nodeId: id });
    }
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
    if (isCanvasNode(duplicated)) {
      get().enqueueOperation({ type: "node.upsert", node: duplicated });
    }
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

  const parts = cardinality.includes("..")
    ? cardinality.split("..")
    : cardinality.split(":");
  const source = parts[0];
  const target = parts[1];

  const markerStart =
    source === "n"
      ? "marker-many"
      : source === "0"
        ? "marker-one"
        : "marker-one";
  const markerEnd =
    target === "n" || target === "m" ? "marker-many" : "marker-one";

  return { cardinality, markerStart, markerEnd };
}

function isCanvasNode(node: Node): node is CanvasNode {
  return (
    node.type === "table" ||
    node.type === "view" ||
    node.type === "note" ||
    node.type === "group"
  );
}

function normalizeRelationshipEdgeData(
  data: Record<string, unknown> | undefined,
): RelationshipEdgeData {
  return {
    ...data,
    cardinality:
      typeof data?.cardinality === "string" ? data.cardinality : "1:n",
    fkName: typeof data?.fkName === "string" ? data.fkName : undefined,
    onDelete: typeof data?.onDelete === "string" ? data.onDelete : undefined,
    onUpdate: typeof data?.onUpdate === "string" ? data.onUpdate : undefined,
  } as RelationshipEdgeData;
}

/**
 * Smart detection for Parent-Child dependency based on existing columns and semantic naming,
 * rather than strictly relying on the click order.
 */
function detectRelationshipDependency(
  nodeA: Node,
  nodeB: Node,
): { parent: Node; child: Node } {
  const dataA = nodeA.data as any;
  const dataB = nodeB.data as any;
  const nameA = (dataA?.name || "").toLowerCase();
  const nameB = (dataB?.name || "").toLowerCase();

  // 1. Check existing FK columns
  const aHasFkToB = dataA?.columns?.some(
    (c: any) =>
      c.name.toLowerCase() === `${nameB}_id` ||
      c.name.toLowerCase() === `${nameB.replace(/s$/, "")}_id` ||
      (c.isFk && c.name.toLowerCase().includes(nameB)),
  );

  const bHasFkToA = dataB?.columns?.some(
    (c: any) =>
      c.name.toLowerCase() === `${nameA}_id` ||
      c.name.toLowerCase() === `${nameA.replace(/s$/, "")}_id` ||
      (c.isFk && c.name.toLowerCase().includes(nameA)),
  );

  if (aHasFkToB && !bHasFkToA) return { parent: nodeB, child: nodeA };
  if (bHasFkToA && !aHasFkToB) return { parent: nodeA, child: nodeB };

  // 2. Semantic name subsets (e.g., user vs user_profile -> user_profile is child)
  if (nameA.length > nameB.length && nameA.includes(nameB))
    return { parent: nodeB, child: nodeA };
  if (nameB.length > nameA.length && nameB.includes(nameA))
    return { parent: nodeA, child: nodeB };

  // 3. Fallback: preserve original order
  return { parent: nodeA, child: nodeB };
}
