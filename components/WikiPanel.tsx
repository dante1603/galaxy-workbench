
import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { useWikiData, WikiTab } from '../hooks/useWikiData';
import WikiFilterGroup from './wiki/WikiFilterGroup';
import WikiItemCard from './wiki/WikiItemCard';
import CreateFaunaForm from './wiki/CreateFaunaForm';
import CraftingGrid from './wiki/CraftingGrid';
import SelectionDetails from './wiki/SelectionDetails';
// FIX: Use correct Spanish type names from types.ts
import type { EspecieInteligente, TipoCristal, ReinoAnimal, CategoriaBiome, Dieta, TamanoFauna, OrigenMaterial, Material, Locomocion, Receta, Arma, Herramienta, Jugador, Estrella, ObjetoOrbital, CuerpoEspecial } from '../types';

interface WikiPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialTarget?: { type: string; id: string } | null;
  selection3D?: Estrella | ObjetoOrbital | CuerpoEspecial | null;
  allSpecies: EspecieInteligente[];
  allMaterials: Material[];
  onUpdateSpeciesImage: (speciesId: string, imageUrl: string) => void;
}

const CRYSTAL_COLORS: Record<TipoCristal, string> = {
  FUEGO: '#ef4444',
  ELECTRICO: '#f59e0b',
  HIELO: '#38bdf8',
  MAGICO: '#a855f7',
  LUZ: '#f1f5f9',
  GRAVEDAD: '#475569',
  RADIOACTIVO: '#4ade80',
};

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

type ActiveTabType = WikiTab | 'Selection';

