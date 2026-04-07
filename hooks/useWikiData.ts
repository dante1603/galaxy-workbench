
import { useState, useEffect, useMemo, useCallback } from 'react';
import { get, set, del } from 'idb-keyval';
import { useStaticDataCtx } from '../context/StaticDataContext';
import { 
    getAllWeapons,
    getAllTools,
    getAllRecipes,
    getAllPlayers,
    getAllEffects,
} from '../services/dataService';
import type { Jugador, Fauna, Planta, Mineral, Material, ReinoAnimal, Bioma, ArquetipoCristal, TipoCristal, CategoriaBiome, Dieta, TamanoFauna, OrigenMaterial, Locomocion, Arma, Herramienta, Receta, Efecto } from '../types';
import { subscribeToWikiEntries, WikiEntry } from '../api/wiki';

export type WikiTab = 'General' | 'Jugador' | 'Especies' | 'Fauna' | 'Flora' | 'Consumibles' | 'Minerales' | 'Cristales' | 'Materiales' | 'Biomas' | 'Efectos' | 'Armas' | 'Herramientas' | 'Crafteo';
export type WikiEntityType = 'General' | 'Jugador' | 'Especie' | 'Fauna' | 'Flora' | 'Mineral' | 'Cristal' | 'Material' | 'Biome' | 'Efecto' | 'Arma' | 'Herramienta' | 'Crafteo' | 'Recipe';

const WIKI_STORAGE_PREFIX = 'galaxy-workbench-wiki-';
const FAUNA_KEY = `${WIKI_STORAGE_PREFIX}fauna`;

/**
 * A custom hook to manage the state and logic for the WikiPanel.
 * Consumes StaticDataContext for base data and handles local overrides/filters.
 * Migrated to IndexedDB (idb-keyval) to support large datasets/images.
 */
