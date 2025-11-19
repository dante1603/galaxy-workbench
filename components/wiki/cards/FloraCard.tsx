
import React from 'react';
import type { Planta } from '../../../types';
import { useStaticDataCtx } from '../../../context/StaticDataContext';
import { Tag, AppleIcon } from './SharedCardComponents';
import { PLANT_STRUCTURE_COLORS, PLANT_FOLIAGE_COLORS } from '../../starcards/common';

interface FloraCardProps {
  plant: Planta;
  onNavigate?: (type: string, id: string) => void;
}

const FloraCard: React.FC<FloraCardProps> = ({ plant, onNavigate }) => {
    const { materials: allMaterials } = useStaticDataCtx();

    const drops = plant.drops.map(drop => {
        const mat = allMaterials.find(m => m.id === drop.materialId);
        return mat ? { ...drop, name: mat.nombre } : null;
    }).filter(Boolean);
    
    const fruta = plant.frutaId ? allMaterials.find(m => m.id === plant.frutaId) : null;

    return (
        <div className="mt-2 pt-2 border-t border-slate-700/50 w-full space-y-3">
            
            {/* Classification Tags */}
            <div className="flex flex-wrap gap-1.5">
               <Tag text={plant.estructura} className={PLANT_STRUCTURE_COLORS[plant.estructura] || 'bg-slate-700'} />
               <Tag text={plant.follaje} className={PLANT_FOLIAGE_COLORS[plant.follaje] || 'bg-slate-700'} />
               <Tag text={plant.reproduccion} className="bg-amber-900/50 text-amber-200 border-amber-700/70" />
            </div>

            {/* Habitat Info */}
            {plant.habitat && (
               <div className="grid grid-cols-3 gap-2 text-xs bg-white/5 p-2 rounded border border-white/5">
                  <div className="text-center">
                     <span className="block text-[10px] text-slate-500 uppercase font-bold">Luz</span>
                     <span className="capitalize text-slate-300">{plant.habitat.luzRequerida.replace('_', ' ')}</span>
                  </div>
                  <div className="text-center border-l border-white/10">
                     <span className="block text-[10px] text-slate-500 uppercase font-bold">Suelo</span>
                     <span className="capitalize text-slate-300">{plant.habitat.sueloPreferido}</span>
                  </div>
                  <div className="text-center border-l border-white/10">
                     <span className="block text-[10px] text-slate-500 uppercase font-bold">Patrón</span>
                     <span className="capitalize text-slate-300">{plant.habitat.patronDistribucion.replace('_', ' ')}</span>
                  </div>
               </div>
            )}

            {/* Harvest Section */}
            <div>
                {fruta && (
                    <div className="mb-3">
                        <h4 className="text-xs text-slate-400 mb-1 font-bold flex items-center gap-1"><AppleIcon /> Cosecha Principal (Sin Destruir)</h4>
                        <Tag 
                            text={fruta.nombre} 
                            className="bg-emerald-900/60 text-emerald-200 border-emerald-600/70" 
                            onClick={onNavigate ? () => onNavigate('Materiales', fruta.id) : undefined}
                        />
                    </div>
                )}
                
                <h4 className="text-xs text-slate-400 mb-1 font-bold">Drops Potenciales (Al Destruir)</h4>
                <div className="flex flex-wrap gap-1.5">
                    {drops.map(drop => drop && (
                        <Tag 
                            key={drop.materialId} 
                            text={drop.name} 
                            subtext={`${(drop.chance * 100).toFixed(0)}%`} 
                            className="bg-blue-900/50 text-blue-300 border-blue-700/70"
                            onClick={onNavigate ? () => onNavigate('Materiales', drop.materialId) : undefined}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FloraCard;
