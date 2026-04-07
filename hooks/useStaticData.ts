
import { useState, useEffect, useCallback } from 'react';
import { get, set } from 'idb-keyval';
import { 
  getAllSpecies, 
  getAllMaterials, 
  getAllFauna, 
  getAllCrystals, 
  getAllPlants, 
  getAllMinerals, 
  getAllBiomes 
} from '../services/dataService';
import type { 
  EspecieInteligente, 
  Material, 
  Fauna, 
  ArquetipoCristal, 
  Planta, 
  Mineral, 
  Bioma 
} from '../types';

const SPECIES_STORAGE_KEY = 'galaxy-workbench-species-v1';

export const useStaticData = () => {
  const [species, setSpecies] = useState<EspecieInteligente[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [fauna, setFauna] = useState<Fauna[]>([]);
  const [crystals, setCrystals] = useState<ArquetipoCristal[]>([]);
  const [plants, setPlants] = useState<Planta[]>([]);
  const [minerals, setMinerals] = useState<Mineral[]>([]);
  const [biomes, setBiomes] = useState<Bioma[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          loadedSpecies,
          loadedMaterials,
          loadedFauna,
          loadedCrystals,
          loadedPlants,
          loadedMinerals,
          loadedBiomes
        ] = await Promise.all([
          getAllSpecies(),
          getAllMaterials(),
          getAllFauna(),
          getAllCrystals(),
          getAllPlants(),
          getAllMinerals(),
          getAllBiomes()
        ]);

        // Check IndexedDB for Species overrides (Images, etc.)
        let finalSpecies = loadedSpecies;
        try {
            let storedSpecies = await get<EspecieInteligente[]>(SPECIES_STORAGE_KEY);
            
            // Migration Logic: Check LocalStorage fallback
            if (!storedSpecies) {
                 const lsSpecies = window.localStorage.getItem(SPECIES_STORAGE_KEY);
                 if (lsSpecies) {
                     try {
                         storedSpecies = JSON.parse(lsSpecies);
                         await set(SPECIES_STORAGE_KEY, storedSpecies);
                         window.localStorage.removeItem(SPECIES_STORAGE_KEY);
                         console.log("Migrated Species data to IndexedDB");
                     } catch (e) {
                         console.warn("Failed to migrate species data", e);
                     }
                 }
            }

            if (storedSpecies) {
                // Merge logic: Update static species with stored data (images, edits)
                finalSpecies = loadedSpecies.map(s => {
                    const stored = storedSpecies.find(ss => ss.id === s.id);
                    return stored ? { ...s, ...stored } : s;
                });
            }
        } catch (e) {
            console.error("Error accessing IndexedDB for species", e);
        }

        setSpecies(finalSpecies);
        setMaterials(loadedMaterials);
        setFauna(loadedFauna);
        setCrystals(loadedCrystals);
        setPlants(loadedPlants);
        setMinerals(loadedMinerals);
        setBiomes(loadedBiomes);
      } catch (error) {
        console.error("Error loading static data:", error);
      }
    };

    loadData();
  }, []);

  /** Updates the image URL for a species and persists to IndexedDB */
  const handleUpdateSpeciesImage = useCallback((speciesId: string, imageUrl: string) => {
    setSpecies(prevSpecies => {
      const updatedSpecies = prevSpecies.map(s =>
        s.id === speciesId ? { ...s, urlImagen: imageUrl } : s
      );
      
      // Persist to IndexedDB (supports large binary strings)
      set(SPECIES_STORAGE_KEY, updatedSpecies).catch(e => {
          console.error("Failed to save species image to storage", e);
      });

      return updatedSpecies;
    });
  }, []);

  return {
    species,
    materials,
    fauna,
    crystals,
    plants,
    minerals,
    biomes,
    handleUpdateSpeciesImage
  };
};