export const useWikiData = (isOpen: boolean, activeTab: WikiTab) => {
    const { species, fauna, plants, minerals, materials, biomes, crystals } = useStaticDataCtx();
    
    const [isLoading, setIsLoading] = useState(true);

    // Data states (Local copies that can be edited)
    const [allWikiEntries, setAllWikiEntries] = useState<WikiEntry[]>([]);
    const [allPlayers, setAllPlayers] = useState<Jugador[]>([]);
    const [allFauna, setAllFauna] = useState<Fauna[]>([]);
    
    const [allWeapons, setAllWeapons] = useState<Arma[]>([]);
    const [allTools, setAllTools] = useState<Herramienta[]>([]);
    const [allRecipes, setAllRecipes] = useState<Receta[]>([]);
    const [allEffects, setAllEffects] = useState<Efecto[]>([]);
    
    // --- FILTERS ---
    // Fauna
    const [faunaFilter, setFaunaFilter] = useState<ReinoAnimal | 'all'>('all');
    const [dietaFilter, setDietaFilter] = useState<Dieta | 'all'>('all');
    const [tamanoFilter, setTamanoFilter] = useState<TamanoFauna | 'all'>('all');
    const [locomotionFilter, setLocomotionFilter] = useState<Locomocion | 'all'>('all');
    
    // Others
    const [crystalFilter, setCrystalFilter] = useState<TipoCristal | 'all'>('all');
    const [biomeFilter, setBiomeFilter] = useState<CategoriaBiome | 'all'>('all');
    const [materialFilter, setMaterialFilter] = useState<OrigenMaterial | 'all'>('all');
    const [materialRarityFilter, setMaterialRarityFilter] = useState<string | 'all'>('all');
    
    // New Filters
    const [floraStructureFilter, setFloraStructureFilter] = useState<string | 'all'>('all');
    const [floraFoliageFilter, setFloraFoliageFilter] = useState<string | 'all'>('all');
    const [mineralRarityFilter, setMineralRarityFilter] = useState<string | 'all'>('all');
    const [effectTypeFilter, setEffectTypeFilter] = useState<string | 'all'>('all');
    const [weaponTypeFilter, setWeaponTypeFilter] = useState<string | 'all'>('all');
    const [toolTypeFilter, setToolTypeFilter] = useState<string | 'all'>('all');
    const [speciesDietFilter, setSpeciesDietFilter] = useState<string | 'all'>('all');

    // Search State
    const [searchTerm, setSearchTerm] = useState('');

    // UI state
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    
    // Load and Sync Data
    useEffect(() => {
        let unsubscribeWiki: () => void;

        if (isOpen && isLoading) {
            const loadData = async () => {
                const [players, weapons, tools, recipes, effects] = await Promise.all([
                    getAllPlayers(), getAllWeapons(), getAllTools(), getAllRecipes(), getAllEffects()
                ]);
                setAllPlayers(players);
                setAllWeapons(weapons);
                setAllTools(tools);
                setAllRecipes(recipes);
                setAllEffects(effects);

                // Load Fauna from IndexedDB
                try {
                    let storedFauna = await get<Fauna[]>(FAUNA_KEY);
                    
                    // Migration Logic: If not in IDB, check LocalStorage, migrate, and delete from LS
                    if (!storedFauna) {
                        const lsFauna = window.localStorage.getItem(FAUNA_KEY);
                        if (lsFauna) {
                            try {
                                storedFauna = JSON.parse(lsFauna);
                                await set(FAUNA_KEY, storedFauna); // Migrate
                                window.localStorage.removeItem(FAUNA_KEY); // Clean up
                                console.log("Migrated Fauna data from LocalStorage to IndexedDB");
                            } catch (e) {
                                console.warn("Failed to migrate LocalStorage fauna data", e);
                            }
                        }
                    }

                    if (storedFauna) {
                        setAllFauna(storedFauna);
                    } else {
                        setAllFauna(fauna);
                    }
                } catch (err) {
                    console.error("Error loading fauna from storage:", err);
                    setAllFauna(fauna); // Fallback
                }

                // Subscribe to Firebase Wiki Entries
                unsubscribeWiki = subscribeToWikiEntries(
                    (entries) => setAllWikiEntries(entries),
                    (error) => console.error("Error loading wiki entries:", error)
                );

                setIsLoading(false);
            };
            loadData();
        }

        return () => {
            if (unsubscribeWiki) {
                unsubscribeWiki();
            }
        };
    }, [isOpen, isLoading, fauna]);
    
    const addFauna = useCallback((newFauna: Fauna) => {
      setAllFauna(prev => {
        const updatedFauna = [newFauna, ...prev];
        set(FAUNA_KEY, updatedFauna).catch(err => console.error("IDB Write Error", err));
        return updatedFauna;
      });
    }, []);

    const updateFauna = useCallback((updatedFauna: Fauna) => {
        setAllFauna(prev => {
            const updatedList = prev.map(f => f.id === updatedFauna.id ? updatedFauna : f);
            set(FAUNA_KEY, updatedList).catch(err => console.error("IDB Write Error", err));
            return updatedList;
        });
    }, []);

    const deleteFauna = useCallback((faunaId: string) => {
        setAllFauna(prev => {
            const updatedList = prev.filter(f => f.id !== faunaId);
            set(FAUNA_KEY, updatedList).catch(err => console.error("IDB Write Error", err));
            return updatedList;
        });
    }, []);

    // General filter function for search term
    const matchesSearch = (item: any) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (item.nombre && item.nombre.toLowerCase().includes(term)) ||
            (item.descripcion && item.descripcion.toLowerCase().includes(term)) ||
            (item.tipo && item.tipo.toLowerCase().includes(term)) ||
            (item.title && item.title.toLowerCase().includes(term)) ||
            (item.content && item.content.toLowerCase().includes(term)) ||
            (item.category && item.category.toLowerCase().includes(term))
        );
    };

    const filteredData = useMemo(() => {
        let data: any[] = [];
        switch (activeTab) {
            case 'General': data = allWikiEntries; break;
            case 'Jugador': data = allPlayers; break;
            case 'Especies': 
                data = speciesDietFilter === 'all' ? species : species.filter(s => s.metabolismo.dieta === speciesDietFilter);
                break;
            case 'Fauna':
                data = allFauna.filter(f => {
                    const kingdomMatch = faunaFilter === 'all' || f.reino === faunaFilter;
                    const dietaMatch = dietaFilter === 'all' || f.dieta === dietaFilter;
                    const tamanoMatch = tamanoFilter === 'all' || f.tamano === tamanoFilter;
                    const locomotionMatch = locomotionFilter === 'all' || f.locomocion === locomotionFilter;
                    return kingdomMatch && locomotionMatch && dietaMatch && tamanoMatch;
                });
                break;
            case 'Cristales':
                data = crystalFilter === 'all' ? crystals : crystals.filter(c => c.tipoCristal === crystalFilter);
                break;
            case 'Biomas':
                data = biomeFilter === 'all' ? biomes : biomes.filter(b => b.categoria === biomeFilter);
                break;
            case 'Materiales':
                data = materials.filter(m => {
                    const originMatch = materialFilter === 'all' || m.origen === materialFilter;
                    const rarityMatch = materialRarityFilter === 'all' || m.rareza === materialRarityFilter;
                    return originMatch && rarityMatch;
                });
                break;
            case 'Consumibles':
                data = materials.filter(m => {
                    const isConsumable = m.tags.includes('consumible');
                    const rarityMatch = materialRarityFilter === 'all' || m.rareza === materialRarityFilter;
                    return isConsumable && rarityMatch;
                });
                break;
            case 'Flora': 
                data = plants.filter(p => {
                     const struct = floraStructureFilter === 'all' || p.estructura === floraStructureFilter;
                     const fol = floraFoliageFilter === 'all' || p.follaje === floraFoliageFilter;
                     return struct && fol;
                });
                break;
            case 'Minerales': 
                data = mineralRarityFilter === 'all' ? minerals : minerals.filter(m => m.rareza === mineralRarityFilter);
                break;
            case 'Efectos': 
                data = effectTypeFilter === 'all' ? allEffects : allEffects.filter(e => e.tipoEfecto === effectTypeFilter);
                break;
            case 'Armas': 
                data = weaponTypeFilter === 'all' ? allWeapons : allWeapons.filter(w => w.tipoArma === weaponTypeFilter);
                break;
            case 'Herramientas': 
                data = toolTypeFilter === 'all' ? allTools : allTools.filter(t => t.tipoHerramienta === toolTypeFilter);
                break;
            case 'Crafteo': data = allRecipes; break; 
        }
        
        // Apply search filter
        return data.filter(matchesSearch);

    }, [
        activeTab, allWikiEntries, allPlayers, allFauna, crystals, biomes, materials, species, plants, minerals, allWeapons, allTools, allRecipes, allEffects,
        faunaFilter, dietaFilter, tamanoFilter, locomotionFilter, crystalFilter, biomeFilter, materialFilter, searchTerm,
        floraStructureFilter, floraFoliageFilter, mineralRarityFilter, effectTypeFilter, weaponTypeFilter, toolTypeFilter, speciesDietFilter, materialRarityFilter
    ]);

    const filters = {
        faunaFilter, dietaFilter, tamanoFilter, locomotionFilter, crystalFilter, biomeFilter, materialFilter,
        floraStructureFilter, floraFoliageFilter, mineralRarityFilter, effectTypeFilter, weaponTypeFilter, toolTypeFilter, speciesDietFilter, materialRarityFilter
    };
    
    const setters = {
        setFaunaFilter, setDietaFilter, setTamanoFilter, setLocomotionFilter, setCrystalFilter, setBiomeFilter, setMaterialFilter, setSearchTerm,
        setFloraStructureFilter, setFloraFoliageFilter, setMineralRarityFilter, setEffectTypeFilter, setWeaponTypeFilter, setToolTypeFilter, setSpeciesDietFilter, setMaterialRarityFilter
    };

    const allData = { 
        allWikiEntries,
        allPlayers, 
        allFauna, 
        allPlants: plants, 
        allMinerals: minerals, 
        allMaterials: materials, 
        allBiomes: biomes, 
        allCrystals: crystals, 
        allSpecies: species, 
        allWeapons, 
        allTools, 
        allRecipes, 
        allEffects 
    };

    return {
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
    };
};
