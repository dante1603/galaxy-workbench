import React, { useState, useEffect } from 'react';
import { GalaxySeed, getGalaxySeeds, deleteGalaxySeed } from '../api/galaxy';
import { GalaxyParams } from '../utils/galaxyMath';

interface SavedGalaxiesPanelProps {
  onSelectGalaxy: (params: GalaxyParams) => void;
  onClose: () => void;
}

const SavedGalaxiesPanel: React.FC<SavedGalaxiesPanelProps> = ({ onSelectGalaxy, onClose }) => {
  const [galaxies, setGalaxies] = useState<GalaxySeed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGalaxies();
  }, []);

  const loadGalaxies = async () => {
    setLoading(true);
    const seeds = await getGalaxySeeds();
    setGalaxies(seeds);
    setLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this galaxy?')) {
      await deleteGalaxySeed(id);
      loadGalaxies();
    }
  };

  return (
    <div className="absolute right-12 top-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-md p-4 w-80 shadow-2xl animate-fade-in z-50">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700/50 text-slate-300">
        <h4 className="text-sm font-bold uppercase">Saved Galaxies</h4>
        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>

      {loading ? (
        <div className="text-center text-slate-500 py-4">Loading...</div>
      ) : galaxies.length === 0 ? (
        <div className="text-center text-slate-500 py-4">No saved galaxies.</div>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
          {galaxies.map((galaxy) => (
            <div 
              key={galaxy.id} 
              className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded border border-slate-700/50 cursor-pointer group"
              onClick={() => onSelectGalaxy(galaxy.config as GalaxyParams)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-bold text-accent-cyan text-sm">{galaxy.name}</h5>
                  <p className="text-xs text-slate-400">By {galaxy.authorName}</p>
                </div>
                <button 
                  onClick={(e) => handleDelete(e, galaxy.id)}
                  className="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Galaxy"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedGalaxiesPanel;
