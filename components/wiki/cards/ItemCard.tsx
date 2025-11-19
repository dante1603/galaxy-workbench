
import React from 'react';
import type { Material, Mineral, ArquetipoCristal } from '../../../types';
import { useStaticDataCtx } from '../../../context/StaticDataContext';
import { StatItem, HeartIcon, HungerIcon, EnergyIcon } from './SharedCardComponents';

interface ItemCardProps {
  item: Material | Mineral | ArquetipoCristal;
  type: 'Material' | 'Mineral' | 'Cristal';
  onNavigate?: (type: string, id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, type, onNavigate }) => {
    const { materials: allMaterials } = useStaticDataCtx();

    if (type === 'Material') {
        const material = item as Material;
        const isConsumable = !!material.datosConsumible;
        return (
            <div className="w-full mt-2 pt-2 border-t border-slate-700/50">
                <StatItem label="Rareza" value={material.rareza} />
                <StatItem label="Tier" value={material.tier} className={isConsumable ? "" : "border-b-0"} />

                {isConsumable && material.datosConsumible && (
                    <div className="mt-3 bg-black/20 rounded p-2 border border-white/5">
                         <h4 className="text-[10px] text-accent-cyan font-bold uppercase mb-2 tracking-widest">Propiedades de Consumo</h4>
                         <div className="flex gap-3 mb-2">
                            {material.datosConsumible.salud !== undefined && material.datosConsumible.salud !== 0 && (
                                <div className={`flex items-center gap-1 text-xs font-bold ${material.datosConsumible.salud > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    <HeartIcon />
                                    <span>{material.datosConsumible.salud > 0 ? '+' : ''}{material.datosConsumible.salud}</span>
                                </div>
                            )}
                            {material.datosConsumible.hambre !== undefined && material.datosConsumible.hambre !== 0 && (
                                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                                    <HungerIcon />
                                    <span>+{material.datosConsumible.hambre}</span>
                                </div>
                            )}
                            {material.datosConsumible.aguante !== undefined && material.datosConsumible.aguante !== 0 && (
                                <div className="flex items-center gap-1 text-xs font-bold text-yellow-300">
                                    <EnergyIcon />
                                    <span>+{material.datosConsumible.aguante}</span>
                                </div>
                            )}
                         </div>
                         
                         {material.datosConsumible.efectos && material.datosConsumible.efectos.length > 0 && (
                             <div className="mt-2 pt-2 border-t border-white/5">
                                <span className="block text-[10px] text-slate-500 mb-1">Efectos Secundarios</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {material.datosConsumible.efectos.map((ef, i) => (
                                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 border border-slate-600 text-slate-300" onClick={onNavigate ? () => onNavigate('Efectos', ef.id) : undefined}>
                                            {onNavigate ? <span className="cursor-pointer hover:text-white hover:underline">{ef.id.replace('effect_', '')}</span> : ef.id.replace('effect_', '')} 
                                            <span className="ml-1 opacity-70">({(ef.chance * 100).toFixed(0)}%)</span>
                                        </span>
                                    ))}
                                </div>
                             </div>
                         )}
                    </div>
                )}
            </div>
        );
    }

    if (type === 'Mineral') {
        const mineral = item as Mineral;
        const productoRefinado = mineral.datosProcesamiento 
            ? allMaterials.find(m => m.id === mineral.datosProcesamiento!.productoId) 
            : null;

        return (
            <div className="mt-2 pt-2 border-t border-slate-700/50 w-full">
                <div className="flex justify-between items-start mb-2">
                     <div>
                         <StatItem label="Rareza" value={mineral.rareza} className="border-b-0 py-0 pb-1" />
                         <div className="flex items-center text-xs text-slate-400">
                             <span className="mr-2">Dureza (Mohs):</span>
                             <div className="flex gap-0.5">
                                 {[...Array(10)].map((_, i) => (
                                     <div key={i} className={`w-1 h-2 rounded-sm ${i < mineral.dureza ? 'bg-accent-cyan' : 'bg-slate-700'}`}></div>
                                 ))}
                             </div>
                             <span className="ml-2 font-mono text-white">{mineral.dureza}</span>
                         </div>
                     </div>
                     {mineral.formulaQuimica && (
                         <div className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-slate-300 tracking-wide border border-white/10">
                             {mineral.formulaQuimica}
                         </div>
                     )}
                </div>

                {mineral.datosProcesamiento && (
                    <div className="mt-3 bg-slate-800/50 rounded-md p-2 border border-slate-700">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">Ruta de Procesamiento</span>
                        <div className="flex items-center gap-2 text-xs">
                            <div className="bg-black/40 px-2 py-1 rounded text-slate-300 border border-slate-600">
                                {mineral.nombre}
                            </div>
                            <div className="flex flex-col items-center text-slate-500">
                                <span className="text-[10px] uppercase">{mineral.datosProcesamiento.metodo}</span>
                                <span>➜</span>
                            </div>
                             <div 
                                className={`bg-black/40 px-2 py-1 rounded border border-slate-600 ${onNavigate ? 'cursor-pointer hover:border-accent-cyan hover:text-accent-cyan' : 'text-white'}`}
                                onClick={onNavigate && productoRefinado ? () => onNavigate('Materiales', productoRefinado.id) : undefined}
                            >
                                {productoRefinado ? productoRefinado.nombre : mineral.datosProcesamiento.productoId}
                                <span className="text-slate-500 ml-1">x{mineral.datosProcesamiento.cantidadResultado}</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="mt-2">
                    <strong className="text-xs text-slate-400 block mb-1">Suelos Compatibles:</strong>
                    <div className="flex flex-wrap gap-1">
                        {mineral.suelosCompatibles && mineral.suelosCompatibles.length > 0 ? (
                            mineral.suelosCompatibles.map(suelo => (
                                <span key={suelo} className="text-[10px] px-2 py-0.5 bg-slate-800 rounded text-slate-300 border border-white/5 capitalize">
                                    {suelo.replace(/_/g, ' ')}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] text-slate-500 italic">No especificado / Universal</span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'Cristal') {
        const crystal = item as ArquetipoCristal;
        return (
             <div className="mt-2 pt-2 border-t border-slate-700/50 w-full">
                <StatItem label="Elemento" value={crystal.elemento} />
                <StatItem label="Potencia Base" value={crystal.potenciaBase} />
                <StatItem label="Rareza" value={crystal.rareza} className="border-b-0"/>
            </div>
        );
    }

    return null;
};

export default ItemCard;
