import { create } from 'zustand';
import type { ServiceNodeData } from '../types';

interface NodeDataMap {
  [nodeId: string]: Partial<ServiceNodeData>;
}

interface AppStore {
  // Server-state selectors
  selectedAppId: string;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: 'Config' | 'Runtime';
  simulateError: boolean;

  // Local node edits (persisted across refetches)
  nodeEdits: NodeDataMap;

  // Actions
  setSelectedAppId: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setMobilePanelOpen: (open: boolean) => void;
  toggleMobilePanel: () => void;
  setActiveInspectorTab: (tab: 'Config' | 'Runtime') => void;
  toggleSimulateError: () => void;
  updateNodeData: (id: string, data: Partial<ServiceNodeData>) => void;
  clearNodeEdits: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  selectedAppId: 'app-1',
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'Config',
  simulateError: false,
  nodeEdits: {},

  setSelectedAppId: (id) =>
    set({ selectedAppId: id, selectedNodeId: null, nodeEdits: {} }),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  setMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),

  toggleMobilePanel: () =>
    set((s) => ({ isMobilePanelOpen: !s.isMobilePanelOpen })),

  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),

  toggleSimulateError: () =>
    set((s) => ({ simulateError: !s.simulateError })),

  updateNodeData: (id, data) =>
    set((s) => ({
      nodeEdits: {
        ...s.nodeEdits,
        [id]: { ...s.nodeEdits[id], ...data },
      },
    })),

  clearNodeEdits: () => set({ nodeEdits: {} }),
}));
