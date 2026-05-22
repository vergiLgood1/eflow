import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceState {
  isChatOpen: boolean;
  isBannerVisible: boolean;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  hideBanner: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      isChatOpen: false,
      isBannerVisible: true,
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      setChatOpen: (open) => set({ isChatOpen: open }),
      hideBanner: () => set({ isBannerVisible: false }),
    }),
    {
      name: "workspace-storage",
    },
  ),
);
