
import React from 'react';
import type { Jugador } from '../../../types';
import { useStaticDataCtx } from '../../../context/StaticDataContext';
import { StatItem } from './SharedCardComponents';

interface PlayerCardProps {
  player: Jugador;
}

const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const BodyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>;

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
    const { species: allSpecies } = useStaticDataCtx();
    const species = allSpecies.find(s => s.id === player.especieId);
    const parasito = player.datosParasito;

    return (
         <div className="mt-2 pt-2 border-t border-slate-700/50 w-full space-y-4">
            
            {/* Sección Parásito */}
            <div className="bg-accent-cyan/5 rounded-lg p-3 border border-accent-cyan/20">
                <h4 className="text-xs text-accent-cyan font-bold mb-2 flex items-center gap-2 uppercase tracking-widest">
                    <BrainIcon /> Entidad Simbionte (Jugador)
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex justify-between border-b border-accent-cyan/10 pb-1">
                        <span className="text-slate-400">ID Neural</span>
                        <span className="text-slate-200 font-mono">{parasito.nombreSimbionte}</span>
                    </div>
                    <div className="flex justify-between border-b border-accent-cyan/10 pb-1">
                        <span className="text-slate-400">Nivel Consciencia</span>
                        <span className="text-slate-200 font-mono">{parasito.nivelConsciencia}</span>
                    </div>
                     <div className="flex justify-between border-b border-accent-cyan/10 pb-1">
                        <span className="text-slate-400">Cuerpos Consumidos</span>
                        <span className="text-slate-200 font-mono">{parasito.huespedesPoseidos}</span>
                    </div>
                    <div className="flex justify-between border-b border-accent-cyan/10 pb-1">
                        <span className="text-slate-400">Color Señal</span>
                        <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: parasito.colorSimbionte }}></div>
                    </div>
                </div>
            </div>

            {/* Sección Cuerpo */}
            <div>
                <h4 className="text-xs text-slate-400 mb-1.5 font-bold flex items-center gap-2 uppercase">
                    <BodyIcon /> Huésped Actual (Desechable)
                </h4>
                <div className="flex flex-col text-xs space-y-1">
                    <StatItem label="Especie Base" value={species?.nombre || 'Prototipo Genético'} className="py-1 border-b border-slate-700" />
                    <StatItem label="Salud Biológica" value={player.statsBase.salud} className="py-1" />
                    <StatItem label="Aguante Físico" value={player.statsBase.aguante} className="py-1" />
                    <StatItem label="Capacidad Ofensiva" value={player.statsBase.ataque} className="py-1" />
                    <StatItem label="Integridad Dérmica" value={player.statsBase.defensa} className="py-1 border-b-0" />
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
