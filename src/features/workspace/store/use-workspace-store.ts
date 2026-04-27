import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PinnedDiagram {
  id: string;
  name: string;
  slug: string;
}

interface WorkspaceState {
  isChatOpen: boolean;
  isBannerVisible: boolean;
  pinnedDiagrams: PinnedDiagram[];
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  hideBanner: () => void;
  togglePin: (diagram: PinnedDiagram) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      isChatOpen: false,
      isBannerVisible: true,
      pinnedDiagrams: [],
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      setChatOpen: (open) => set({ isChatOpen: open }),
      hideBanner: () => set({ isBannerVisible: false }),
      togglePin: (diagram) => set((state) => {
        const isPinned = state.pinnedDiagrams.some(d => d.id === diagram.id);
        if (isPinned) {
          return { pinnedDiagrams: state.pinnedDiagrams.filter(d => d.id !== diagram.id) };
        } else {
          return { pinnedDiagrams: [...state.pinnedDiagrams, diagram] };
        }
      }),
    }),
    {
      name: 'workspace-storage',
    }
  )
);
