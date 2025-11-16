import { Receta } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 1, fechaCreacion: now, fechaActualizacion: now };
const fase5Default = { idEstacionCrafteo: null, tiempoCrafteo: 5, requisitoHabilidad: null };

export const ALL_RECIPES: Receta[] = [
  {
    ...base,
    ...fase5Default,
    id: 'r_arco_simple',
    resultado: { itemId: 'w_arco_simple', cantidad: 1 },
    ingredientes: [
      { itemId: 'palos', cantidad: 3 },
      { itemId: 'fibra', cantidad: 3 },
    ],
    tags: ['basico', 'armamento']
  },
  {
    ...base,
    ...fase5Default,
    id: 'r_espada_hierro',
    resultado: { itemId: 'w_espada_hierro', cantidad: 1 },
    ingredientes: [
      { itemId: 'lingote_hierro', cantidad: 2 },
      { itemId: 'palos', cantidad: 1 },
      { itemId: 'cuero', cantidad: 1 },
    ],
    tags: ['basico', 'armamento']
  },
  {
    ...base,
    ...fase5Default,
    id: 'r_pico_hierro',
    resultado: { itemId: 't_pico_hierro', cantidad: 1 },
    ingredientes: [
      { itemId: 'lingote_hierro', cantidad: 3 },
      { itemId: 'palos', cantidad: 2 },
    ],
    tags: ['basico', 'herramientas']
  },
  {
    ...base,
    ...fase5Default,
    id: 'r_hacha_hierro',
    resultado: { itemId: 't_hacha_hierro', cantidad: 1 },
    ingredientes: [
      { itemId: 'lingote_hierro', cantidad: 3 },
      { itemId: 'palos', cantidad: 2 },
    ],
    tags: ['basico', 'herramientas']
  },
  {
    ...base,
    ...fase5Default,
    id: 'r_pala_hierro',
    resultado: { itemId: 't_pala_hierro', cantidad: 1 },
    ingredientes: [
      { itemId: 'lingote_hierro', cantidad: 1 },
      { itemId: 'palos', cantidad: 2 },
    ],
    tags: ['basico', 'herramientas']
  },
];