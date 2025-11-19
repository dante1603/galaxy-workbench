
import { useState, useEffect, useCallback } from 'react';
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

        // Check Local Storage for Species overrides
        const storedSpeciesJson = window.localStorage.getItem(SPECIES_STORAGE_KEY);
        let finalSpecies = loadedSpecies;

        if (storedSpeciesJson) {
            try {
                const storedSpecies = JSON.parse(storedSpeciesJson) as EspecieInteligente[];
                // Merge logic: Update static species with stored data (images, edits)
                // This assumes ID persistence
                finalSpecies = loadedSpecies.map(s => {
                    const stored = storedSpecies.find(ss => ss.id === s.id);
                    return stored ? { ...s, ...stored } : s;
                });
            } catch (e) {
                console.error("Failed to parse stored species", e);
            }
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

  /** Updates the image URL for a species and persists to LocalStorage */
  const handleUpdateSpeciesImage = useCallback((speciesId: string, imageUrl: string) => {
    setSpecies(prevSpecies => {
      const updatedSpecies = prevSpecies.map(s =>
        s.id === speciesId ? { ...s, urlImagen: imageUrl } : s
      );
      
      // Persist ONLY the modified fields (to save space/logic) or the whole object
      // For simplicity here, we save the whole modified species array
      // In a real app with huge Base64, IndexedDB would be better, but localStorage works for a few images.
      try {
          window.localStorage.setItem(SPECIES_STORAGE_KEY, JSON.stringify(updatedSpecies));
      } catch (e) {
          console.warn("Quota exceeded or storage error", e);
          alert("Storage limit reached. Image might not persist on reload.");
      }

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
