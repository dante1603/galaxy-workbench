
import React, { useState } from 'react';
import { useWorkbenchStore } from '../state/workbenchStore';
import { useStaticDataCtx } from '../context/StaticDataContext';
import type { ObjetoPlaneta, Bioma, ObjetoSubOrbitalPlaneta, Fauna, ArquetipoCristal, Planta, Mineral, TipoCristal, Cristal } from '../types';
import { PlanetTypeBadge, StatItem } from '../components/starcards/common';
import WikiItemCard from '../components/wiki/WikiItemCard';


const ChevronRightIcon = ({ className }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>;

const DetailCard: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-xl border border-white/10 h-fit hover:border-white/20 transition-colors shadow-lg">
        <h3 className="text-xs font-bold text-accent-cyan/70 uppercase tracking-widest mb-4 border-b border-white/5 pb-2 flex justify-between items-center">
            {title}
            <span className="w-2 h-2 bg-accent-cyan/50 rounded-full"></span>
        </h3>
        {children}
    </div>
);

const CompositionBar: React.FC<{ rock: number; metal: number; ice: number }> = ({ rock, metal, ice }) => (
    <div className="w-full flex rounded-sm overflow-hidden h-2 bg-space-dark my-2 ring-1 ring-white/10">
        <div className="bg-stone-500" style={{ width: `${rock * 100}%` }} title={`Rock: ${rock * 100}%`}></div>
        <div className="bg-sky-500" style={{ width: `${ice * 100}%` }} title={`Ice: ${ice * 100}%`}></div>
        <div className="bg-slate-400" style={{ width: `${metal * 100}%` }} title={`Metal: ${metal * 100}%`}></div>
    </div>
);

const SubOrbitItem: React.FC<{ item: ObjetoSubOrbitalPlaneta; allBiomes: Bioma[]; onShowInWiki: (type: string, id: string) => void }> = ({ item, allBiomes, onShowInWiki }) => {
    const icon = item.tipo === 'LUNA' ? '🌗' : '🪐';
    let details = '';
    let biome = null;
    if (item.tipo === 'LUNA') {
        details = `${item.cargaUtil.nombre} (${item.cargaUtil.tipo})`;
        biome = allBiomes.find(b => b.id === item.cargaUtil.biomeId);
    } else { // ANILLO
        details = `Anillo ${item.cargaUtil.densidad} de ${item.cargaUtil.composicion}`;
    }
    return (
        <div className="text-sm text-slate-300 p-2 bg-white/5 rounded border border-white/5 mb-2">
            <div className="flex items-center">
                <span className="mr-2 opacity-70">{icon}</span>
                <span className="capitalize font-medium">{details}</span>
            </div>
            {biome && (
                <div className="pl-6 mt-2">
                    <button 
                        onClick={() => onShowInWiki('Biome', biome!.id)}
                        className="text-[10px] uppercase font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded hover:bg-accent-cyan/20 hover:text-accent-cyan transition-colors border border-white/5"
                    >
                       Biome: {biome.nombre}
                    </button>
                </div>
            )}
        </div>
    );
};

interface ResourceListButtonProps {
    title: string;
    items: ({ nombre: string } | { tipo: TipoCristal })[];
    onClick: () => void;
    allCrystals?: ArquetipoCristal[]; 
}

const ResourceListButton: React.FC<ResourceListButtonProps> = ({ title, items, onClick, allCrystals }) => {
    if (items.length === 0) {
        return (
            <div className="w-full flex justify-between items-center text-left bg-white/5 px-4 py-3 rounded-lg border border-transparent opacity-50">
                <span className="font-semibold text-slate-500 text-sm">{title}</span>
                <span className="text-[10px] text-slate-600 uppercase">No Data</span>
            </div>
        );
    }

    const getItemName = (item: { nombre?: string; tipo?: string }): string => {
        if (item.nombre) return item.nombre;
        if (item.tipo && allCrystals) { // It's a crystal instance
            const archetype = allCrystals.find(c => c.tipoCristal === item.tipo);
            return archetype?.nombre || item.tipo.toLowerCase();
        }
        return 'Unknown Item';
    };

    return (
        <button onClick={onClick} className="w-full text-left bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-accent-cyan/50 p-4 rounded-xl transition-all group hover:shadow-lg hover:shadow-cyan-900/20">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wide group-hover:text-white">{title}</h4>
                    <p className="text-xs text-slate-400 mt-1 pr-4 font-mono truncate">
                        {items.map(getItemName).join(', ')}
                    </p>
                </div>
                <ChevronRightIcon className="flex-shrink-0 text-slate-600 group-hover:text-accent-cyan transition-colors" />
            </div>
        </button>
    );
};


interface PlanetMapEditorProps {
  onShowInWiki: (type: string, id: string) => void;
}

/**
 * A tool for viewing the detailed properties of a selected planet.
 */
