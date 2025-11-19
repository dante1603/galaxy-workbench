
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useStaticDataCtx } from '../context/StaticDataContext';
import { 
    getAllWeapons,
    getAllTools,
    getAllRecipes,
    getAllPlayers,
    getAllEffects,
} from '../services/dataService';
import type { Jugador, Fauna, Planta, Mineral, Material, ReinoAnimal, Bioma, ArquetipoCristal, TipoCristal, CategoriaBiome, Dieta, TamanoFauna, OrigenMaterial, Locomocion, Arma, Herramienta, Receta, Efecto } from '../types';

export type WikiTab = 'Jugador' | 'Especies' | 'Fauna' | 'Flora' | 'Consumibles' | 'Minerales' | 'Cristales' | 'Materiales' | 'Biomas' | 'Efectos' | 'Armas' | 'Herramientas' | 'Crafteo';
export type WikiEntityType = 'Jugador' | 'Especie' | 'Fauna' | 'Flora' | 'Mineral' | 'Cristal' | 'Material' | 'Biome' | 'Efecto' | 'Arma' | 'Herramienta' | 'Crafteo' | 'Recipe';

const WIKI_STORAGE_PREFIX = 'galaxy-workbench-wiki-';

// --- LocalStorage Helper Functions ---
const getStoredData = <T,>(key: string): T | null => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return null;
    }
};

const setStoredData = <T,>(key: string, value: T): void => {
    try {
        const serializedValue = JSON.stringify(value);
        window.localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

/**
 * A custom hook to manage the state and logic for the WikiPanel.
 * Consumes StaticDataContext for base data and handles local overrides/filters.
 */
export const useWikiData = (isOpen: boolean, activeTab: WikiTab) => {
    const { species, fauna, plants, minerals, materials, biomes, crystals } = useStaticDataCtx();
    
    const [isLoading, setIsLoading] = useState(true);

    // Data states (Local copies that can be edited)
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

                const storedFauna = getStoredData<Fauna[]>(`${WIKI_STORAGE_PREFIX}fauna`);
                if (storedFauna) {
                    setAllFauna(storedFauna);
                } else {
                    setAllFauna(fauna);
                }

                setIsLoading(false);
            };
            loadData();
        }
    }, [isOpen, isLoading, fauna]);
    
    const addFauna = useCallback((newFauna: Fauna) => {
      setAllFauna(prev => {
        const updatedFauna = [newFauna, ...prev];
        setStoredData(`${WIKI_STORAGE_PREFIX}fauna`, updatedFauna);
        return updatedFauna;
      });
    }, []);

    const updateFauna = useCallback((updatedFauna: Fauna) => {
        setAllFauna(prev => {
            const updatedList = prev.map(f => f.id === updatedFauna.id ? updatedFauna : f);
            setStoredData(`${WIKI_STORAGE_PREFIX}fauna`, updatedList);
            return updatedList;
        });
    }, []);

    const deleteFauna = useCallback((faunaId: string) => {
        setAllFauna(prev => {
            const updatedList = prev.filter(f => f.id !== faunaId);
            setStoredData(`${WIKI_STORAGE_PREFIX}fauna`, updatedList);
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
            (item.tipo && item.tipo.toLowerCase().includes(term))
        );
    };

    const filteredData = useMemo(() => {
        let data: any[] = [];
        switch (activeTab) {
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
        activeTab, allPlayers, allFauna, crystals, biomes, materials, species, plants, minerals, allWeapons, allTools, allRecipes, allEffects,
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
