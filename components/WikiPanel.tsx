
import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { useWikiData, WikiTab } from '../hooks/useWikiData';
import { useStaticDataCtx } from '../context/StaticDataContext';
import WikiItemCard from './wiki/WikiItemCard';
import CreateFaunaForm from './wiki/CreateFaunaForm';
import CraftingGrid from './wiki/CraftingGrid';
import SelectionDetails from './wiki/SelectionDetails';
import WikiFilters from './wiki/WikiFilters';
import GeneralWikiEntryCard from './wiki/GeneralWikiEntryCard';
import CreateGeneralEntryForm from './wiki/CreateGeneralEntryForm';
import type { Receta, Estrella, ObjetoOrbital, CuerpoEspecial, Fauna, GameEntity } from '../types';
import type { WikiEntry } from '../api/wiki';

interface WikiPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialTarget?: { type: string; id: string } | null;
  selection3D?: Estrella | ObjetoOrbital | CuerpoEspecial | null;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

type ActiveTabType = WikiTab | 'Selection';

const WikiPanel: React.FC<WikiPanelProps> = ({ isOpen, onClose, initialTarget, selection3D }) => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('Jugador');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { handleUpdateSpeciesImage } = useStaticDataCtx(); 

  const {
    isLoading,
    openFilter,
    setOpenFilter,
    filteredData,
    filters,
    setters,
    allData,
    addFauna,
    updateFauna,
    deleteFauna,
    searchTerm
  } = useWikiData(isOpen, activeTab as WikiTab);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Fauna | null>(null);
  const [editingGeneralItem, setEditingGeneralItem] = useState<WikiEntry | null>(null);
  const lastScrollTop = useRef(0);
  const headerTranslateY = useRef(0);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const [filterHeight, setFilterHeight] = useState(0);

  // Navigation Logic
  const handleNavigate = useCallback((type: string, id: string) => {
    const tabMap: Record<string, WikiTab> = {
        Fauna: 'Fauna', Flora: 'Flora', Mineral: 'Minerales', Cristal: 'Cristales',
        Material: 'Materiales', Materiales: 'Materiales', 
        Fruta: 'Consumibles', Frutas: 'Consumibles', Comida: 'Consumibles', Consumibles: 'Consumibles',
        Biome: 'Biomas', Especie: 'Especies', Player: 'Jugador',
        Effect: 'Efectos'
    };
    const targetTab = tabMap[type];
    if (targetTab) {
        setActiveTab(targetTab);
        setters.setSearchTerm(''); // Clear search when navigating via link
        setTimeout(() => {
            const element = document.getElementById(`wiki-item-${id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('highlight'); 
                setTimeout(() => element.classList.remove('highlight'), 2000);
            }
        }, 200);
    }
  }, [setters]);

  useEffect(() => {
      if (isOpen && selection3D) {
        setActiveTab('Selection');
      } else if (isOpen && !isLoading && initialTarget) {
          handleNavigate(initialTarget.type, initialTarget.id);
      } else if (!isOpen) {
        setActiveTab('Jugador'); // Reset on close
        setters.setSearchTerm('');
      }
  }, [isOpen, isLoading, initialTarget, selection3D, handleNavigate, setters]); 
  
  useEffect(() => {
    if (!isOpen) {
      setIsFormOpen(false);
      setEditingItem(null);
    }
  }, [isOpen]);
  
  useLayoutEffect(() => {
    const element = filterContainerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
        if (element) {
            setFilterHeight(element.offsetHeight);
        }
    });

    observer.observe(element);
    return () => {
        observer.disconnect();
    };
  }, [isFormOpen, activeTab, isLoading, openFilter]);


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
    'General', 'Jugador', 'Especies', 'Fauna', 'Flora', 'Consumibles', 'Biomas', 'Minerales', 
    'Cristales', 'Materiales', 'Efectos', 'Armas', 'Herramientas', 'Crafteo'
  ];
  const tabs: ActiveTabType[] = selection3D ? ['Selection', ...baseTabs] : baseTabs;
  
  const contentMap: Record<WikiTab, 'Jugador' | 'Especie' | 'Fauna' | 'Flora' | 'Mineral' | 'Cristal' | 'Material' | 'Biome' | 'Efecto' | 'Arma' | 'Herramienta' | undefined> = {
    'Jugador': 'Jugador', 'Especies': 'Especie', 'Fauna': 'Fauna', 'Flora': 'Flora', 'Consumibles': 'Material', 'Minerales': 'Mineral', 
    'Cristales': 'Cristal', 'Materiales': 'Material', 'Biomas': 'Biome', 'Efectos': 'Efecto', 'Armas': 'Arma',
    'Herramientas': 'Herramienta', 'Crafteo': undefined
  };
  const currentItemType = activeTab !== 'Selection' ? contentMap[activeTab] : undefined;

  const handleOpenCreator = () => {
    if (activeTab === 'General') {
      setEditingGeneralItem(null);
      setIsFormOpen(true);
    } else {
      setEditingItem(null);
      setActiveTab('Fauna');
      setIsFormOpen(true);
    }
  };

  const handleEditItem = (item: GameEntity) => {
    if ('reino' in item) { // Simple check if it's a Fauna object
      setEditingItem(item as Fauna);
      setIsFormOpen(true);
    }
  };

  const handleEditGeneralItem = (item: WikiEntry) => {
    setEditingGeneralItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (type: string, id: string) => {
    if (type === 'Fauna') {
        const confirmed = window.confirm(`¿Estás seguro de que quieres eliminar esta criatura? Esta acción no se puede deshacer.`);
        if(confirmed) {
            deleteFauna(id);
        }
    }
  };
  
  const renderMainContent = () => (
    <div className="relative flex-1 overflow-hidden">
        <div ref={filterContainerRef} className="w-full absolute top-0 left-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-white/10" style={{ willChange: 'transform' }}>
             {/* Header Tools */}
             <div className="p-3 flex gap-2 border-b border-white/5">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <SearchIcon />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search database..."
                        value={searchTerm}
                        onChange={(e) => setters.setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-md py-1.5 pl-9 pr-8 text-sm text-white focus:ring-1 focus:ring-accent-cyan focus:border-accent-cyan transition-all"
                    />
                    {searchTerm && (
                         <button onClick={() => setters.setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white">
                            <XIcon />
                         </button>
                    )}
                </div>
                <button 
                    onClick={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
                    className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-md border border-white/10 transition-colors"
                    title={viewMode === 'list' ? "Switch to Grid View" : "Switch to List View"}
                >
                    {viewMode === 'list' ? <GridIcon /> : <ListIcon />}
                </button>
             </div>

             <div className="flex-shrink-0 p-2">
                <nav className="flex space-x-1 flex-wrap">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setOpenFilter(null); setters.setSearchTerm(''); }}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all duration-200 mb-1 ${
                        activeTab === tab 
                        ? 'bg-accent-cyan text-space-dark shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
                {activeTab !== 'Selection' && !isLoading && (
                  <div className="mt-2 pt-2 border-t border-white/5">
                     <WikiFilters 
                        activeTab={activeTab}
                        allData={allData}
                        filters={filters}
                        setters={setters}
                        openFilter={openFilter}
                        setOpenFilter={setOpenFilter}
                        onOpenCreator={handleOpenCreator}
                     />
                  </div>
                )}
              </div>
        </div>
        <div ref={scrollableContainerRef} onScroll={handleScroll} className="absolute inset-0 w-full h-full overflow-y-auto custom-scrollbar" style={{ paddingTop: filterHeight }}>
          {isLoading ? (
            <div className="text-center py-12 text-slate-500 p-4 font-mono text-xs"><p>ACCESSING DATABASE...</p></div>
          ) : activeTab === 'Selection' && selection3D ? (
            <SelectionDetails data={selection3D} />
          ) : activeTab === 'Crafteo' ? (
            <div className="p-4">
              <CraftingGrid recipes={filteredData as Receta[]} allItems={[...allData.allMaterials, ...allData.allWeapons, ...allData.allTools]} />
            </div>
          ) : activeTab === 'General' && filteredData.length > 0 ? (
            <div className={`p-4 gap-3 ${viewMode === 'grid' ? 'grid grid-cols-2' : 'space-y-3'}`}>
              {(filteredData as WikiEntry[]).map(item => (
                <GeneralWikiEntryCard
                  key={item.id}
                  entry={item}
                  onEdit={handleEditGeneralItem}
                />
              ))}
            </div>
          ) : filteredData.length > 0 && currentItemType ? (
            <div className={`p-4 gap-3 ${viewMode === 'grid' ? 'grid grid-cols-2' : 'space-y-3'}`}>
              {filteredData.map(item => (
                <WikiItemCard
                  key={item.id}
                  item={item}
                  type={currentItemType}
                  onUpdateSpeciesImage={handleUpdateSpeciesImage}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  onNavigate={handleNavigate}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 p-4 m-4 rounded-lg border border-dashed border-slate-700/50">
              <p className="font-bold uppercase text-sm tracking-widest">No Data Found</p>
              <p className="text-xs mt-2 text-slate-600">Modify search query or filters.</p>
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
        className={`relative z-10 w-full max-w-lg h-full bg-slate-950/90 backdrop-blur-xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] float-right transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0 bg-white/5">
            <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <span className="text-accent-cyan">❖</span>
                {isFormOpen ? (editingItem ? 'Edit Entity' : 'New Entry') : 'Codex Database'}
            </h2>
            <button
              onClick={isFormOpen ? () => { setIsFormOpen(false); setEditingItem(null); } : onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={isFormOpen ? "Back to glossary" : "Close glossary"}
            >
              {isFormOpen ? <BackIcon /> : <CloseIcon />}
            </button>
          </div>
          
          {isFormOpen ? (
            activeTab === 'General' ? (
              <CreateGeneralEntryForm
                onClose={() => { setIsFormOpen(false); setEditingGeneralItem(null); }}
                initialData={editingGeneralItem}
              />
            ) : (
              <CreateFaunaForm 
                onClose={() => { setIsFormOpen(false); setEditingItem(null); }}
                onSave={addFauna}
                onUpdate={updateFauna}
                initialData={editingItem}
              />
            )
          ) : renderMainContent()}

        </div>
      </div>
    </div>
  );
};

export default WikiPanel;
