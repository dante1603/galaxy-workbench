import React from 'react';
import type { Sistema } from '../../types';
import { StatItem, GameplayInfoSection, WarningIcon, TargetIcon } from './common';

const SystemHeader: React.FC<{ system: Sistema }> = ({ system }) => {
    const { cuerpoCentral } = system;

    if (cuerpoCentral.tipo === 'ESTRELLA') {
        const star = cuerpoCentral;
        return (
            <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700">
                 <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">{star.nombreProvisional}</h3>
                        <p className="text-sm text-amber-400/80">Stellar Body</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="capitalize font-mono text-lg font-semibold text-white px-2 py-1 rounded bg-slate-900/50 border border-slate-700">
                        {star.tipoBase.replace(/_/g, ' ')}
                        </span>
                        <div
                        className="w-8 h-8 rounded-full border-2 border-slate-600"
                        style={{ backgroundColor: star.colorHex, boxShadow: `0 0 12px 2px ${star.colorHex}66` }}
                        title={star.colorPrincipal}
                        ></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <StatItem label="Temperature" value={star.temperaturaSuperficial} className="capitalize" />
                    <StatItem label="Mass" value={star.masaRelativa} className="capitalize" />
                    <StatItem label="Radius" value={star.radioRelativo} className="capitalize" />
                    <StatItem label="Luminosity" value={star.luminosidadRelativa} className="capitalize" />
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GameplayInfoSection title="Peligros Sistémicos" items={star.peligros} icon={<WarningIcon />} colorClass="text-red-400" />
                    <GameplayInfoSection title="Atractivos del Sistema" items={star.atractivosSistema} icon={<TargetIcon />} colorClass="text-cyan-400" />
                </div>
                 <div className="mt-4 border-t border-slate-700/50 pt-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-2">Paleta Espectral y Lumínica</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                      <StatItem label="Color Principal" value={star.colorPrincipal} className="capitalize" />
                      <StatItem label="Cielo Planetario" value={star.colorCieloPlanetario} className="capitalize" />
                      <StatItem label="Intensidad" value={star.intensidadColor} className="capitalize" />
                      <StatItem label="Iluminación" value={star.tipoIluminacion} className="capitalize" />
                    </div>
                    <StatItem label="Paleta Secundaria" value={star.colorSecundario.join(', ')} className="capitalize border-b-0" />
                </div>
            </div>
        );
    }
    // Handle SpecialBody
    const body = cuerpoCentral;
    return (
        <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700">
            <h3 className="text-xl font-bold text-white">{body.nombre}</h3>
            <p className="text-sm text-cyan-400/80">{body.tipo.replace(/_/g, ' ')}</p>
            {body.masaMs && <StatItem label="Mass" value={body.masaMs} unit="M☉" />}
            {body.peligros && body.atractivosSistema && (
                 <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GameplayInfoSection title="Peligros Sistémicos" items={body.peligros} icon={<WarningIcon />} colorClass="text-red-400" />
                    <GameplayInfoSection title="Atractivos del Sistema" items={body.atractivosSistema} icon={<TargetIcon />} colorClass="text-cyan-400" />
                </div>
            )}
        </div>
    );
};

export default SystemHeader;