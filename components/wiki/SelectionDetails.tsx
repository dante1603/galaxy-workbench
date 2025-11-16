import React from 'react';
import type { Estrella, ObjetoOrbital, CuerpoEspecial, CargaUtilPlaneta } from '../../types';
import { StatItem, GameplayInfoSection, WarningIcon, TargetIcon, PlanetTypeBadge, CrystalIcon, CRYSTAL_COLORS } from '../starcards/common';

interface SelectionDetailsProps {
    data: Estrella | ObjetoOrbital | CuerpoEspecial;
}

const renderStarDetails = (star: Estrella) => (
    <>
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-xl font-bold text-white">{star.nombreProvisional}</h3>
                <p className="text-sm text-amber-400/80 capitalize">{star.tipoBase.replace(/_/g, ' ')}</p>
            </div>
             <div
                className="w-10 h-10 rounded-full border-2 border-slate-600"
                style={{ backgroundColor: star.colorHex, boxShadow: `0 0 12px 2px ${star.colorHex}66` }}
                title={star.colorPrincipal}
            ></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <StatItem label="Temperature" value={star.temperaturaSuperficial} className="capitalize" />
            <StatItem label="Mass" value={star.masaRelativa} className="capitalize" />
            <StatItem label="Radius" value={star.radioRelativo} className="capitalize" />
            <StatItem label="Luminosity" value={star.luminosidadRelativa} className="capitalize" />
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-6">
            <GameplayInfoSection title="Systemic Hazards" items={star.peligros} icon={<WarningIcon />} colorClass="text-red-400" />
            <GameplayInfoSection title="System Attractions" items={star.atractivosSistema} icon={<TargetIcon />} colorClass="text-cyan-400" />
        </div>
    </>
);

const renderPlanetDetails = (planet: ObjetoOrbital) => {
    if (planet.tipo !== 'PLANETA') {
        return <div>Información no disponible para este tipo de objeto.</div>;
    }
    const payload = planet.cargaUtil;
    const avgTemp = (payload.rangoTemperaturaC[0] + payload.rangoTemperaturaC[1]) / 2;
    const avgHumidity = (payload.rangoHumedad[0] + payload.rangoHumedad[1]) / 2;

    return (
        <>
             <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-bold text-white">{payload.tituloTipoPlaneta}</h3>
                <PlanetTypeBadge type={payload.tipoPlaneta} />
            </div>
            <p className="text-sm text-cyan-400/80 mb-4">Planeta</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <StatItem label="Avg. Temp" value={avgTemp.toFixed(0)} unit="°C" />
                <StatItem label="Avg. Humidity" value={`${(avgHumidity * 100).toFixed(0)}%`} />
                <StatItem label="Atmosphere" value={payload.tipoAtmosfera} className="capitalize" />
                <StatItem label="Gravity" value={payload.gravedad} className="capitalize" />
                <StatItem label="Life Density" value={payload.densidadVida} className="capitalize" />
            </div>
             {payload.cristales && payload.cristales.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <h4 className="text-sm font-bold text-slate-300 mb-2">Cristales Detectados</h4>
                     <div className="flex flex-wrap gap-2">
                        {payload.cristales.map(crystal => (
                           <div key={crystal.tipo} className="flex items-center space-x-2 text-xs font-semibold p-1 bg-space-dark/40 rounded-md" style={{ color: CRYSTAL_COLORS[crystal.tipo] }}>
                                <CrystalIcon/>
                                <span className="capitalize">{crystal.tipo}</span>
                                <span className="text-slate-400 font-mono">{(crystal.pureza * 100).toFixed(0)}%</span>
                           </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

const renderSpecialBodyDetails = (body: CuerpoEspecial) => (
    <>
        <h3 className="text-xl font-bold text-white">{body.nombre}</h3>
        <p className="text-sm text-cyan-400/80">{body.tipo.replace(/_/g, ' ')}</p>
        {body.masaMs && <StatItem label="Mass" value={body.masaMs} unit="M☉" />}
        {body.spin && <StatItem label="Spin" value={body.spin} />}
        {body.periodoSpinMs && <StatItem label="Spin Period" value={body.periodoSpinMs} unit="ms" />}
        {body.campoMagneticoT && <StatItem label="Magnetic Field" value={body.campoMagneticoT.toExponential(1)} unit="T" />}
    </>
);

const SelectionDetails: React.FC<SelectionDetailsProps> = ({ data }) => {
    const renderContent = () => {
        switch (data.tipo) {
            case 'ESTRELLA':
                return renderStarDetails(data as Estrella);
            case 'PLANETA':
                return renderPlanetDetails(data as ObjetoOrbital);
            case 'AGUJERO_NEGRO':
            case 'PULSAR':
                return renderSpecialBodyDetails(data as CuerpoEspecial);
            default:
                return <div>Objeto desconocido seleccionado.</div>;
        }
    };

    return (
        <div className="p-4 h-full overflow-y-auto">
            <div className="bg-space-light/50 p-4 rounded-lg border border-slate-700">
                {renderContent()}
            </div>
        </div>
    );
};

export default SelectionDetails;