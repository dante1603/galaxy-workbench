
import React from 'react';
import type { Sistema } from '../../types';
import { StatItem, GameplayInfoSection, WarningIcon, TargetIcon } from './common';

const ActivityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;

const SystemHeader: React.FC<{ system: Sistema; onDiagnose: () => void }> = ({ system, onDiagnose }) => {
    const { cuerpoCentral } = system;

    const DiagnoseButton = () => (
        <button 
            onClick={(e) => { e.stopPropagation(); onDiagnose(); }}
            className="flex items-center space-x-2 px-3 py-1 bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50 rounded text-xs font-bold uppercase tracking-wide transition-all mt-2 md:mt-0 group"
        >
            <ActivityIcon />
            <span className="group-hover:text-white transition-colors">Run Diagnostic</span>
        </button>
    );

    if (cuerpoCentral.tipo === 'ESTRELLA') {
        const star = cuerpoCentral;
        return (
            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-12 h-12 rounded-full border-2 border-white/20 flex-shrink-0 shadow-lg"
                            style={{ backgroundColor: star.colorHex, boxShadow: `0 0 20px 5px ${star.colorHex}44` }}
                            title={star.colorPrincipal}
                        ></div>
                        <div>
                            <h3 className="text-2xl font-bold text-white leading-none tracking-tight">{star.nombreProvisional}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="text-[10px] text-amber-400/80 uppercase font-bold tracking-wider">Stellar Body</span>
                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                <span className="text-[10px] text-slate-400 capitalize font-mono">Class {star.claseEstelar}</span>
                            </div>
                        </div>
                    </div>
                    <DiagnoseButton />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-white/5 rounded-md">
                    <StatItem label="Temp" value={star.temperaturaSuperficial} className="capitalize border-slate-700/30" />
                    <StatItem label="Mass" value={star.masaRelativa} className="capitalize border-slate-700/30" />
                    <StatItem label="Radius" value={star.radioRelativo} className="capitalize border-slate-700/30" />
                    <StatItem label="Lum" value={star.luminosidadRelativa} className="capitalize border-slate-700/30" />
                </div>

                <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GameplayInfoSection title="Systemic Hazards" items={star.peligros} icon={<WarningIcon />} colorClass="text-red-400" />
                    <GameplayInfoSection title="System Attractions" items={star.atractivosSistema} icon={<TargetIcon />} colorClass="text-cyan-400" />
                </div>
            </div>
        );
    }
    // Handle SpecialBody
    const body = cuerpoCentral;
    return (
        <div className="bg-black/20 p-4 rounded-lg border border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{body.nombre}</h3>
                    <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-widest">{body.tipo.replace(/_/g, ' ')}</p>
                </div>
                <DiagnoseButton />
            </div>
            
            {body.masaMs && <StatItem label="Mass" value={body.masaMs} unit="M☉" className="border-slate-700/30" />}
            {body.peligros && body.atractivosSistema && (
                 <div className="mt-4 pt-4 border-t border-slate-700/30 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GameplayInfoSection title="Systemic Hazards" items={body.peligros} icon={<WarningIcon />} colorClass="text-red-400" />
                    <GameplayInfoSection title="System Attractions" items={body.atractivosSistema} icon={<TargetIcon />} colorClass="text-cyan-400" />
                </div>
            )}
        </div>
    );
};

export default SystemHeader;
