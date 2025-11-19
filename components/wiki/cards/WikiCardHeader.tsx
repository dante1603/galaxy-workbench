
import React from 'react';
import type { GameEntity, Fauna, Material, Bioma, ArquetipoCristal, EspecieInteligente, Efecto } from '../../../types';
import { 
    BIOME_CATEGORY_COLORS, ORIGIN_COLORS, EFFECT_TYPE_COLORS, CRYSTAL_COLORS, 
    KingdomBadge, Tag, CrystalIcon 
} from './SharedCardComponents';

interface WikiCardHeaderProps {
    item: GameEntity;
    type: string;
    viewMode: 'list' | 'grid';
}

const WikiCardHeader: React.FC<WikiCardHeaderProps> = ({ item, type, viewMode }) => {
    return (
        <>
            {/* GRID MODE IMAGE HANDLING */}
            {viewMode === 'grid' && type === 'Fauna' && (item as Fauna).urlImagen && (
                <div className="w-full h-32 mb-3 bg-space-dark/40 rounded-md border border-slate-700/50 overflow-hidden shadow-sm flex-shrink-0 relative">
                    <img 
                        src={(item as Fauna).urlImagen!} 
                        alt={`Imagen de ${item.nombre}`} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                e.currentTarget.parentElement.innerHTML = `<div class="text-slate-600 flex flex-col items-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>`;
                            }
                        }}
                    />
                </div>
            )}
            
            {viewMode === 'grid' && type === 'Especie' && (item as EspecieInteligente).urlImagen && (
                 <div className="w-full h-32 mb-3 bg-space-dark/40 rounded-md border border-slate-700/50 overflow-hidden shadow-sm flex-shrink-0 relative">
                    <img 
                        src={(item as EspecieInteligente).urlImagen!} 
                        alt={`Imagen de ${item.nombre}`} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                        loading="lazy"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                </div>
            )}

            {/* SHARED HEADER CONTENT */}
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate" title={item.nombre}>{item.nombre}</h3>
                    <p className={`text-xs text-slate-400 mt-1 italic ${viewMode === 'grid' ? 'line-clamp-2' : ''}`}>{item.descripcion}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    {type === 'Jugador' && <Tag text="Jugador" className="bg-yellow-800/50 text-yellow-300 border-yellow-600/70" />}
                    {type === 'Fauna' && <KingdomBadge kingdom={(item as Fauna).reino} />}
                    {type === 'Material' && <Tag text={(item as Material).origen} className={ORIGIN_COLORS[(item as Material).origen]} />}
                    {type === 'Biome' && (
                        <div className="flex flex-col space-y-1 items-end">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${BIOME_CATEGORY_COLORS[(item as Bioma).categoria]} capitalize`}>
                                {(item as Bioma).categoria.replace(/_/g, ' ').toLowerCase()}
                            </span>
                        </div>
                    )}
                    {type === 'Cristal' && (
                        <div className="flex items-center space-x-2 text-xs font-semibold" style={{ color: CRYSTAL_COLORS[(item as ArquetipoCristal).tipoCristal] }}>
                            <CrystalIcon />
                            <span className="capitalize">{(item as ArquetipoCristal).tipoCristal}</span>
                        </div>
                    )}
                    {type === 'Especie' && (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full border border-black/30" style={{ backgroundColor: (item as EspecieInteligente).colorClave }}></div>
                            {viewMode === 'list' && <span className="text-xs font-bold text-slate-300">Especie Inteligente</span>}
                        </div>
                    )}
                    {type === 'Efecto' && <Tag text={(item as Efecto).tipoEfecto} className={EFFECT_TYPE_COLORS[(item as Efecto).tipoEfecto]} />}
                </div>
            </div>
        </>
    );
};

export default WikiCardHeader;
