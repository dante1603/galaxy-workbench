
import { create } from 'zustand';
import type { Sistema } from '../types';

export type Tool = 'SYSTEM_GENERATOR' | 'PLANET_MAP_EDITOR' | 'PLANET_VOXEL_LAB';
export type ViewMode = 'GALAXY' | 'SYSTEM';

interface WorkbenchState {
  systems: Sistema[];
  activeTool: Tool;
  viewMode: ViewMode;
  selectedSystemId: string | null;
  selectedPlanetId: string | null;

  addSystem: (system: Sistema) => void;
  resetSystems: () => void;
  
  setActiveTool: (tool: Tool) => void;
  setViewMode: (mode: ViewMode) => void;
  selectPlanetForEditing: (systemId: string, planetId: string) => void;
  returnToGalaxy: () => void;
}

export const useWorkbenchStore = create<WorkbenchState>((set) => ({
  systems: [],
  activeTool: 'SYSTEM_GENERATOR',
  viewMode: 'GALAXY', // Default to Galaxy view
  selectedSystemId: null,
  selectedPlanetId: null,

  addSystem: (system) => set((state) => ({ 
    systems: [system], // For now, we only keep 1 active system when drilling down from galaxy
    selectedSystemId: system.id,
    viewMode: 'SYSTEM' 
  })),
  
  resetSystems: () => set({ systems: [], viewMode: 'GALAXY', selectedSystemId: null }),

  setActiveTool: (tool) => set({ activeTool: tool }),
  setViewMode: (mode) => set({ viewMode: mode }),
  
  selectPlanetForEditing: (systemId, planetId) => set({
    activeTool: 'PLANET_MAP_EDITOR',
    selectedSystemId: systemId,
    selectedPlanetId: planetId,
  }),

  returnToGalaxy: () => set({
    viewMode: 'GALAXY',
    activeTool: 'SYSTEM_GENERATOR',
    selectedSystemId: null,
    selectedPlanetId: null
  })
}));
