
import React, { useCallback } from 'react';
import type { Estrella, ObjetoOrbital, CuerpoEspecial } from '../types';
import { useWorkbenchStore } from '../state/workbenchStore';
import SystemCard from '../components/StarCard';
import SystemVisualizer from '../components/SystemVisualizer';
import GalaxyVisualizer from '../components/GalaxyVisualizer';
import { generateSystem } from '../services/starGenerator';

interface SystemGeneratorProps {
    onShowInWiki: (type: string, id: string) => void;
    onObjectSelected3D: (data: Estrella | ObjetoOrbital | CuerpoEspecial) => void;
    viewMode: 'cards' | '3d'; // App header toggle
    onGalaxyHyperjump?: () => void;
    isPaused?: boolean;
}

const SystemGenerator: React.FC<SystemGeneratorProps> = ({ onShowInWiki, onObjectSelected3D, viewMode, onGalaxyHyperjump, isPaused = false }) => {
    const { systems, viewMode: galaxyViewMode, addSystem, resetSystems, returnToGalaxy } = useWorkbenchStore();

    const handleStarSelected = useCallback(async (seed: number) => {
        // In a real app, we would use the 'seed' to deterministically generate the same system every time.
        // For now, we generate a random one to simulate the experience.
        
        // Reset previous systems so we only focus on the new one
        resetSystems();
        
        // Slight delay to allow the zoom animation to feel "connected" to the load
        setTimeout(async () => {
             const newSystem = await generateSystem({ centralBody: 'Any' });
             newSystem.semilla = seed.toString(); // Tag it with the galaxy particle ID
             addSystem(newSystem);
        }, 100);
       
    }, [addSystem, resetSystems]);

    if (viewMode === 'cards') {
        return (
            // Z-20 ensures it sits ABOVE the Console Footer (which is Z-10 in App.tsx)
            // Added bg-space-dark to ensure opacity so content doesn't bleed through
            <div className="w-full h-full overflow-y-auto custom-scrollbar pt-24 pb-8 px-4 md:px-8 relative z-20 bg-space-dark">
                <div className="container mx-auto">
                    {systems.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {systems.map((system) => (
                                <SystemCard key={system.id} system={system} onShowInWiki={onShowInWiki} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 pointer-events-none">
                             <div className="p-8 border border-white/5 rounded-full bg-slate-900/50 backdrop-blur-sm mb-4">
                                <span className="text-4xl opacity-50">🌌</span>
                             </div>
                            <p className="text-xl font-light tracking-widest mb-2 uppercase">No Telemetry Data</p>
                            <p className="text-xs font-mono text-slate-600">Initialize Hyperspace Jump or Generate System via Console.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 3D View Mode
    return (
        <div className="absolute inset-0 bg-black">
            {galaxyViewMode === 'GALAXY' ? (
                <GalaxyVisualizer onStarSelected={handleStarSelected} onGalaxyHyperjump={onGalaxyHyperjump} isPaused={isPaused} />
            ) : (
                systems.length > 0 ? (
                    <SystemVisualizer 
                        systems={systems} 
                        onObjectSelected={onObjectSelected3D} 
                        onBack={returnToGalaxy}
                        isPaused={isPaused}
                    />
                ) : (
                     // Fallback if state is weird
                    <GalaxyVisualizer onStarSelected={handleStarSelected} onGalaxyHyperjump={onGalaxyHyperjump} isPaused={isPaused} />
                )
            )}
        </div>
    );
};

export default SystemGenerator;