const PlanetMapEditor: React.FC<PlanetMapEditorProps> = ({ onShowInWiki }) => {
  const { systems, selectedPlanetId, setActiveTool } = useWorkbenchStore();
  const { fauna: allFauna, crystals: allCrystals, plants: allPlants, minerals: allMinerals, biomes: allBiomes, handleUpdateSpeciesImage } = useStaticDataCtx();
  
  const [detailViewInfo, setDetailViewInfo] = useState<{title: string, items: { id?: string; tipo?: string; nombre?: string; [key: string]: unknown }[], wikiType: string} | null>(null);

  const selectedPlanet = systems
    .flatMap(s => s.orbitas.flatMap(o => o.objetos))
    .find(obj => obj.id === selectedPlanetId);

  const renderPlanetDetails = (planet: ObjetoPlaneta) => {
    const payload = planet.cargaUtil;
    
    // --- STATE 2: List view of a resource category (shows full WikiItemCards) ---
    if (detailViewInfo) {
        const getWikiId = (item: { id?: string; tipo?: string }, type: string) => {
            if (type === 'Cristal' && item.tipo) {
                // The item here should already be the enriched archetype
                return item.id || allCrystals.find(c => c.tipoCristal === item.tipo)?.id || item.tipo;
            }
            return item.id || '';
        };

        return (
            <div className="h-full flex flex-col animate-fade-in">
                <div className="p-1 flex-shrink-0 flex items-center gap-4 mb-6">
                    <button onClick={() => setDetailViewInfo(null)} className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase text-slate-300 hover:text-white transition-colors">
                        ← Return
                    </button>
                    <h3 className="text-xl font-bold text-white tracking-wide">{detailViewInfo.title}</h3>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-3 custom-scrollbar">
                    {detailViewInfo.items.map(item => (
                        <div 
                            key={item.id || item.tipo}
                            onClick={() => onShowInWiki(detailViewInfo.wikiType, getWikiId(item, detailViewInfo.wikiType))}
                            className="cursor-pointer group"
                            role="button"
                            tabIndex={0}
                        >
                            <WikiItemCard
                                item={item as unknown as Bioma | Fauna | Planta | Mineral | Cristal}
                                type={detailViewInfo.wikiType as 'Bioma' | 'Fauna' | 'Planta' | 'Mineral' | 'Cristal'}
                                onUpdateSpeciesImage={handleUpdateSpeciesImage}
                                onEdit={() => {}} // Read-only in this view
                                onDelete={() => {}} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    // --- STATE 1: Main inspector view ---
    const avgTemp = (payload.rangoTemperaturaC[0] + payload.rangoTemperaturaC[1]) / 2;
    const avgHumidity = (payload.rangoHumedad[0] + payload.rangoHumedad[1]) / 2;
    
    // Ecosystem Logic for Display
    let activeFlora: Planta[] = [];
    let activeFauna: Fauna[] = [];
    let activeMinerals: Mineral[] = [];

    if (payload.ecosistema) {
        // Use the generated ecosystem if available
        const e = payload.ecosistema;
        const floraIds = [...e.flora.arboles, ...e.flora.arbustos, ...e.flora.cobertura, ...e.flora.especiales];
        const faunaIds = [...e.fauna.depredadoresApex, ...e.fauna.depredadoresPequenos, ...e.fauna.presasGrandes, ...e.fauna.presasMedianas, ...e.fauna.presasPequenas, ...e.fauna.carroneros];
        
        activeFlora = floraIds.map(id => allPlants.find(p => p.id === id)).filter(Boolean) as Planta[];
        activeFauna = faunaIds.map(id => allFauna.find(f => f.id === id)).filter(Boolean) as Fauna[];
        activeMinerals = e.minerales.map(id => allMinerals.find(m => m.id === id)).filter(Boolean) as Mineral[];
    } else {
        // Fallback to old logic if ecosystem is missing (backward compatibility)
        activeFauna = [...new Set(payload.biomas.flatMap(b => b.faunaPosible))].map(id => allFauna.find(f=>f.id===id)).filter(Boolean) as Fauna[];
        activeFlora = [...new Set(payload.biomas.flatMap(b => b.floraPosible))].map(id => allPlants.find(p=>p.id===id)).filter(Boolean) as Planta[];
        activeMinerals = [...new Set(payload.biomas.flatMap(b => b.mineralesPosibles))].map(id => allMinerals.find(m=>m.id===id)).filter(Boolean) as Mineral[];
    }
    
    const crystalArchetypes = (payload.cristales || []).map(crystal => {
        const archetype = allCrystals.find(c => c.tipoCristal === crystal.tipo);
        return { 
            ...(archetype || {}), 
            ...crystal, 
            id: archetype?.id || crystal.tipo, 
            nombre: archetype?.nombre || crystal.tipo.toLowerCase()
        };
    });


    return (
        <div className="h-full overflow-y-auto p-1 animate-fade-in custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Stats */}
                <div className="lg:col-span-2 space-y-6">
                    <DetailCard title="Primary Telemetry">
                        <StatItem label="Atmosphere" value={payload.tipoAtmosfera} className="capitalize border-white/5" />
                        <StatItem label="Gravity" value={payload.gravedad} className="capitalize border-white/5" />
                        <StatItem label="Life Density" value={payload.densidadVida} className="capitalize border-white/5" />
                        <StatItem label="Avg. Temperature" value={avgTemp.toFixed(0)} unit="°C" className="border-white/5" />
                        <StatItem label="Avg. Humidity" value={`${(avgHumidity * 100).toFixed(0)}%`} className="border-white/5" />
                    </DetailCard>

                    <DetailCard title="Geological Composition">
                        <CompositionBar rock={payload.composicionGlobal.roca} metal={payload.composicionGlobal.metal} ice={payload.composicionGlobal.hielo} />
                        <div className="grid grid-cols-3 text-center text-xs text-slate-400 mt-3 font-mono">
                            <div>
                                <span className="block text-stone-400 font-bold">SILICATE</span>
                                {(payload.composicionGlobal.roca * 100).toFixed(0)}%
                            </div>
                            <div>
                                <span className="block text-sky-400 font-bold">ICE</span>
                                {(payload.composicionGlobal.hielo * 100).toFixed(0)}%
                            </div>
                            <div>
                                <span className="block text-slate-300 font-bold">METAL</span>
                                {(payload.composicionGlobal.metal * 100).toFixed(0)}%
                            </div>
                        </div>
                    </DetailCard>

                    {payload.subOrbitas.length > 0 && (
                        <DetailCard title="Satellites & Rings">
                            <div className="space-y-2">
                                {payload.subOrbitas.map(sub => <SubOrbitItem key={sub.id} item={sub} allBiomes={allBiomes} onShowInWiki={onShowInWiki} />)}
                            </div>
                        </DetailCard>
                    )}
                </div>

                {/* Right Column: Resources */}
                <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 mb-2">Detected Ecosystem</div>
                    <ResourceListButton title="Native Biomes" items={payload.biomas} onClick={() => setDetailViewInfo({title: 'Biomes on Planet', items: payload.biomas, wikiType: 'Biome'})} />
                    <ResourceListButton title="Fauna" items={activeFauna} onClick={() => setDetailViewInfo({title: 'Active Fauna', items: activeFauna, wikiType: 'Fauna'})} />
                    <ResourceListButton title="Flora" items={activeFlora} onClick={() => setDetailViewInfo({title: 'Active Flora', items: activeFlora, wikiType: 'Flora'})} />
                    <div className="h-px bg-white/5 my-2"></div>
                    <ResourceListButton title="Minerals" items={activeMinerals} onClick={() => setDetailViewInfo({title: 'Available Minerals', items: activeMinerals, wikiType: 'Mineral'})} />
                    <ResourceListButton title="Crystals" items={payload.cristales || []} allCrystals={allCrystals} onClick={() => setDetailViewInfo({title: 'Detected Crystals', items: crystalArchetypes, wikiType: 'Cristal'})} />
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="relative z-20 bg-space-dark w-full h-full overflow-y-auto custom-scrollbar pt-20 pb-32 px-4 md:px-8">
       <div className="container mx-auto h-full flex flex-col">
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex-shrink-0 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target Lock</h2>
                 {selectedPlanet && selectedPlanet.tipo === 'PLANETA' && (
                    <div className="flex items-center gap-4">
                        <p className="text-3xl font-bold text-white tracking-tight">{selectedPlanet.cargaUtil.tituloTipoPlaneta}</p>
                        <PlanetTypeBadge type={selectedPlanet.cargaUtil.tipoPlaneta} />
                    </div>
                 )}
              </div>
              <button
                onClick={() => {
                    setDetailViewInfo(null);
                    setActiveTool('SYSTEM_GENERATOR');
                }}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-accent-cyan/20 border border-white/10 hover:border-accent-cyan/50 text-sm font-bold uppercase tracking-wide text-slate-300 hover:text-accent-cyan transition-all"
              >
                ← System View
              </button>
            </div>
          </div>
            
          <div className="flex-grow mt-6">
            {selectedPlanet && selectedPlanet.tipo === 'PLANETA' ? (
              renderPlanetDetails(selectedPlanet as ObjetoPlaneta)
            ) : (
              <div className="text-center text-red-400 py-20 bg-slate-900/50 rounded-xl border border-red-500/20">
                <p className="font-mono uppercase tracking-widest">Signal Lost</p>
                <p className="text-sm opacity-70 mt-2">No planetary data stream available.</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default PlanetMapEditor;
