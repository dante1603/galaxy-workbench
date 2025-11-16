import { Mineral } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 1, fechaCreacion: now, fechaActualizacion: now };
const recursoBaseComun = { rareza: 'common' as const, tier: 1, valorBase: 10, spawn: {} };
const recursoBasePocoComun = { rareza: 'uncommon' as const, tier: 2, valorBase: 25, spawn: {} };
const recursoBaseRaro = { rareza: 'rare' as const, tier: 3, valorBase: 75, spawn: {} };

export const ALL_MINERALS: Mineral[] = [
  // Comunes / Varios
  { ...base, ...recursoBaseComun, id: 'min_hierro_duna', nombre: "Hierro Duna", descripcion: "Hierro de baja calidad encontrado en rocas sedimentarias de desiertos.", tags: ["DESERTICO"] },
  { ...base, ...recursoBaseComun, id: 'min_nodulo_cobre', nombre: "Nódulo de Cobre", descripcion: "Una fuente común de cobre, presente en muchos tipos de planetas.", tags: ["DESERTICO", "JUNGLA", "ACUATICO"] },
  { ...base, ...recursoBasePocoComun, id: 'min_veta_bismuto', nombre: "Veta de Bismuto", descripcion: "Un metal iridiscente con propiedades conductoras inusuales.", tags: ["JUNGLA", "VOLCANICO"] },
  { ...base, ...recursoBasePocoComun, id: 'min_azufre_cristalino', nombre: "Azufre Cristalino", descripcion: "Depósitos de azufre puro cerca de respiraderos volcánicos.", tags: ["VOLCANICO"] },
  { ...base, ...recursoBasePocoComun, id: 'min_pomez_metalica', nombre: "Piedra Pómez Metálica", descripcion: "Roca volcánica porosa con inclusiones de metales ligeros.", tags: ["VOLCANICO", "DESERTICO"] },
  { ...base, ...recursoBaseComun, id: 'min_sal_leviatan', nombre: "Sal de Leviatán", descripcion: "Cristales de sal masivos dejados por mares antiguos o encontrados en profundidades oceánicas.", tags: ["ACUATICO", "DESERTICO"] },

  // Raros / Específicos
  { ...base, ...recursoBaseRaro, id: 'min_opalo_musgo', nombre: "Ópalo de Musgo", descripcion: "Un ópalo con intrincados patrones que se asemejan a musgo fosilizado.", tags: ["JUNGLA"] },
  { ...base, ...recursoBaseRaro, id: 'min_magma_congelado', nombre: "Veta de Magma Congelado", descripcion: "Un raro mineral formado por el enfriamiento instantáneo de magma, preservando propiedades únicas.", tags: ["VOLCANICO"] },
  { ...base, ...recursoBaseRaro, id: 'min_perla_presion', nombre: "Perla de Presión", descripcion: "Perlas formadas en las profundidades abisales, capaces de soportar una presión extrema.", tags: ["ACUATICO"] },
];