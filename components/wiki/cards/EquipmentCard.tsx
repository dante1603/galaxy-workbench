
import React from 'react';
import type { Arma, Herramienta } from '../../../types';
import { StatItem } from './SharedCardComponents';

interface EquipmentCardProps {
  item: Arma | Herramienta;
  type: 'Arma' | 'Herramienta';
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ item, type }) => {
    if (type === 'Arma') {
        const weapon = item as Arma;
        return (
            <div className="mt-2 pt-2 border-t border-slate-700/50 w-full">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-xs text-slate-400 mb-1.5 font-bold">Estadísticas</h4>
                        <div className="flex flex-col text-xs space-y-1">
                            <StatItem label="Tipo" value={weapon.tipoArma} className="py-1 border-b-0" />
                            <StatItem label="Daño" value={weapon.dano} className="py-1 border-b-0" />
                            <StatItem label="Velocidad" value={weapon.velocidad} className="py-1 border-b-0" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'Herramienta') {
        const tool = item as Herramienta;
        return (
            <div className="mt-2 pt-2 border-t border-slate-700/50 w-full">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-xs text-slate-400 mb-1.5 font-bold">Atributos</h4>
                        <div className="flex flex-col text-xs space-y-1">
                            <StatItem label="Tipo" value={tool.tipoHerramienta} className="py-1 border-b-0" />
                            <StatItem label="Eficiencia" value={tool.eficiencia.toFixed(1)} className="py-1 border-b-0" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default EquipmentCard;
