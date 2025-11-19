
import React, { useState } from 'react';
import type { Sistema, CargaUtilPlaneta, TipoPlaneta } from '../types';
import SystemHeader from './starcards/SystemHeader';
import DiagnosticModal from './modals/DiagnosticModal';
import { useWorkbenchStore } from '../state/workbenchStore';

const InspectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;


/**
 * A simple, static icon to represent a planet, color-coded by its type.
 * Replaces the buggy ProceduralPlanet component.
 */
const PlanetIcon: React.FC<{ planet: CargaUtilPlaneta }> = ({ planet }) => {
    const planetColors: Record<TipoPlaneta, string> = {
        DESERTICO: 'bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]',
        JUNGLA: 'bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.5)]',
        VOLCANICO: 'bg-red-700 shadow-[0_0_10px_rgba(185,28,28,0.5)]',
        ACUATICO: 'bg-sky-600 shadow-[0_0_10px_rgba(2,132,199,0.5)]',
        GIGANTE_GASEOSO: 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]',
    };
    const colorClass = planetColors[planet.tipoPlaneta] || 'bg-slate-600';
    const isGasGiant = planet.tipoPlaneta === 'GIGANTE_GASEOSO';

    return (
        <div className={`relative flex-shrink-0 w-20 h-20 rounded-full ${colorClass} border-2 border-white/10 group-hover:scale-105 transition-all duration-300 overflow-hidden`}>
            {isGasGiant && (
                <>
                    <div className="absolute top-1/4 left-0 w-full h-2 bg-black/10"></div>
                    <div className="absolute top-1/2 left-0 w-full h-3 bg-black/10 -translate-y-2"></div>
                    <div className="absolute bottom-1/3 left-0 w-full h-1 bg-white/10"></div>
                </>
            )}
             {/* Gloss effect */}
            <div className="absolute top-2 right-4 w-4 h-2 bg-white/20 rounded-full transform rotate-45 blur-[2px]"></div>
        </div>
    );
};


interface SystemCardProps {
  /** The complete system data object to display. */
  system: Sistema;
  /** Callback function to trigger showing an entity in the Wiki panel. */
  onShowInWiki: (type: string, id: string) => void;
}

/**
 * A card component that displays a summary of a generated solar system.
 * Styled with Glassmorphism.
 */
const SystemCard: React.FC<SystemCardProps> = ({ system, onShowInWiki }) => {
    const { selectPlanetForEditing } = useWorkbenchStore();
    const [isDiagnosticOpen, setDiagnosticOpen] = useState(false);

    return (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 w-full animate-fade-in flex flex-col hover:border-accent-cyan/50 transition-all duration-300 shadow-lg">
            <div className="p-5 flex-grow">
                <SystemHeader system={system} onDiagnose={() => setDiagnosticOpen(true)} />
                
                <div className="flex items-center gap-2 mt-4 mb-2 text-accent-cyan/80 uppercase text-xs font-bold tracking-widest border-b border-white/5 pb-1">
                     <span>Orbital Scan</span>
                     <div className="h-px flex-grow bg-accent-cyan/20"></div>
                </div>

                <div className="max-h-96 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {system.orbitas.map(orbit => {
                        const mainObject = orbit.objetos[0];
                        if (!mainObject) return null;

                        // Render card for an asteroid belt
                        if (mainObject.tipo === 'CINTURON_ASTEROIDES') {
                            return (
                                <div key={orbit.id} className="grid grid-cols-[1fr,auto] gap-4 items-center p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    <div>
                                        <div className="font-bold text-slate-300 text-sm">Orbit {orbit.indiceOrbita} // Asteroid Belt</div>
                                        <div className="text-xs text-slate-500 capitalize">{mainObject.cargaUtil.densidad} density, {mainObject.cargaUtil.composicion} composition</div>
                                    </div>
                                    <div className="text-slate-400 font-mono text-center text-xs bg-black/20 px-2 py-1 rounded">{orbit.a_UA} <span className="text-slate-600">AU</span></div>
                                </div>
                            );
                        }

                        // Render card for a planet
                        if (mainObject.tipo === 'PLANETA') {
                            const payload = mainObject.cargaUtil;
                            // Defensive check for corrupted or incomplete data.
                            if (!payload || !('tituloTipoPlaneta' in payload)) {
                                return (
                                    <div key={orbit.id} className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                                        <p className="text-red-400 text-xs font-mono">ERR: Corrupted Planetary Data (Orbit {orbit.indiceOrbita})</p>
                                    </div>
                                );
                            }
                            return (
                                <button 
                                    key={orbit.id} 
                                    onClick={() => selectPlanetForEditing(system.id, mainObject.id)}
                                    className="w-full text-left p-3 bg-white/5 border border-white/5 rounded-lg group hover:bg-white/10 hover:border-accent-cyan/30 transition-all duration-200 relative overflow-hidden"
                                    aria-label={`Inspect ${payload.tituloTipoPlaneta}`}
                                >
                                    <div className="flex items-center space-x-4 relative z-10">
                                        <PlanetIcon planet={payload} />
                                        <div className="flex-1">
                                            <h5 className="font-bold text-slate-200 group-hover:text-white transition-colors">{payload.tituloTipoPlaneta}</h5>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                                                <span className="bg-black/30 px-1.5 rounded">ORB {orbit.indiceOrbita}</span>
                                                <span>{orbit.a_UA} AU</span>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-cyan">
                                            <InspectIcon />
                                        </div>
                                    </div>
                                    {/* Hover Scanline Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-cyan/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                                </button>
                            )
                        }
                        return null;
                    })}
                     {system.orbitas.length === 0 && (
                        <div className="p-4 text-sm italic text-slate-500 text-center border border-dashed border-slate-700 rounded-lg">No orbital bodies detected in scan.</div>
                     )}
                </div>
            </div>
            <DiagnosticModal isOpen={isDiagnosticOpen} onClose={() => setDiagnosticOpen(false)} system={system} />
        </div>
    );
};

export default SystemCard;
