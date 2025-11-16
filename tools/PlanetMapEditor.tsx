import React from 'react';
import { useWorkbenchStore } from '../state/workbenchStore';

interface PlanetMapEditorProps {
  onShowInWiki: (type: string, id: string) => void;
}

/**
 * A tool for editing the map of a selected planet.
 * This component is currently a placeholder and its functionality will be
 * implemented in a future development phase.
 */
const PlanetMapEditor: React.FC<PlanetMapEditorProps> = ({ onShowInWiki }) => {
  const { systems, selectedPlanetId, setActiveTool } = useWorkbenchStore();

  // Find the selected planet from the global systems state.
  const selectedPlanet = systems
    .flatMap(s => s.orbitas.flatMap(o => o.objetos))
    .find(obj => obj.id === selectedPlanetId);

  return (
    <div className="container mx-auto p-8 text-white">
      <div className="bg-space-mid p-6 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Planet Map Editor</h2>
          <button
            onClick={() => setActiveTool('SYSTEM_GENERATOR')}
            className="text-sm text-accent-cyan hover:text-white"
          >
            ← Back to System Generator
          </button>
        </div>
        
        {selectedPlanet && selectedPlanet.tipo === 'PLANETA' ? (
          <div>
            <p className="text-lg">Editing: <span className="font-bold text-accent-amber">{selectedPlanet.cargaUtil.tituloTipoPlaneta}</span></p>
            <p className="text-slate-400">ID: {selectedPlanetId}</p>

            {/* TODO: Implement the Planet Map Editor UI.
              This will likely involve:
              - A 2D or 3D view of the planet's surface.
              - Tools to paint/modify biomes.
              - Controls for adjusting planetary parameters (temperature, humidity, etc.).
              - A way to save changes back to the planet's state.
            */}
            <div className="mt-8 h-96 bg-space-dark rounded-md flex items-center justify-center border border-dashed border-slate-600">
                <p className="text-slate-500">Planet Map Editor Interface Placeholder</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 py-10">
            <p>No valid planet selected.</p>
            <p>Please return to the generator and select a planet to edit.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanetMapEditor;