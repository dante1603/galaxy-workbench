import React from 'react';
import type { Sistema, ObjetoOrbital, CargaUtilPlaneta } from '../types';
import SystemHeader from './starcards/SystemHeader';
import { ListItem } from './starcards/common';
import ProceduralPlanet from './ProceduralPlanet.tsx';
import { useWorkbenchStore } from '../state/workbenchStore';

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;


interface SystemCardProps {
  /** The complete system data object to display. */
  system: Sistema;
  /** Callback function to trigger showing an entity in the Wiki panel. */
  onShowInWiki: (type: string, id: string) => void;
}

/**
 * A card component that displays a summary of a generated solar system,
 * including its central star and a list of its orbital objects.
 */
const SystemCard: React.FC<SystemCardProps> = ({ system, onShowInWiki }) => {
    const { selectPlanetForEditing } = useWorkbenchStore();

    return (
        <div className="bg-space-mid rounded-lg shadow-lg border border-slate-700 w-full animate-fade-in flex flex-col">
            <div className="p-5 flex-grow">
                <SystemHeader system={system} />
                
                <h4 className="text-lg font-bold text-slate-300 mt-4 mb-2">Orbits</h4>
                <div className="max-h-96 overflow-y-auto pr-2 mt-2 space-y-2">
                    {system.orbitas.map(orbit => {
                        const mainObject = orbit.objetos[0];
                        if (!mainObject) return null;

                        // Render card for an asteroid belt
                        if (mainObject.tipo === 'CINTURON_ASTEROIDES') {
                            return (
                                <div key={orbit.id} className="grid grid-cols-[1fr,auto] gap-4 items-center p-2 bg-space-light/50 rounded-md">
                                    <div>
                                        <div className="font-bold text-white">Orbit {orbit.indiceOrbita} - Cinturón de Asteroides ☄️</div>
                                        <div className="text-xs text-slate-400 capitalize">{mainObject.cargaUtil.densidad} de {mainObject.cargaUtil.composicion}</div>
                                    </div>
                                    <div className="text-slate-300 font-mono text-center text-xs">{orbit.a_UA} <span className="text-slate-500">AU</span></div>
                                </div>
                            );
                        }

                        // Render card for a planet
                        if (mainObject.tipo === 'PLANETA') {
                            const payload = mainObject.cargaUtil;
                            // Defensive check for corrupted or incomplete data.
                            if (!payload || !('tituloTipoPlaneta' in payload)) {
                                return (
                                    <div key={orbit.id} className="p-3 bg-red-900/50 rounded-md">
                                        <p className="text-red-300 text-xs font-bold">Error: Datos del planeta corruptos en la órbita {orbit.indiceOrbita}.</p>
                                    </div>
                                );
                            }
                            return (
                                <div key={orbit.id} className="p-3 bg-space-light/70 rounded-md group">
                                    <div className="flex items-center space-x-4">
                                        <ProceduralPlanet planetObject={mainObject} />
                                        <div className="flex-1">
                                            <h5 className="font-bold text-white">{payload.tituloTipoPlaneta}</h5>
                                            <p className="text-xs text-slate-400">Orbit {orbit.indiceOrbita} - {orbit.a_UA} AU</p>
                                        </div>
                                        <button 
                                            onClick={() => selectPlanetForEditing(system.id, mainObject.id)}
                                            className="flex items-center space-x-2 text-xs bg-accent-amber/80 text-space-dark font-bold py-2 px-3 rounded-md hover:bg-accent-amber transition-colors duration-200"
                                            aria-label={`Edit map for ${payload.tituloTipoPlaneta}`}
                                        >
                                            <EditIcon />
                                            <span>Map Editor</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                        return null;
                    })}
                     {system.orbitas.length === 0 && (
                        <div className="p-2 text-sm italic text-slate-400">No orbits detected in this system.</div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default SystemCard;