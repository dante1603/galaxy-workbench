import React, { useState, useCallback, useEffect } from 'react';
import { useWorkbenchStore, Tool } from './state/workbenchStore';
import { getAllSpecies, getAllMaterials } from './services/dataService';
import { generateSystem } from './services/starGenerator';
import type { Sistema, EspecieInteligente, Material, Estrella, ObjetoOrbital, CuerpoEspecial, TipoCuerpoCentral } from './types';
import IconButton from './components/IconButton';
import WikiPanel from './components/wiki/WikiPanel';
import SystemGenerator from './tools/SystemGenerator';
import PlanetMapEditor from './tools/PlanetMapEditor';
import SystemGenerationModal from './components/modals/SystemGenerationModal';

// --- Icon Components ---
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const DownloadTemplatesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;

/**
 * The main application component. It serves as the root of the application,
 * managing global state, data fetching, and rendering the active tool.
 */
const App: React.FC = () => {
  // Global state from Zustand store
  const { systems, addSystem, resetSystems, activeTool } = useWorkbenchStore();

  // Local state for app-wide data and UI elements
  const [species, setSpecies] = useState<EspecieInteligente[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [isWikiOpen, setIsWikiOpen] = useState<boolean>(false);
  const [wikiTarget, setWikiTarget] = useState<{ type: string; id: string } | null>(null);
  const [selection3D, setSelection3D] = useState<Estrella | ObjetoOrbital | CuerpoEspecial | null>(null);
  const [isSysGenModalOpen, setIsSysGenModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | '3d'>('cards');

  // Fetch static data on initial component mount
  useEffect(() => {
    getAllSpecies().then(setSpecies);
    getAllMaterials().then(setMaterials);
  }, []);

  /** Displays a temporary notification message on the screen. */
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  /** Handles requests to show a specific item in the Wiki panel. */
  const handleShowInWiki = useCallback((type: string, id: string) => {
    setWikiTarget({ type, id });
    setIsWikiOpen(true);
  }, []);

  /** Handles object selection from the 3D visualizer view. */
  const handleObjectSelected = useCallback((data: Estrella | ObjetoOrbital | CuerpoEspecial) => {
    setSelection3D(data);
    setIsWikiOpen(true);
  }, []);

  /** Updates the image URL for a species (e.g., after user upload). */
  const handleUpdateSpeciesImage = useCallback((speciesId: string, imageUrl: string) => {
    setSpecies(prevSpecies =>
      prevSpecies.map(s =>
        s.id === speciesId ? { ...s, urlImagen: imageUrl } : s
      )
    );
  }, []);

  /** Clears all generated systems from the state. */
  const handleReset = useCallback(() => {
    resetSystems();
    showNotification('All systems cleared.');
  }, [resetSystems]);

  /** Copies the JSON representation of all systems to the clipboard. */
  const handleCopyJson = useCallback(() => {
    if (systems.length === 0) {
      showNotification('Nothing to copy.');
      return;
    }
    const json = JSON.stringify(systems, null, 2);
    navigator.clipboard.writeText(json)
      .then(() => showNotification('JSON copied to clipboard!'))
      .catch(() => showNotification('Failed to copy JSON.'));
  }, [systems]);

  /** Triggers a download of the JSON file containing all systems. */
  const handleDownloadJson = useCallback(() => {
    if (systems.length === 0) {
      showNotification('Nothing to download.');
      return;
    }
    const json = JSON.stringify(systems, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `galaxy_workbench_systems_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('JSON download started.');
  }, [systems]);
  
  /** Generates a new system with the given options and adds it to the state. */
  const handleCreateSystem = useCallback(async (options: { centralBody?: TipoCuerpoCentral | 'Any' }) => {
    try {
        const newSystem = await generateSystem(options);
        addSystem(newSystem);
        showNotification(`System "${newSystem.nombre}" created!`);
    } catch (error) {
        console.error("Failed to create system:", error);
        showNotification('Error: Failed to create system.');
    }
  }, [addSystem]);

  /** Triggers a download of the JSON data structure templates. */
  const handleDownloadTemplates = useCallback(async () => {
      try {
          const response = await fetch('/data/templates.json');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const templates = await response.json();
          const jsonContent = JSON.stringify(templates, null, 2);
          const blob = new Blob([jsonContent], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'galaxy_workbench_templates.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showNotification('Templates download started.');
      } catch (error) {
          console.error('Failed to download templates:', error);
          showNotification('Error: Could not download templates.');
      }
  }, []);

  /** Renders the main content area based on the currently active tool. */
  const renderActiveTool = () => {
    switch(activeTool) {
      case 'SYSTEM_GENERATOR':
        return <SystemGenerator viewMode={viewMode} onShowInWiki={handleShowInWiki} onObjectSelected3D={handleObjectSelected} />;
      case 'PLANET_MAP_EDITOR':
        return <PlanetMapEditor onShowInWiki={handleShowInWiki} />;
      default:
        return <div className="text-center text-red-500 p-8">Error: Unknown tool selected.</div>;
    }
  }

  return (
    <div className="min-h-screen bg-space-dark flex flex-col">
      <header className="sticky top-0 z-30 bg-space-dark/80 backdrop-blur-sm border-b border-space-light/50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">Galaxy Workbench</h1>
            <p className="text-sm text-accent-cyan">Multi-Tool Environment v0.5</p>
          </div>
          <div className="flex items-center space-x-4">
             {activeTool === 'SYSTEM_GENERATOR' && (
              <div className="flex items-center space-x-2 border-r border-space-light/50 pr-4">
                <IconButton onClick={() => setIsSysGenModalOpen(true)} label="Create New System">
                  <PlusIcon />
                </IconButton>
                <IconButton onClick={() => setViewMode(prev => prev === 'cards' ? '3d' : 'cards')} label={viewMode === 'cards' ? 'Switch to 3D View' : 'Switch to Card View'}>
                  {viewMode === 'cards' ? <GlobeIcon /> : <GridIcon />}
                </IconButton>
                <IconButton onClick={handleDownloadTemplates} label="Download Templates">
                  <DownloadTemplatesIcon />
                </IconButton>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <IconButton onClick={() => setIsWikiOpen(true)} label="Open Glossary">
                <BookIcon />
              </IconButton>
              <IconButton onClick={handleCopyJson} label="Copy All Systems JSON">
                <CopyIcon />
              </IconButton>
              <IconButton onClick={handleDownloadJson} label="Download All Systems JSON">
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={handleReset} label="Reset All Systems">
                <ResetIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow relative">
        {renderActiveTool()}
      </main>

      <WikiPanel 
        isOpen={isWikiOpen} 
        onClose={() => {
          setIsWikiOpen(false);
          setWikiTarget(null);
          setSelection3D(null);
        }}
        initialTarget={wikiTarget}
        selection3D={selection3D}
        allSpecies={species}
        allMaterials={materials}
        onUpdateSpeciesImage={handleUpdateSpeciesImage}
      />

      <SystemGenerationModal 
        isOpen={isSysGenModalOpen}
        onClose={() => setIsSysGenModalOpen(false)}
        onGenerate={handleCreateSystem}
      />

      {notification && (
        <div className="fixed top-24 right-4 bg-space-mid text-white px-4 py-2 rounded-md shadow-lg border border-slate-600 animate-fade-in-out z-50">
          {notification}
        </div>
      )}
      
      {/* Basic animation styles */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out forwards;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(100%); }
          10% { opacity: 1; transform: translateX(0); }
          90% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(100%); }
        }
        .highlight {
            transition: all 0.5s ease-in-out;
            box-shadow: 0 0 15px 5px #06b6d499; /* accent-cyan with transparency */
            border-color: #06b6d4;
        }
      `}</style>
    </div>
  );
};

export default App;