
import React from 'react';
import type { Bioma } from '../../../types';
import { useStaticDataCtx } from '../../../context/StaticDataContext';

interface PlanetCardProps {
    biome: Bioma;
    onNavigate?: (type: string, id: string) => void;
}

const PlanetCard: React.FC<PlanetCardProps> = ({ biome, onNavigate }) => {
    const { fauna: allFauna, plants: allPlants, minerals: allMinerals } = useStaticDataCtx();

    const flora = allPlants.filter(p => 
        p.biomeIds.includes(biome.id) || p.tags.includes(biome.categoria)
    );
    
    const fauna = allFauna.filter(f => 
        f.biomeIds.includes(biome.id) || f.tags.includes(biome.categoria)
    );

    return (
        <div className="mt-2 pt-2 border-t border-slate-700/50 space-y-3 text-xs w-full">
            <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/10">
                <span className="font-bold text-slate-400">Suelo Dominante:</span>
                <span className="capitalize text-accent-amber font-mono bg-black/30 px-2 py-0.5 rounded">{biome.tipoSuelo.replace(/_/g, ' ')}</span>
            </div>

            {fauna.length > 0 && (
                <div>
                    <strong className="text-slate-400 block mb-1">Fauna Nativa (Adaptada):</strong>
                    <div className="flex flex-wrap gap-1">
                        {fauna.map(f => (
                            <span 
                                key={f.id} 
                                onClick={onNavigate ? () => onNavigate('Fauna', f.id) : undefined}
                                className="bg-slate-800 px-2 py-1 rounded cursor-pointer hover:text-accent-cyan border border-transparent hover:border-accent-cyan/30 transition-colors"
                                title={f.descripcion}
                            >
                                {f.nombre}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {flora.length > 0 && (
                <div>
                    <strong className="text-slate-400 block mb-1">Flora Compatible:</strong>
                    <div className="flex flex-wrap gap-1">
                        {flora.map(p => (
                            <span 
                                key={p.id} 
                                onClick={onNavigate ? () => onNavigate('Flora', p.id) : undefined}
                                className="bg-slate-800 px-2 py-1 rounded cursor-pointer hover:text-emerald-400 border border-transparent hover:border-emerald-500/30 transition-colors"
                                title={p.descripcion}
                            >
                                {p.nombre}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {biome.mineralesPosibles.length > 0 && (
                 <div>
                    <strong className="text-slate-400 block mb-1">Recursos Minerales:</strong>
                    <div className="flex flex-wrap gap-1">
                        {biome.mineralesPosibles.map(id => {
                            const m = allMinerals.find(min => min.id === id);
                            return m ? (
                                <span 
                                    key={id} 
                                    onClick={onNavigate ? () => onNavigate('Minerales', id) : undefined}
                                    className="bg-slate-800 px-2 py-1 rounded cursor-pointer hover:text-amber-400 border border-transparent hover:border-amber-500/30 transition-colors"
                                >
                                    {m.nombre}
                                </span>
                            ) : null
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanetCard;
