import type { StateCreator } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import type { CanvasSlice } from "./canvas-slice";

export type HistorySnapshot = { nodes: Node[]; edges: Edge[] };

export interface HistorySlice {
  history: HistorySnapshot[];
  future: HistorySnapshot[];
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

export const createHistorySlice: StateCreator<
  HistorySlice & CanvasSlice,
  [],
  [],
  HistorySlice
> = (set, get) => ({
  history: [],
  future: [],

  saveToHistory: () => {
    const { nodes, edges, history } = get();
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
      isDirty: true,
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
      isDirty: true,
    });
  },
});
