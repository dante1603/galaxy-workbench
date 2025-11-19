
import React, { useState, useCallback } from 'react';
import { useWorkbenchStore } from './state/workbenchStore';
import { generateSystem } from './services/starGenerator';
import type { Estrella, ObjetoOrbital, CuerpoEspecial, TipoCuerpoCentral } from './types';
import { StaticDataProvider } from './context/StaticDataContext';

import WikiPanel from './components/WikiPanel';
import SystemGenerator from './tools/SystemGenerator';
import PlanetMapEditor from './tools/PlanetMapEditor';
import PlanetVoxelLab from './tools/PlanetVoxelLab';
import SystemGenerationModal from './components/modals/SystemGenerationModal';
import GeminiConsole from './components/GeminiConsole';
import WorkbenchHeader from './components/layout/WorkbenchHeader';

/**
 * The main application component.
 * Refactored to use Context for static data.
 */
const App: React.FC = () => {
  // Global state from Zustand store
  const { systems, addSystem, activeTool, viewMode: globalViewMode, selectedSystemId, setActiveTool } = useWorkbenchStore();

  // Local state for UI elements
  const [notification, setNotification] = useState<string | null>(null);
  const [isWikiOpen, setIsWikiOpen] = useState<boolean>(false);
  const [wikiTarget, setWikiTarget] = useState<{ type: string; id: string } | null>(null);
  const [selection3D, setSelection3D] = useState<Estrella | ObjetoOrbital | CuerpoEspecial | null>(null);
  const [isSysGenModalOpen, setIsSysGenModalOpen] = useState(false);
  const [terminalMessage, setTerminalMessage] = useState<string | null>(null);
  
  // View mode for SystemGenerator (Cards vs 3D)
  const [viewModeLocal, setViewModeLocal] = useState<'cards' | '3d'>('3d');

  /** Displays a temporary notification message on the screen. */
  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  /** Handles requests to show a specific item in the Wiki panel. */
  const handleShowInWiki = useCallback((type: string, id: string) => {
    setSelection3D(null); // Clear any 3D selection to prioritize the target
    setWikiTarget({ type, id });
    setIsWikiOpen(true);
  }, []);

  /** Handles object selection from the 3D visualizer view. */
  const handleObjectSelected = useCallback((data: Estrella | ObjetoOrbital | CuerpoEspecial) => {
    setWikiTarget(null); 
    setSelection3D(data);
  }, []);
  
  /** Handles notification when the galaxy visualizer completes a hyperjump */
  const handleGalaxyHyperjump = useCallback(() => {
      const sectorCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      const subSector = Math.floor(Math.random() * 99);
      setTerminalMessage(`[HYPERDRIVE] Jump Complete. Entered Sector ${sectorCode}-${subSector}.`);
  }, []);
  
  /** Generates a new system with the given options and adds it to the state. */
  const handleCreateSystem = useCallback(async (options: { centralBody?: TipoCuerpoCentral | 'Any' }) => {
    try {
        const newSystem = await generateSystem(options);
        addSystem(newSystem);
        // Switch tool to Generator and view to Cards immediately
        setActiveTool('SYSTEM_GENERATOR');
        setViewModeLocal('cards');
        showNotification(`System "${newSystem.nombre}" created!`);
    } catch (error) {
        console.error("Failed to create system:", error);
        showNotification('Error: Failed to create system.');
    }
  }, [addSystem, showNotification, setActiveTool]);

  /** Renders the main content area based on the currently active tool. */
  const renderActiveTool = () => {
    switch(activeTool) {
      case 'SYSTEM_GENERATOR':
        return <SystemGenerator 
                viewMode={viewModeLocal} 
                onShowInWiki={handleShowInWiki} 
                onObjectSelected3D={handleObjectSelected}
                onGalaxyHyperjump={handleGalaxyHyperjump}
                isPaused={isWikiOpen}
               />;
      case 'PLANET_MAP_EDITOR':
        return <PlanetMapEditor 
                  onShowInWiki={handleShowInWiki} 
                />;
      case 'PLANET_VOXEL_LAB':
        return <PlanetVoxelLab isPaused={isWikiOpen} />;
      default:
        return <div className="text-center text-red-500 p-8">Error: Unknown tool selected.</div>;
    }
  }

  // Get current active system for console
  const currentSystem = systems.find(s => s.id === selectedSystemId) || (systems.length > 0 ? systems[0] : undefined);

  return (
    <StaticDataProvider>
      <div className="relative w-screen h-screen overflow-hidden bg-black font-sans text-slate-200 selection:bg-accent-cyan/30 selection:text-white">
        
        {/* --- LAYER 0: THE VIEWPORT (Background/Canvas) --- */}
        <div className="absolute inset-0">
          {renderActiveTool()}
        </div>

        {/* --- LAYER 1: HEADER (Always Top) --- */}
        <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
           <WorkbenchHeader 
              onOpenWiki={() => setIsWikiOpen(true)}
              onShowNotification={showNotification}
              viewModeLocal={viewModeLocal}
              setViewModeLocal={setViewModeLocal}
              onOpenSysGenModal={() => setIsSysGenModalOpen(true)}
          />
        </div>

        {/* --- LAYER 2: FOOTER (Console) --- */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none flex flex-col justify-end">
          <footer className="pointer-events-auto mx-4 mb-4 rounded-lg overflow-hidden border border-accent-cyan/20 h-32 shadow-2xl bg-black/90 backdrop-blur">
              <GeminiConsole 
                globalViewMode={globalViewMode} 
                system={currentSystem}
                selection={selection3D}
                customMessage={terminalMessage}
              />
          </footer>
        </div>

        {/* --- LAYER 3: MODALS & PANELS (Highest Z-Index) --- */}
        <WikiPanel 
          isOpen={isWikiOpen} 
          onClose={() => {
            setIsWikiOpen(false);
            setWikiTarget(null);
            setSelection3D(null);
          }}
          initialTarget={wikiTarget}
          selection3D={selection3D}
        />

        <SystemGenerationModal 
          isOpen={isSysGenModalOpen}
          onClose={() => setIsSysGenModalOpen(false)}
          onGenerate={handleCreateSystem}
        />

        {notification && (
          <div className="fixed top-24 right-4 bg-slate-900/90 text-accent-cyan px-4 py-2 rounded border border-accent-cyan/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-fade-in-out z-[60] font-mono text-sm backdrop-blur-sm">
            [ALERT]: {notification}
          </div>
        )}
        
        <style>{`
          .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in-out { animation: fadeInOut 3s ease-in-out forwards; }
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateX(100%); }
            10% { opacity: 1; transform: translateX(0); }
            90% { opacity: 1; transform: translateX(0); }
            100% { opacity: 0; transform: translateX(100%); }
          }
          .highlight { transition: all 0.5s ease-in-out; box-shadow: 0 0 15px 5px #06b6d499; border-color: #06b6d4; }
          
          /* Custom Scrollbar */
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); }
          ::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.3); border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.6); }

          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </StaticDataProvider>
  );
};

export default App;
