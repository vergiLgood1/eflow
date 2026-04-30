"use client"

import { create } from "zustand";
import { useCanvasStore } from "./use-canvas-store";

export interface WorkspaceTab {
    id: string;
    name: string;
    type: "diagram" | "dbml" | "sql";
}

interface WorkspaceState {
    tabs: WorkspaceTab[];
    activeTabId: string | null;

    // Actions
    addTab: (tab: Omit<WorkspaceTab, "id">) => void;
    closeTab: (id: string) => void;
    setActiveTab: (id: string) => void;
    renameTab: (id: string, name: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
    tabs: [
        { id: "main", name: "main", type: "diagram" },
    ],
    activeTabId: "main",

    addTab: (tab) => {
        const id = crypto.randomUUID();
        const newTab = { ...tab, id };

        const currentActiveId = get().activeTabId;

        set((state) => ({
            tabs: [...state.tabs, newTab],
            activeTabId: id,
        }));

        // Swap canvas state to the new tab
        useCanvasStore.getState().swapWorkspace(currentActiveId, id);
    },

    closeTab: (id) => {
        const { activeTabId, tabs } = get();
        const newTabs = tabs.filter((t) => t.id !== id);
        let nextActiveId = activeTabId;

        if (activeTabId === id) {
            nextActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
        }

        set({
            tabs: newTabs,
            activeTabId: nextActiveId,
        });

        // If we switched tabs as a result of closing, trigger swap
        if (nextActiveId && nextActiveId !== activeTabId) {
            useCanvasStore.getState().swapWorkspace(activeTabId, nextActiveId);
        }
    },

    setActiveTab: (id) => {
        const currentActiveId = get().activeTabId;
        if (currentActiveId === id) return;

        // 1. Trigger the data swap in canvas store
        useCanvasStore.getState().swapWorkspace(currentActiveId, id);

        // 2. Update active tab ID
        set({ activeTabId: id });
    },

    renameTab: (id, name) => {
        set((state) => ({
            tabs: state.tabs.map((t) => (t.id === id ? { ...t, name } : t)),
        }));
    },
}));
