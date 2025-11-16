import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    getAllFauna, 
    getAllPlants, 
    getAllMinerals, 
    getAllMaterials, 
    getAllBiomes, 
    getAllCrystals,
    getAllWeapons,
    getAllTools,
    getAllRecipes,
    getAllPlayers,
    getAllEffects,
} from '../services/dataService';
import type { Jugador, Fauna, Planta, Mineral, Material, ReinoAnimal, Bioma, ArquetipoCristal, TipoCristal, CategoriaBiome, Dieta, TamanoFauna, OrigenMaterial, EspecieInteligente, Locomocion, Arma, Herramienta, Receta, Efecto } from '../types';

export type WikiTab = 'Jugador' | 'Especies' | 'Fauna' | 'Flora' | 'Minerales' | 'Cristales' | 'Materiales' | 'Biomas' | 'Efectos' | 'Armas' | 'Herramientas' | 'Crafteo';
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
 * It handles fetching all necessary game data, applying user-selected filters,
 * and providing the filtered data to the component. It also manages the state
 * of the filter UI itself.
 *
 * @param isOpen Whether the WikiPanel is currently open. Data fetching is triggered by this.
 * @param allSpecies The list of intelligent species, passed as a prop from App.tsx.
 * @param activeTab The currently selected tab in the WikiPanel, which determines which data to filter and display.
 * @returns An object containing the loading state, filter states and setters, all fetched data, the filtered data for the active tab, and a function to add new fauna.
 */
export const useWikiData = (isOpen: boolean, allSpecies: EspecieInteligente[], activeTab: WikiTab) => {
    const [isLoading, setIsLoading] = useState(true);

    // Data states for each category in the wiki
    const [allPlayers, setAllPlayers] = useState<Jugador[]>([]);
    const [allFauna, setAllFauna] = useState<Fauna[]>([]);
    const [allPlants, setAllPlants] = useState<Planta[]>([]);
    const [allMinerals, setAllMinerals] = useState<Mineral[]>([]);
    const [allMaterials, setAllMaterials] = useState<Material[]>([]);
    const [allBiomes, setAllBiomes] = useState<Bioma[]>([]);
    const [allCrystals, setAllCrystals] = useState<ArquetipoCristal[]>([]);
    const [allWeapons, setAllWeapons] = useState<Arma[]>([]);
    const [allTools, setAllTools] = useState<Herramienta[]>([]);
    const [allRecipes, setAllRecipes] = useState<Receta[]>([]);
    const [allEffects, setAllEffects] = useState<Efecto[]>([]);
    
    // Filter states for different tabs
    const [faunaFilter, setFaunaFilter] = useState<ReinoAnimal | 'all'>('all');
    const [dietaFilter, setDietaFilter] = useState<Dieta | 'all'>('all');
    const [tamanoFilter, setTamanoFilter] = useState<TamanoFauna | 'all'>('all');
    const [locomotionFilter, setLocomotionFilter] = useState<Locomocion | 'all'>('all');
    const [crystalFilter, setCrystalFilter] = useState<TipoCristal | 'all'>('all');
    const [biomeFilter, setBiomeFilter] = useState<CategoriaBiome | 'all'>('all');
    const [materialFilter, setMaterialFilter] = useState<OrigenMaterial | 'all'>('all');

    // UI state for the filter accordion
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    
    // Effect to fetch all data when the panel is opened for the first time
    useEffect(() => {
        if (isOpen && isLoading) {
            const loadData = async <T,>(key: string, fetcher: () => Promise<T[]>, forceFresh = false): Promise<T[]> => {
                const storageKey = `${WIKI_STORAGE_PREFIX}${key}`;
                if (!forceFresh) {
                    const stored = getStoredData<T[]>(storageKey);
                    if (stored) return stored;
                }
                const fetched = await fetcher();
                setStoredData(storageKey, fetched);
                return fetched;
            };

            Promise.all([
                loadData('players', getAllPlayers),
                loadData('fauna', getAllFauna, true), // Always fetch fresh fauna data
                loadData('plants', getAllPlants),
                loadData('minerals', getAllMinerals),
                loadData('materials', getAllMaterials),
                loadData('biomes', getAllBiomes),
                loadData('crystals', getAllCrystals),
                loadData('weapons', getAllWeapons),
                loadData('tools', getAllTools),
                loadData('recipes', getAllRecipes),
                loadData('effects', getAllEffects),
            ]).then(([players, fauna, plants, minerals, materials, biomes, crystals, weapons, tools, recipes, effects]) => {
                setAllPlayers(players);
                setAllFauna(fauna);
                setAllPlants(plants);
                setAllMinerals(minerals);
                setAllMaterials(materials);
                setAllBiomes(biomes);
                setAllCrystals(crystals);
                setAllWeapons(weapons);
                setAllTools(tools);
                setAllRecipes(recipes);
                setAllEffects(effects);
                setIsLoading(false);
            });
        }
    }, [isOpen, isLoading]);
    
    // --- CRUD Operations for Fauna ---
    const addFauna = useCallback((fauna: Fauna) => {
      setAllFauna(prev => {
        const updatedFauna = [fauna, ...prev];
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


    // Memoized filtering logic to prevent re-computation on every render
    const filteredData = useMemo(() => {
        switch (activeTab) {
            case 'Jugador': return allPlayers;
            case 'Especies': return allSpecies;
            case 'Fauna':
                return allFauna.filter(fauna => {
                    const kingdomMatch = faunaFilter === 'all' || fauna.reino === faunaFilter;
                    const dietaMatch = dietaFilter === 'all' || fauna.dieta === dietaFilter;
                    const tamanoMatch = tamanoFilter === 'all' || fauna.tamano === tamanoFilter;
                    const locomotionMatch = locomotionFilter === 'all' || fauna.locomocion === locomotionFilter;
                    return kingdomMatch && locomotionMatch && dietaMatch && tamanoMatch;
                });
            case 'Cristales':
                return crystalFilter === 'all'
                    ? allCrystals
                    : allCrystals.filter(crystal => crystal.tipoCristal === crystalFilter);
            case 'Biomas':
                return biomeFilter === 'all'
                    ? allBiomes
                    : allBiomes.filter(biome => biome.categoria === biomeFilter);
            case 'Materiales':
                return materialFilter === 'all'
                    ? allMaterials
                    : allMaterials.filter(mat => mat.origen === materialFilter);
            case 'Flora': return allPlants;
            case 'Minerales': return allMinerals;
            case 'Efectos': return allEffects;
            case 'Armas': return allWeapons;
            case 'Herramientas': return allTools;
            case 'Crafteo': return allRecipes;
            default: return [];
        }
    }, [
        activeTab, allPlayers, allFauna, allCrystals, allBiomes, allMaterials, allSpecies, allPlants, allMinerals, allWeapons, allTools, allRecipes, allEffects,
        faunaFilter, dietaFilter, tamanoFilter, locomotionFilter, crystalFilter, biomeFilter, materialFilter
    ]);

    // Group filters and setters for cleaner return
    const filters = {
        faunaFilter, dietaFilter, tamanoFilter, locomotionFilter, crystalFilter, biomeFilter, materialFilter
    };
    
    const setters = {
        setFaunaFilter, setDietaFilter, setTamanoFilter, setLocomotionFilter, setCrystalFilter, setBiomeFilter, setMaterialFilter
    };

    const allData = { allPlayers, allFauna, allPlants, allMinerals, allMaterials, allBiomes, allCrystals, allSpecies, allWeapons, allTools, allRecipes, allEffects };

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
    };
};