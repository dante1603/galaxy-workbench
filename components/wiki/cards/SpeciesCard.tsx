
import React, { useRef, useState } from 'react';
import type { EspecieInteligente } from '../../../types';
import { ALL_PLAYERS } from '../../../data/players';
import { ComparisonStatBar, ImageIcon, ArrowUpIcon, ArrowDownIcon } from './SharedCardComponents';

interface SpeciesCardProps {
  species: EspecieInteligente;
  viewMode?: 'list' | 'grid';
  onUpdateSpeciesImage: (speciesId: string, imageUrl: string) => void;
}

const SpeciesCard: React.FC<SpeciesCardProps> = ({ species, viewMode = 'list', onUpdateSpeciesImage }) => {
    const basePlayer = ALL_PLAYERS.find(p => p.id === 'player_base');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imgError, setImgError] = useState(false);

    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateSpeciesImage(species.id, reader.result as string);
                setImgError(false);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-4 w-full mt-2 border-t border-slate-700/50 pt-2">
            
             {/* Image Upload Control */}
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
             
             <div className="flex justify-end mb-2">
                <button onClick={handleImageUploadClick} title="Upload Custom Concept Art" className="p-1.5 rounded-md bg-space-light hover:bg-space-dark/50 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs">
                    <ImageIcon /> Upload Art
                </button>
             </div>

             {/* Species Image (List Mode Support) */}
             {viewMode === 'list' && species.urlImagen && !imgError && (
                 <div className="flex justify-center mb-4">
                     <div className="w-full sm:w-2/3 h-48 bg-space-dark/40 rounded-md border border-slate-700/50 overflow-hidden shadow-lg relative group">
                         <img 
                             src={species.urlImagen} 
                             alt={`Concepto de ${species.nombre}`} 
                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                             loading="lazy"
                             onError={() => setImgError(true)}
                         />
                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                             <span className="text-[10px] text-slate-300 uppercase tracking-widest">Concept Art</span>
                         </div>
                     </div>
                 </div>
             )}

            {/* Lore */}
            <div>
                <h4 className="text-sm text-slate-300 font-bold mb-1.5">Lore</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
                    {species.lore.slice(0, viewMode === 'grid' ? 1 : 3).map((line, index) => <li key={index}>{line}</li>)}
                </ul>
            </div>
            
            {/* Stat Projection Graph */}
            {viewMode === 'list' && basePlayer && (
                <div className="pt-2 border-t border-slate-700/50">
                    <h4 className="text-sm text-slate-300 font-bold mb-3">Impacto en Stats Base</h4>
                    <div className="bg-black/20 p-3 rounded-md border border-white/5">
                        <ComparisonStatBar 
                            label="Salud (HP)" 
                            baseValue={basePlayer.statsBase.salud} 
                            modifier={species.modificadoresStatsBase.salud || 0} 
                        />
                        <ComparisonStatBar 
                            label="Aguante (ST)" 
                            baseValue={basePlayer.statsBase.aguante} 
                            modifier={species.modificadoresStatsBase.aguante || 0} 
                        />
                        <ComparisonStatBar 
                            label="Defensa (DEF)" 
                            baseValue={basePlayer.statsBase.defensa} 
                            modifier={species.modificadoresStatsBase.defensa || 0} 
                        />
                         <ComparisonStatBar 
                            label="Ataque (ATK)" 
                            baseValue={basePlayer.statsBase.ataque} 
                            modifier={species.modificadoresStatsBase.ataque || 0} 
                        />
                         <ComparisonStatBar 
                            label="Velocidad (SPD)" 
                            baseValue={basePlayer.statsBase.velocidadMovimiento} 
                            modifier={species.modificadoresStatsBase.velocidadMovimiento || 0} 
                        />
                    </div>
                </div>
            )}

             {/* Habilidades */}
             {viewMode === 'list' && species.habilidades && species.habilidades.length > 0 && (
                <div>
                    <h4 className="text-sm text-slate-300 font-bold mb-1.5">Habilidades Únicas</h4>
                    <div className="space-y-2">
                        {species.habilidades.map((skill, index) => (
                            <div key={index} className="bg-accent-cyan/10 border border-accent-cyan/30 p-2 rounded relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1 opacity-10">
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-accent-cyan uppercase mb-1 relative z-10">
                                    <span>{skill.nombre}</span>
                                    {skill.tipo === 'ACTIVA' && <span className="text-[10px] bg-black/30 px-1.5 rounded border border-accent-cyan/30">CD: {skill.cooldownSegundos}s</span>}
                                </div>
                                <p className="text-xs text-slate-300 relative z-10">{skill.descripcion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

             {/* Rasgos */}
             {viewMode === 'list' && species.rasgos && species.rasgos.length > 0 && (
                <div>
                    <h4 className="text-sm text-slate-300 font-bold mb-1.5">Rasgos Pasivos</h4>
                    <div className="space-y-1">
                        {species.rasgos.map((trait, index) => (
                            <div key={index} className="flex items-start gap-2 text-xs p-1 hover:bg-white/5 rounded transition-colors">
                                <div className="mt-0.5 flex-shrink-0">
                                    {trait.tipo === 'VENTAJA' ? <ArrowUpIcon /> : trait.tipo === 'DESVENTAJA' ? <ArrowDownIcon /> : <span className="w-2 h-2 bg-slate-500 rounded-full block mt-1"></span>}
                                </div>
                                <div>
                                    <strong className={trait.tipo === 'VENTAJA' ? 'text-green-300' : trait.tipo === 'DESVENTAJA' ? 'text-red-300' : 'text-slate-300'}>
                                        {trait.nombre}: 
                                    </strong>
                                    <span className="text-slate-400 ml-1">{trait.descripcion}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpeciesCard;
