/**
 * @file dataService.ts
 * @description This service acts as a data access layer for the application.
 * It provides a set of asynchronous functions to retrieve all static game data,
 * such as fauna, biomes, materials, etc. This abstracts the data source
 * (currently static files in the `/data` directory) from the components
 * that consume the data, making it easier to switch to a real API or database
 * in the future.
 */

import type { 
  Fauna, 
  Planta, 
  Mineral, 
  Material, 
  Bioma, 
  ArquetipoCristal, 
  TipoCristal,
  EspecieInteligente,
  Arma,
  Herramienta,
  Receta,
  Jugador,
  Efecto,
} from '../types';

// --- Get All Collections ---
export const getAllFauna = async (): Promise<Fauna[]> => {
  const { ALL_FAUNA } = await import('../data/fauna');
  return ALL_FAUNA;
};
export const getAllPlants = async (): Promise<Planta[]> => {
  const { ALL_PLANTS } = await import('../data/plants');
  return ALL_PLANTS;
};
export const getAllMinerals = async (): Promise<Mineral[]> => {
  const { ALL_MINERALS } = await import('../data/minerals');
  return ALL_MINERALS;
};
export const getAllMaterials = async (): Promise<Material[]> => {
  const { ALL_MATERIALS } = await import('../data/materials');
  return ALL_MATERIALS;
};
export const getAllBiomes = async (): Promise<Bioma[]> => {
  const { ALL_BIOMES } = await import('../data/biomes');
  return ALL_BIOMES;
};
export const getAllCrystals = async (): Promise<ArquetipoCristal[]> => {
  const { ALL_CRYSTALS } = await import('../data/crystals');
  return ALL_CRYSTALS;
};
export const getAllSpecies = async (): Promise<EspecieInteligente[]> => {
  const { ALL_SPECIES } = await import('../data/species');
  return ALL_SPECIES;
};
export const getAllWeapons = async (): Promise<Arma[]> => {
  const { ALL_WEAPONS } = await import('../data/weapons');
  return ALL_WEAPONS;
};
export const getAllTools = async (): Promise<Herramienta[]> => {
  const { ALL_TOOLS } = await import('../data/tools');
  return ALL_TOOLS;
};
export const getAllRecipes = async (): Promise<Receta[]> => {
  const { ALL_RECIPES } = await import('../data/recipes');
  return ALL_RECIPES;
};
export const getAllPlayers = async (): Promise<Jugador[]> => {
  const { ALL_PLAYERS } = await import('../data/players');
  return ALL_PLAYERS;
};
export const getAllEffects = async (): Promise<Efecto[]> => {
  const { ALL_EFFECTS } = await import('../data/effects');
  return ALL_EFFECTS;
};


// --- Get Single Items by ID or other properties ---
export const getFaunaById = async (id: string): Promise<Fauna | undefined> => {
  const fauna = await getAllFauna();
  return fauna.find(f => f.id === id);
};
export const getPlantById = async (id: string): Promise<Planta | undefined> => {
  const plants = await getAllPlants();
  return plants.find(p => p.id === id);
};
export const getMineralById = async (id: string): Promise<Mineral | undefined> => {
  const minerals = await getAllMinerals();
  return minerals.find(m => m.id === id);
};
export const getMaterialById = async (id: string): Promise<Material | undefined> => {
  const materials = await getAllMaterials();
  return materials.find(m => m.id === id);
};
export const getBiomeById = async (id: string): Promise<Bioma | undefined> => {
  const biomes = await getAllBiomes();
  return biomes.find(b => b.id === id);
};
export const getCrystalById = async (id: string): Promise<ArquetipoCristal | undefined> => {
  const crystals = await getAllCrystals();
  return crystals.find(c => c.id === id);
};
export const getCrystalByCrystalType = async (type: TipoCristal): Promise<ArquetipoCristal | undefined> => {
  const crystals = await getAllCrystals();
  return crystals.find(c => c.tipoCristal === type);
};
export const getSpeciesById = async (id: string): Promise<EspecieInteligente | undefined> => {
  const species = await getAllSpecies();
  return species.find(s => s.id === id);
};