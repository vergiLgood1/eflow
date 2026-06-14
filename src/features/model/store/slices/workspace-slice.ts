import type { StateCreator } from "zustand";
import type { Node, Edge, Viewport } from "@xyflow/react";
import type { CanvasSlice } from "./canvas-slice";

export interface WorkspaceSlice {
  workspaces: Record<
    string,
    { nodes: Node[]; edges: Edge[]; viewport: Viewport }
  >;
  swapWorkspace: (fromId: string | null, toId: string) => void;
  setWorkspaceData: (
    id: string,
    data: { nodes: Node[]; edges: Edge[] },
  ) => void;
}

export const createWorkspaceSlice: StateCreator<
  WorkspaceSlice & CanvasSlice,
  [],
  [],
  WorkspaceSlice
> = (set, get) => ({
  workspaces: {},

  swapWorkspace: (fromId, toId) => {
    const { nodes, edges, viewport, workspaces } = get();

    const nextWorkspaces = { ...workspaces };

    if (fromId) {
      nextWorkspaces[fromId] = { nodes, edges, viewport };
    }

    const target = nextWorkspaces[toId] || {
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    };

    set({
      nodes: target.nodes,
      edges: target.edges,
      viewport: target.viewport,
      workspaces: nextWorkspaces,
      isDirty: false,
      pendingOperations: [],
      saveStatus: "idle",
      lastSaveError: null,
    });
  },

  setWorkspaceData: (id, { nodes, edges }) => {
    set((state) => {
      const nextWorkspaces = {
        ...state.workspaces,
        [id]: {
          ...state.workspaces[id],
          nodes,
          edges,
          viewport: state.workspaces[id]?.viewport || { x: 0, y: 0, zoom: 1 },
        },
      };

      return {
        workspaces: nextWorkspaces,
        nodes: nodes,
        edges: edges,
        isDirty: false,
        pendingOperations: [],
        saveStatus: "idle",
        lastSaveError: null,
      };
    });
  },
});