const WikiPanel: React.FC<WikiPanelProps> = ({ isOpen, onClose, initialTarget, selection3D, allSpecies, allMaterials, onUpdateSpeciesImage }) => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('Jugador');

  const {
    isLoading,
    openFilter,
    setOpenFilter,
    filteredData,
    filters,
    setters,
    allData,
    addFauna
  } = useWikiData(isOpen, allSpecies, activeTab as WikiTab);
  
  const [isCreating, setIsCreating] = useState(false);
  const lastScrollTop = useRef(0);
  const headerTranslateY = useRef(0);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const [filterHeight, setFilterHeight] = useState(0);

  useEffect(() => {
      if (isOpen && selection3D) {
        setActiveTab('Selection');
      } else if (isOpen && !isLoading && initialTarget) {
          const tabMap: Record<string, WikiTab> = {
              Fauna: 'Fauna', Flora: 'Flora', Mineral: 'Minerales', Cristal: 'Cristales',
              Material: 'Materiales', Biome: 'Biomas', Especie: 'Especies', Player: 'Jugador',
              Effect: 'Efectos'
          };
          const targetTab = tabMap[initialTarget.type];
          if (targetTab && targetTab !== activeTab) {
              setActiveTab(targetTab);
          }
          setTimeout(() => {
              const element = document.getElementById(`wiki-item-${initialTarget.id}`);
              if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  element.classList.add('highlight');
                  setTimeout(() => element.classList.remove('highlight'), 2000);
              }
          }, 100);
      } else if (!isOpen) {
        setActiveTab('Jugador'); // Reset on close
      }
  }, [isOpen, isLoading, initialTarget, selection3D]);
  
  useEffect(() => {
    if (!isOpen) {
      setIsCreating(false);
    }
  }, [isOpen]);
  
  useLayoutEffect(() => {
    if (filterContainerRef.current) {
        setFilterHeight(filterContainerRef.current.offsetHeight);
    }
  }, [isLoading, activeTab, filters, openFilter, selection3D]);

  const handleScroll = useCallback(() => {
    const container = scrollableContainerRef.current;
    const header = filterContainerRef.current;

    if (!container || !header || filterHeight === 0) return;

    const currentScrollTop = container.scrollTop;
    
    if (currentScrollTop <= 0) {
        header.style.transform = 'translateY(0px)';
        headerTranslateY.current = 0;
        lastScrollTop.current = 0;
        return;
    }
    
    const scrollDelta = currentScrollTop - lastScrollTop.current;
    
    let newTranslateY = headerTranslateY.current - scrollDelta;
    newTranslateY = Math.max(-filterHeight, Math.min(0, newTranslateY));
    
    header.style.transform = `translateY(${newTranslateY}px)`;
    headerTranslateY.current = newTranslateY;
    lastScrollTop.current = currentScrollTop;
  }, [filterHeight]);

  const baseTabs: WikiTab[] = [
    'Jugador', 'Especies', 'Fauna', 'Flora', 'Biomas', 'Minerales', 
    'Cristales', 'Materiales', 'Efectos', 'Armas', 'Herramientas', 'Crafteo'
  ];
  const tabs: ActiveTabType[] = selection3D ? ['Selection', ...baseTabs] : baseTabs;
  
  // FIX: The type for contentMap values included 'Crafteo', which is not a valid type for the WikiItemCard component's 'type' prop.
  // By mapping 'Crafteo' to undefined, we ensure that `currentItemType` will be undefined for the 'Crafteo' tab.
  // This makes the type of `currentItemType` compatible with what `WikiItemCard` expects, and the conditional rendering
  // already handles the case where `currentItemType` is falsy.
  const contentMap: Record<WikiTab, 'Jugador' | 'Especie' | 'Fauna' | 'Flora' | 'Mineral' | 'Cristal' | 'Material' | 'Biome' | 'Efecto' | 'Arma' | 'Herramienta' | undefined> = {
    'Jugador': 'Jugador', 'Especies': 'Especie', 'Fauna': 'Fauna', 'Flora': 'Flora', 'Minerales': 'Mineral', 
    'Cristales': 'Cristal', 'Materiales': 'Material', 'Biomas': 'Biome', 'Efectos': 'Efecto', 'Armas': 'Arma',
    'Herramientas': 'Herramienta', 'Crafteo': undefined
  };
  const currentItemType = activeTab !== 'Selection' ? contentMap[activeTab] : undefined;

  const animalKingdoms: ReinoAnimal[] = [...new Set<ReinoAnimal>(allData.allFauna.map(f => f.reino))].sort();
  const diets: Dieta[] = [...new Set<Dieta>(allData.allFauna.map(f => f.dieta))].sort();
  const sizes: TamanoFauna[] = ['diminuto', 'pequeno', 'medio', 'grande', 'muy_grande', 'colosal'];
  const locomotions: Locomocion[] = [...new Set<Locomocion>(allData.allFauna.map(f => f.locomocion))].sort();
  const crystalTypes: TipoCristal[] = Object.keys(CRYSTAL_COLORS) as TipoCristal[];
  const biomeCategories: CategoriaBiome[] = [...new Set<CategoriaBiome>(allData.allBiomes.map(b => b.categoria))];
  const materialOrigins: OrigenMaterial[] = ['vegetal', 'animal', 'mineral'];

  const handleOpenCreator = () => {
    setActiveTab('Fauna');
    setIsCreating(true);
  };
  
  const renderMainContent = () => (
    <div className="relative flex-1 overflow-hidden">
        <div ref={filterContainerRef} className="w-full absolute top-0 left-0 z-10 bg-space-mid" style={{ willChange: 'transform' }}>
             <div className="flex-shrink-0 p-2 border-b border-slate-700">
                <nav className="flex space-x-1 flex-wrap">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setOpenFilter(null); }}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 mb-1 ${
                        activeTab === tab ? 'bg-accent-cyan text-space-dark font-bold' : 'text-slate-300 hover:bg-space-light/50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
                {activeTab !== 'Selection' && (
                  <div className="mt-2 pt-2 border-t border-slate-700/50">
                    {!isLoading && (
                      <div className="bg-space-light/30 rounded-md">
                        {activeTab === 'Fauna' && (
                          <div className="flex flex-col">
                            <div className="p-2">
                              <button onClick={handleOpenCreator} className="w-full flex items-center justify-center space-x-2 bg-accent-cyan/20 text-accent-cyan font-bold py-2 px-4 rounded-md hover:bg-accent-cyan/30 transition-colors duration-200">
                                <PlusIcon />
                                <span>Crear Nueva Criatura</span>
                              </button>
                            </div>
                            <WikiFilterGroup filterKey="reino" title="Filtrar por Reino" currentValue={filters.faunaFilter} setter={setters.setFaunaFilter} options={animalKingdoms.map(k => ({ value: k, label: k.replace(/_/g, ' ') }))} openFilter={openFilter} setOpenFilter={setOpenFilter} />
                            <WikiFilterGroup filterKey="dieta" title="Filtrar por Dieta" currentValue={filters.dietaFilter} setter={setters.setDietaFilter} options={diets.map(d => ({ value: d, label: d }))} openFilter={openFilter} setOpenFilter={setOpenFilter} />
                            <WikiFilterGroup filterKey="tamano" title="Filtrar por Tamaño" currentValue={filters.tamanoFilter} setter={setters.setTamanoFilter} options={sizes.map(s => ({ value: s, label: s.replace(/_/g, ' ') }))} openFilter={openFilter} setOpenFilter={setOpenFilter} />
                            <WikiFilterGroup filterKey="locomocion" title="Filtrar por Locomoción" currentValue={filters.locomotionFilter} setter={setters.setLocomotionFilter} options={locomotions.map(l => ({ value: l, label: l.replace(/_/g, ' ') }))} openFilter={openFilter} setOpenFilter={setOpenFilter} />
                          </div>
                        )}
                        {activeTab === 'Cristales' && <WikiFilterGroup filterKey="crystal" title="Filtrar por Tipo" currentValue={filters.crystalFilter} setter={setters.setCrystalFilter} options={crystalTypes.map(c => ({ value: c, label: c.toLowerCase(), color: CRYSTAL_COLORS[c] }))} openFilter={openFilter} setOpenFilter={setOpenFilter} />}
                        {activeTab === 'Biomas' && <WikiFilterGroup filterKey="biome" title="Filtrar por Categoría" currentValue={filters.biomeFilter} setter={setters.setBiomeFilter} options={biomeCategories.map(c => ({ value: c, label: c.replace(/_/g, ' ').toLowerCase() }))} openFilter={openFilter} setOpenFilter={setOpenFilter} />}
                        {activeTab === 'Materiales' && <WikiFilterGroup filterKey="material" title="Filtrar por Origen" currentValue={filters.materialFilter} setter={setters.setMaterialFilter} options={materialOrigins.map(o => ({ value: o, label: o }))} openFilter={openFilter} setOpenFilter={setOpenFilter} />}
                      </div>
                    )}
                  </div>
                )}
              </div>
        </div>
        <div ref={scrollableContainerRef} onScroll={handleScroll} className="absolute inset-0 w-full h-full overflow-y-auto" style={{ paddingTop: filterHeight }}>
          {isLoading ? (
            <div className="text-center py-12 text-slate-500 p-4"><p>Cargando glosario...</p></div>
          ) : activeTab === 'Selection' && selection3D ? (
            <SelectionDetails data={selection3D} />
          ) : activeTab === 'Crafteo' ? (
            <div className="p-4">
              <CraftingGrid recipes={filteredData as Receta[]} allItems={[...allData.allMaterials, ...allData.allWeapons, ...allData.allTools]} />
            </div>
          ) : filteredData.length > 0 && currentItemType ? (
            <div className="p-4 space-y-3">
              {filteredData.map(item => (
                <WikiItemCard
                  key={item.id}
                  item={item}
                  type={currentItemType}
                  onUpdateSpeciesImage={onUpdateSpeciesImage}
                  allFauna={allData.allFauna}
                  allPlants={allData.allPlants}
                  allMinerals={allData.allMinerals}
                  allMaterials={allData.allMaterials}
                  allSpecies={allData.allSpecies}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 p-4">
              <p>No hay entradas disponibles</p>
              <p className="text-sm">Prueba a cambiar o reiniciar los filtros.</p>
            </div>
          )}
        </div>
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div
        className={`relative z-10 w-full max-w-lg h-full bg-space-mid/95 border-l border-slate-700 shadow-2xl float-right transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white">{isCreating ? 'Crear Criatura' : 'Glosario de Entidades'}</h2>
            <button
              onClick={isCreating ? () => setIsCreating(false) : onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-space-light"
              aria-label={isCreating ? "Back to glossary" : "Close glossary"}
            >
              <CloseIcon />
            </button>
          </div>
          
          {isCreating ? (
            <CreateFaunaForm 
              onClose={() => setIsCreating(false)}
              onSave={addFauna}
              allMaterials={allMaterials}
            />
          ) : renderMainContent()}

        </div>
      </div>
    </div>
  );
};

export default WikiPanel;
