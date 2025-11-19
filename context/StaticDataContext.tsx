
import React, { createContext, useContext } from 'react';
import { useStaticData } from '../hooks/useStaticData';
import type { 
  EspecieInteligente, 
  Material, 
  Fauna, 
  ArquetipoCristal, 
  Planta, 
  Mineral, 
  Bioma 
} from '../types';

interface StaticDataContextType {
  species: EspecieInteligente[];
  materials: Material[];
  fauna: Fauna[];
  crystals: ArquetipoCristal[];
  plants: Planta[];
  minerals: Mineral[];
  biomes: Bioma[];
  handleUpdateSpeciesImage: (speciesId: string, imageUrl: string) => void;
  loading: boolean;
}

const StaticDataContext = createContext<StaticDataContextType | null>(null);

export const StaticDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Reuse the logic from the existing hook
  const data = useStaticData();
  
  // Check if data is actually loaded (simple check based on array length or add a loading state to useStaticData later)
  // For now, we assume if arrays are empty we might be loading, but useStaticData initializes empty.
  // In a real app, useStaticData would return a loading flag.
  const loading = data.species.length === 0 && data.materials.length === 0;

  return (
    <StaticDataContext.Provider value={{ ...data, loading }}>
      {children}
    </StaticDataContext.Provider>
  );
};

export const useStaticDataCtx = () => {
  const context = useContext(StaticDataContext);
  if (!context) {
    throw new Error('useStaticDataCtx must be used within a StaticDataProvider');
  }
  return context;
};
