
import React from 'react';
import type { Jugador } from '../../../types';
import { useStaticDataCtx } from '../../../context/StaticDataContext';
import { StatItem } from './SharedCardComponents';

interface PlayerCardProps {
  player: Jugador;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
    const { species: allSpecies } = useStaticDataCtx();
    const species = allSpecies.find(s => s.id === player.especieId);
    return (
         <div className="mt-2 pt-2 border-t border-slate-700/50 w-full">
            <h4 className="text-xs text-slate-400 mb-1.5 font-bold">Estadísticas Base</h4>
            <div className="flex flex-col text-xs space-y-1">
                <StatItem label="Salud" value={player.statsBase.salud} className="py-1" />
                <StatItem label="Aguante" value={player.statsBase.aguante} className="py-1" />
                <StatItem label="Ataque" value={player.statsBase.ataque} className="py-1" />
                <StatItem label="Defensa" value={player.statsBase.defensa} className="py-1" />
                <StatItem label="Especie" value={species?.nombre || 'Ninguna'} className="py-1 border-b-0" />
            </div>
        </div>
    );
};

export default PlayerCard;
