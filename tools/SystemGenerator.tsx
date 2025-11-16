import React from 'react';
import type { Sistema, Estrella, ObjetoOrbital, CuerpoEspecial } from '../types';
import { useWorkbenchStore } from '../state/workbenchStore';
import SystemCard from '../components/StarCard';
import SystemVisualizer from '../components/SystemVisualizer';

interface SystemGeneratorProps {
    onShowInWiki: (type: string, id: string) => void;
    onObjectSelected3D: (data: Estrella | ObjetoOrbital | CuerpoEspecial) => void;
    viewMode: 'cards' | '3d';
}

const SystemGenerator: React.FC<SystemGeneratorProps> = ({ onShowInWiki, onObjectSelected3D, viewMode }) => {
    const { systems } = useWorkbenchStore();

    return (
        <>
            {viewMode === '3d' ? (
                <div className="absolute inset-0">
                    {systems.length > 0 ? (
                        <SystemVisualizer systems={systems} onObjectSelected={onObjectSelected3D} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center text-slate-500">
                                <p className="text-2xl mb-2">No systems to visualize.</p>
                                <p>Click '+' to generate one first.</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="container mx-auto p-4 md:p-8 h-full">
                    <div className="h-full overflow-y-auto pb-24">
                        {systems.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                                {systems.map((system) => (
                                    <SystemCard key={system.id} system={system} onShowInWiki={onShowInWiki} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate-500">
                                <p className="text-2xl mb-2">No systems generated yet.</p>
                                <p>Click the '+' icon to begin your journey.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SystemGenerator;
