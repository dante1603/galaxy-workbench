
import { EntidadJuego } from './core';
import { TipoSuelo } from './biology';

// --- TIPOS BASE RECURSOS ---
export type Rareza = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type Probabilidad = 'muy_bajo' | 'bajo' | 'medio' | 'alto' | 'muy_alto';

export interface SpawnInfo {
  planetIds?: string[];
  biomeIds?: string[];
  depthRange?: [number, number];
}

export interface RecursoBase {
  rareza: Rareza;
  tier: number;
  valorBase: number;
  spawn: SpawnInfo;
}

// --- MINERALES ---
export type MetodoProcesamiento = 'fundicion' | 'trituracion' | 'electrolisis' | 'centrifugado' | 'corte_laser';

export interface DatosProcesamiento {
  metodo: MetodoProcesamiento;
  productoId: string; // ID del Material resultante
  cantidadResultado: number;
  tiempoBaseSegundos: number;
}

export interface Mineral extends EntidadJuego, RecursoBase {
  suelosCompatibles: TipoSuelo[];
  formulaQuimica?: string; // Ej: Fe2O3
  dureza: number; // Escala de Mohs 1-10 (Determina pico necesario)
  datosProcesamiento?: DatosProcesamiento;
}

// --- MATERIALES ---
export type OrigenMaterial = 'vegetal' | 'animal' | 'mineral';

export interface EfectoConsumible {
  id: string;
  chance: number;
}

export interface DatosConsumible {
  salud?: number;
  hambre?: number;
  aguante?: number;
  efectos?: EfectoConsumible[];
}

export interface Material extends EntidadJuego, RecursoBase {
  origen: OrigenMaterial;
  datosConsumible?: DatosConsumible;
}

// --- CRISTALES ---
export type TipoCristal = "FUEGO" | "HIELO" | "ELECTRICO" | "GRAVEDAD" | "MAGICO" | "LUZ" | "RADIOACTIVO";
export type ElementoCristal = "FIRE" | "ICE" | "ELECTRIC" | "GRAVITY" | "NEUTRAL";
export type Escalado = "LINEAR" | "EXPONENTIAL";

export interface Cristal {
  tipo: TipoCristal;
  pureza: number;
}

export interface ArquetipoCristal extends EntidadJuego, RecursoBase {
  tipoCristal: TipoCristal;
  elemento: ElementoCristal;
  potenciaBase: number;
  escalado: Escalado;
  tiposArmaCompatibles: string[];
  tiposHerramientaCompatibles:string[];
}
