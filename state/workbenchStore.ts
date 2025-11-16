import create from 'zustand';
import type { Sistema } from '../types';

export type Tool = 'SYSTEM_GENERATOR' | 'PLANET_MAP_EDITOR';

interface WorkbenchState {
  systems: Sistema[];
  activeTool: Tool;
  selectedSystemId: string | null;
  selectedPlanetId: string | null;

  addSystem: (system: Sistema) => void;
  resetSystems: () => void;
  
  setActiveTool: (tool: Tool) => void;
  selectPlanetForEditing: (systemId: string, planetId: string) => void;
}

export const useWorkbenchStore = create<WorkbenchState>((set) => ({
  systems: [],
  activeTool: 'SYSTEM_GENERATOR',
  selectedSystemId: null,
  selectedPlanetId: null,

  addSystem: (system) => set((state) => ({ systems: [system, ...state.systems] })),
  resetSystems: () => set({ systems: [] }),

  setActiveTool: (tool) => set({ activeTool: tool }),
  selectPlanetForEditing: (systemId, planetId) => set({
    activeTool: 'PLANET_MAP_EDITOR',
    selectedSystemId: systemId,
    selectedPlanetId: planetId,
  }),
}));
