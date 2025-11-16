import React from 'react';
import type { Receta, EntidadJuego, Material, Arma, Herramienta } from '../../types';

interface CraftingGridProps {
  recipes: Receta[];
  allItems: (EntidadJuego | Material | Arma | Herramienta)[];
}

const CraftingGrid: React.FC<CraftingGridProps> = ({ recipes, allItems }) => {
  const findItem = (id: string) => allItems.find(item => item.id === id);

  return (
    <div className="space-y-4">
      {recipes.map(recipe => {
        const resultItem = findItem(recipe.resultado.itemId);
        if (!resultItem) return null;

        return (
          <div key={recipe.id} className="bg-space-light/50 p-3 rounded-lg border border-slate-700 flex items-center justify-between gap-4">
            {/* Ingredients */}
            <div className="flex-1 space-y-2">
              {recipe.ingredientes.map(ing => {
                const ingItem = findItem(ing.itemId);
                return (
                  <div key={ing.itemId} className="flex items-center text-sm">
                    <span className="font-mono text-white bg-space-dark/50 px-2 py-0.5 rounded-md mr-2">{ing.cantidad}x</span>
                    <span className="text-slate-300">{ingItem?.nombre || ing.itemId}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Arrow */}
            <div className="text-accent-cyan text-2xl font-bold">→</div>
            
            {/* Result */}
            <div className="flex-1 flex items-center justify-end text-right">
              <span className="text-white font-bold">{resultItem.nombre}</span>
              <span className="font-mono text-white bg-accent-cyan/20 text-accent-cyan px-2 py-0.5 rounded-md ml-2">{recipe.resultado.cantidad}x</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CraftingGrid;