import { create } from 'zustand';

interface WorkspaceState {
  isChatOpen: boolean;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  isChatOpen: false,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setChatOpen: (open) => set({ isChatOpen: open }),
}));
