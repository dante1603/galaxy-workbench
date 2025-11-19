
import React, { useMemo } from 'react';
import type { WikiTab } from '../../hooks/useWikiData';
import type { 
    ReinoAnimal, Dieta, TamanoFauna, Locomocion, TipoCristal, 
    CategoriaBiome, OrigenMaterial 
} from '../../types';
import { CRYSTAL_COLORS } from '../starcards/common';

// --- Icons ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ChevronDownIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>;
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

interface WikiFiltersProps {
    activeTab: WikiTab;
    allData: any;
    filters: any;
    setters: any;
    openFilter: string | null;
    setOpenFilter: (key: string | null) => void;
    onOpenCreator: () => void;
}

interface OptionItem {
    value: string;
    label: string;
    color?: string;
}

const WikiFilters: React.FC<WikiFiltersProps> = ({
    activeTab,
    allData,
    filters,
    setters,
    openFilter,
    setOpenFilter,
    onOpenCreator
}) => {
    
    // --- Derived Data for Options ---
    const animalKingdoms: ReinoAnimal[] = useMemo(() => [...new Set<ReinoAnimal>(allData.allFauna.map((f: any) => f.reino))].sort(), [allData.allFauna]);
    const diets: Dieta[] = useMemo(() => [...new Set<Dieta>(allData.allFauna.map((f: any) => f.dieta))].sort(), [allData.allFauna]);
    const sizes: TamanoFauna[] = ['diminuto', 'pequeno', 'medio', 'grande', 'muy_grande', 'colosal'];
    const locomotions: Locomocion[] = useMemo(() => [...new Set<Locomocion>(allData.allFauna.map((f: any) => f.locomocion))].sort(), [allData.allFauna]);
    
    const crystalTypes: TipoCristal[] = Object.keys(CRYSTAL_COLORS) as TipoCristal[];
    const biomeCategories: CategoriaBiome[] = useMemo(() => [...new Set<CategoriaBiome>(allData.allBiomes.map((b: any) => b.categoria))].sort(), [allData.allBiomes]);
    const materialOrigins: OrigenMaterial[] = ['vegetal', 'animal', 'mineral'];
    
    // New Derived Data
    const plantStructures: string[] = useMemo(() => [...new Set<string>(allData.allPlants.map((p: any) => p.estructura))].sort(), [allData.allPlants]);
    const plantFoliages: string[] = useMemo(() => [...new Set<string>(allData.allPlants.map((p: any) => p.follaje))].sort(), [allData.allPlants]);
    const mineralRarities: string[] = useMemo(() => [...new Set<string>(allData.allMinerals.map((m: any) => m.rareza))].sort(), [allData.allMinerals]);
    const materialRarities: string[] = useMemo(() => [...new Set<string>(allData.allMaterials.map((m: any) => m.rareza))].sort(), [allData.allMaterials]);
    const effectTypes: string[] = useMemo(() => [...new Set<string>(allData.allEffects.map((e: any) => e.tipoEfecto))].sort(), [allData.allEffects]);
    const weaponTypes: string[] = useMemo(() => [...new Set<string>(allData.allWeapons.map((w: any) => w.tipoArma))].sort(), [allData.allWeapons]);
    const toolTypes: string[] = useMemo(() => [...new Set<string>(allData.allTools.map((t: any) => t.tipoHerramienta))].sort(), [allData.allTools]);
    const speciesDiets: string[] = useMemo(() => [...new Set<string>(allData.allSpecies.map((s: any) => s.metabolismo.dieta))].sort(), [allData.allSpecies]);

    // --- Helpers ---
    
    // Determines which options to show based on the currently open filter key
    const getActiveOptions = (): { options: OptionItem[], setter: (val: string) => void, current: string } | null => {
        switch (openFilter) {
            // Fauna
            case 'reino': return { options: animalKingdoms.map(k => ({ value: k, label: k.replace(/_/g, ' ') })), setter: setters.setFaunaFilter, current: filters.faunaFilter };
            case 'dieta': return { options: diets.map(d => ({ value: d, label: d })), setter: setters.setDietaFilter, current: filters.dietaFilter };
            case 'tamano': return { options: sizes.map(s => ({ value: s, label: s.replace(/_/g, ' ') })), setter: setters.setTamanoFilter, current: filters.tamanoFilter };
            case 'locomocion': return { options: locomotions.map(l => ({ value: l, label: l.replace(/_/g, ' ') })), setter: setters.setLocomotionFilter, current: filters.locomotionFilter };
            
            // Crystal
            case 'crystal': return { options: crystalTypes.map(c => ({ value: c, label: c.toLowerCase(), color: CRYSTAL_COLORS[c] })), setter: setters.setCrystalFilter, current: filters.crystalFilter };
            
            // Biome
            case 'biome': return { options: biomeCategories.map(b => ({ value: b, label: b.replace(/_/g, ' ').toLowerCase() })), setter: setters.setBiomeFilter, current: filters.biomeFilter };
            
            // Material
            case 'material': return { options: materialOrigins.map(o => ({ value: o, label: o })), setter: setters.setMaterialFilter, current: filters.materialFilter };
            case 'matRarity': return { options: materialRarities.map(r => ({ value: r, label: r })), setter: setters.setMaterialRarityFilter, current: filters.materialRarityFilter };

            // Flora
            case 'floraStructure': return { options: plantStructures.map(s => ({ value: s, label: s.replace(/_/g, ' ') })), setter: setters.setFloraStructureFilter, current: filters.floraStructureFilter };
            case 'floraFoliage': return { options: plantFoliages.map(f => ({ value: f, label: f.replace(/_/g, ' ') })), setter: setters.setFloraFoliageFilter, current: filters.floraFoliageFilter };
            
            // Minerals
            case 'mineralRarity': return { options: mineralRarities.map(r => ({ value: r, label: r })), setter: setters.setMineralRarityFilter, current: filters.mineralRarityFilter };
            
            // Effects
            case 'effectType': return { options: effectTypes.map(t => ({ value: t, label: t })), setter: setters.setEffectTypeFilter, current: filters.effectTypeFilter };
            
            // Weapons
            case 'weaponType': return { options: weaponTypes.map(w => ({ value: w, label: w.replace(/_/g, ' ') })), setter: setters.setWeaponTypeFilter, current: filters.weaponTypeFilter };
            
            // Tools
            case 'toolType': return { options: toolTypes.map(t => ({ value: t, label: t.replace(/_/g, ' ') })), setter: setters.setToolTypeFilter, current: filters.toolTypeFilter };
            
            // Species
            case 'speciesDiet': return { options: speciesDiets.map(d => ({ value: d, label: d })), setter: setters.setSpeciesDietFilter, current: filters.speciesDietFilter };
            
            default: return null;
        }
    };

    const activeConfig = getActiveOptions();

    // --- Render Components ---

    const FilterPill = ({ filterKey, label, currentValue }: { filterKey: string, label: string, currentValue: string }) => {
        const isOpen = openFilter === filterKey;
        const isActive = currentValue !== 'all';
        
        return (
            <button
                onClick={() => setOpenFilter(isOpen ? null : filterKey)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-200 ${
                    isOpen 
                        ? 'bg-accent-cyan text-space-dark border-accent-cyan shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                    : isActive 
                        ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/50' 
                        : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-200'
                }`}
            >
                <span>{label}</span>
                {isActive && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase max-w-[80px] truncate ${isOpen ? 'bg-black/20 text-space-dark' : 'bg-accent-cyan/20 text-accent-cyan'}`}>
                        {currentValue.replace(/_/g, ' ')}
                    </span>
                )}
                <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        );
    };

    return (
        <div className="bg-black/20 rounded-lg border border-white/5 overflow-hidden transition-all duration-300">
            
            {/* Top Bar: Actions & Filter Pills */}
            <div className="flex items-center gap-2 p-2 overflow-x-auto no-scrollbar">
                {activeTab === 'Fauna' && (
                    <>
                        <button 
                            onClick={onOpenCreator} 
                            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-md transition-colors text-xs uppercase tracking-wide"
                            title="Registrar nuevo espécimen"
                        >
                            <PlusIcon />
                            <span className="hidden sm:inline">Nuevo</span>
                        </button>
                        <div className="h-6 w-px bg-white/10 flex-shrink-0 mx-1"></div>
                    </>
                )}

                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mr-1 flex-shrink-0">
                    <FilterIcon />
                </div>
                
                {/* --- Tab Specific Pills --- */}
                
                {activeTab === 'Fauna' && (
                    <>
                        <FilterPill filterKey="reino" label="Reino" currentValue={filters.faunaFilter} />
                        <FilterPill filterKey="dieta" label="Dieta" currentValue={filters.dietaFilter} />
                        <FilterPill filterKey="tamano" label="Tamaño" currentValue={filters.tamanoFilter} />
                        <FilterPill filterKey="locomocion" label="Locomoción" currentValue={filters.locomotionFilter} />
                    </>
                )}

                {activeTab === 'Flora' && (
                    <>
                        <FilterPill filterKey="floraStructure" label="Estructura" currentValue={filters.floraStructureFilter} />
                        <FilterPill filterKey="floraFoliage" label="Follaje" currentValue={filters.floraFoliageFilter} />
                    </>
                )}
                
                {activeTab === 'Cristales' && (
                    <FilterPill filterKey="crystal" label="Tipo" currentValue={filters.crystalFilter} />
                )}
                
                {activeTab === 'Biomas' && (
                    <FilterPill filterKey="biome" label="Categoría" currentValue={filters.biomeFilter} />
                )}
                
                {activeTab === 'Materiales' && (
                    <>
                        <FilterPill filterKey="material" label="Origen" currentValue={filters.materialFilter} />
                        <FilterPill filterKey="matRarity" label="Rareza" currentValue={filters.materialRarityFilter} />
                    </>
                )}

                {(activeTab === 'Consumibles') && (
                    <FilterPill filterKey="matRarity" label="Rareza" currentValue={filters.materialRarityFilter} />
                )}

                {activeTab === 'Minerales' && (
                    <FilterPill filterKey="mineralRarity" label="Rareza" currentValue={filters.mineralRarityFilter} />
                )}

                {activeTab === 'Efectos' && (
                    <FilterPill filterKey="effectType" label="Tipo" currentValue={filters.effectTypeFilter} />
                )}

                {activeTab === 'Armas' && (
                    <FilterPill filterKey="weaponType" label="Tipo" currentValue={filters.weaponTypeFilter} />
                )}

                {activeTab === 'Herramientas' && (
                    <FilterPill filterKey="toolType" label="Tipo" currentValue={filters.toolTypeFilter} />
                )}

                {activeTab === 'Especies' && (
                    <FilterPill filterKey="speciesDiet" label="Dieta" currentValue={filters.speciesDietFilter} />
                )}

            </div>

            {/* Options Panel (Collapsible) */}
            <div className={`bg-slate-900/80 backdrop-blur-sm border-t border-white/10 shadow-inner transition-all duration-300 ease-in-out overflow-hidden ${activeConfig ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                {activeConfig && (
                    <div className="p-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Seleccionar Opción</span>
                            <button 
                                onClick={() => setOpenFilter(null)}
                                className="text-slate-500 hover:text-white"
                            >
                                <XIcon />
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => { activeConfig.setter('all'); setOpenFilter(null); }}
                                className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                                    activeConfig.current === 'all'
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                                }`}
                            >
                                Todos
                            </button>

                            {activeConfig.options.map((opt) => {
                                const isSelected = activeConfig.current === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => { activeConfig.setter(opt.value); setOpenFilter(null); }}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium border transition-colors capitalize ${
                                            isSelected
                                            ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan'
                                            : 'bg-slate-800 text-slate-300 border-transparent hover:border-slate-600 hover:bg-slate-700'
                                        }`}
                                    >
                                        {opt.color && (
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color, boxShadow: `0 0 5px ${opt.color}` }}></span>
                                        )}
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default WikiFilters;
