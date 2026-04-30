"use client";

import { create } from "zustand";
import { createCanvasSlice, type CanvasSlice } from "./slices/canvas-slice";
import { createHistorySlice, type HistorySlice } from "./slices/history-slice";
import { createWorkspaceSlice, type WorkspaceSlice } from "./slices/workspace-slice";

export type CanvasStoreState = WorkspaceSlice & HistorySlice & CanvasSlice;

export const useCanvasStore = create<CanvasStoreState>()((...args) => ({
    ...createWorkspaceSlice(...args),
    ...createHistorySlice(...args),
    ...createCanvasSlice(...args),
}));
