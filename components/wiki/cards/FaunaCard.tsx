
import React from 'react';
import type { Fauna } from '../../../types';
import { useStaticDataCtx } from '../../../context/StaticDataContext';
import { StatItem, Tag, EditIcon, TrashIcon, DIET_COLORS, SIZE_COLORS } from './SharedCardComponents';

interface FaunaCardProps {
  fauna: Fauna;
  viewMode?: 'list' | 'grid';
  onEdit: (item: Fauna) => void;
  onDelete: (type: string, id: string) => void;
  onNavigate?: (type: string, id: string) => void;
}

const FaunaCard: React.FC<FaunaCardProps> = ({ fauna, viewMode = 'list', onEdit, onDelete, onNavigate }) => {
    const { materials: allMaterials } = useStaticDataCtx();
    
    const drops = fauna.drops.map(drop => {
        const material = allMaterials.find(m => m.id === drop.materialId);
        return material ? { ...drop, name: material.nombre } : null;
    }).filter(Boolean);

    return (
        <>
            <div className="mt-2 pt-2 border-t border-slate-700/50 w-full">
                <div className={`grid gap-4 ${fauna.urlImagen && viewMode === 'list' ? 'grid-cols-1 sm:grid-cols-[1fr_auto]' : 'grid-cols-1'}`}>
                    
                    <div className="space-y-3 min-w-0">
                        <div>
                            <h4 className="text-xs text-slate-400 mb-1 font-bold">Fisiología</h4>
                            <div className="flex flex-col text-xs space-y-1">
                                <StatItem label="Plan Corporal" value={fauna.planCorporal} className="py-1 border-b-0" />
                                <StatItem label="Cobertura" value={fauna.cobertura} className="py-1 border-b-0" />
                                <StatItem label="Locomoción" value={fauna.locomocion} className="py-1 border-b-0" />
                                {viewMode === 'list' && <StatItem label="Sentidos" value={fauna.sentidos.join(', ') || 'Desconocido'} className="py-1 border-b-0" />}
                                <StatItem label="Cola" value={fauna.tieneCola ? `Sí` : 'No'} className="py-1 border-b-0" />
                            </div>
                        </div>
                    </div>

                    {fauna.urlImagen && viewMode === 'list' && (
                        <div className="flex-shrink-0">
                             <div className="w-full sm:w-32 h-48 sm:h-32 bg-space-dark/40 rounded-md border border-slate-700/50 overflow-hidden shadow-sm group relative">
                                <img 
                                    src={fauna.urlImagen} 
                                    alt={`Imagen de ${fauna.nombre}`} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        if (e.currentTarget.parentElement) {
                                            e.currentTarget.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-slate-800');
                                            e.currentTarget.parentElement.innerHTML = '<span class="text-slate-500 text-xs">Image Error</span>';
                                        }
                                    }}
                                />
                             </div>
                        </div>
                    )}
                </div>

                <div className="mt-3 space-y-3 pt-2 border-t border-slate-700/30">
                    <div className="flex flex-wrap gap-1.5">
                         <Tag text={fauna.comportamientoSocial} className="bg-slate-700/50 text-slate-300 border-slate-500/70" />
                         <Tag text={fauna.temperamento} className="bg-slate-700/50 text-slate-300 border-slate-500/70" />
                    </div>

                    {(fauna.rolCombate.length > 0 || fauna.utilidad.length > 0) && viewMode === 'list' && (
                        <div>
                            <h4 className="text-xs text-slate-400 mb-1.5 font-bold">Utilidad y Combate</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {fauna.rolCombate.map(tag => (
                                    <Tag key={tag} text={tag} className="bg-red-900/50 text-red-300 border-red-700/70" />
                                ))}
                                {fauna.utilidad.map(tag => (
                                    <Tag key={tag} text={tag} className="bg-cyan-900/50 text-cyan-300 border-cyan-700/70" />
                                ))}
                            </div>
                        </div>
                    )}
                    {drops.length > 0 && (
                        <div>
                            <h4 className="text-xs text-slate-400 mb-1.5 font-bold">Recursos Obtenibles</h4>
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
                    )}
                </div>
            </div>
            
             <div className="flex flex-wrap gap-1.5 mt-2">
                <Tag text={fauna.dieta} className={DIET_COLORS[fauna.dieta]} />
                <Tag text={fauna.tamano} className={SIZE_COLORS[fauna.tamano]} />
            </div>
            
            <div className="flex justify-end space-x-2 mt-2">
                <button onClick={() => onEdit(fauna)} title="Editar" className="p-1.5 rounded-md bg-space-light/50 hover:bg-accent-amber/80 text-slate-300 hover:text-space-dark transition-colors">
                    <EditIcon />
                </button>
                 <button onClick={() => onDelete('Fauna', fauna.id)} title="Eliminar" className="p-1.5 rounded-md bg-space-light/50 hover:bg-red-600/80 text-slate-300 hover:text-white transition-colors">
                    <TrashIcon />
                </button>
            </div>
        </>
    );
};

export default FaunaCard;
