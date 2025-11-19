
import { EntidadJuego, EntidadBase } from './core';
import { TipoPlaneta } from './cosmology';
import { Dieta, Fauna, Planta, Bioma } from './biology';
import { TipoCristal, Rareza, Material, Mineral, ArquetipoCristal } from './resources';

// --- ESPECIE INTELIGENTE ---
export interface HabilidadEspecie {
  nombre: string;
  descripcion: string;
  tipo: 'ACTIVA' | 'PASIVA';
  cooldownSegundos?: number;
  costoRecurso?: { tipo: 'aguante' | 'salud' | 'energia'; cantidad: number };
  efectoId?: string;
}

export interface RasgoEspecie {
  nombre: string;
  descripcion: string;
  tipo: 'VENTAJA' | 'DESVENTAJA' | 'NEUTRAL';
  modificador?: {
    statAfectado: keyof Jugador['statsBase'];
    valor: number;
    esPorcentaje: boolean;
    condicion?: string;
  };
}

export interface Metabolismo {
  dieta: Dieta;
  entornosFavorables: string[];
  entornosDesfavorables: string[];
  resistenciaHambre: number;
  resistenciaSed: number;
}

export interface EspecieInteligente extends EntidadJuego {
  lore: string[];
  habilidades: HabilidadEspecie[];
  rasgos: RasgoEspecie[];
  planetasComunes: TipoPlaneta[];
  colorClave: string;
  urlImagen?: string | null;
  modificadoresStatsBase: {
    salud?: number;
    aguante?: number;
    ataque?: number;
    defensa?: number;
    velocidadMovimiento?: number;
    capacidadCarga?: number;
  };
  biomasInicio: string[];
  metabolismo: Metabolismo;
  afinidadCristales: TipoCristal[];
}

// --- EQUIPO ---
export type TipoArma = 'espada' | 'hacha_combate' | 'martillo' | 'lanza' | 'arco' | 'ballesta';
export type TipoHerramienta = 'pico' | 'hacha_tala' | 'pala' | 'martillo_crafteo';

export interface EquipoBase extends EntidadJuego {
  tier: number;
  rareza: Rareza;
  durabilidad: number;
  tiposCristalCompatibles: TipoCristal[];
  idPatronAtaque: string | null;
  objetivosPermitidos: ('fauna' | 'jugador' | 'recursos')[];
}
export interface Arma extends EquipoBase {
  tipoArma: TipoArma;
  dano: number;
  velocidad: 'lenta' | 'normal' | 'rapida';
  alcance: 'corta' | 'media' | 'larga';
}
export interface Herramienta extends EquipoBase {
  tipoHerramienta: TipoHerramienta;
  eficiencia: number;
}

// --- CRAFTEO ---
export interface Ingrediente {
  itemId: string;
  cantidad: number;
}
export interface ResultadoCrafteo {
  itemId: string;
  cantidad: number;
}
export interface Receta extends EntidadBase {
  resultado: ResultadoCrafteo;
  ingredientes: Ingrediente[];
  tags: string[];
  idEstacionCrafteo: string | null;
  tiempoCrafteo: number;
  requisitoHabilidad: { habilidadId: string; nivel: number } | null;
}

// --- JUGADOR ---
export interface Jugador extends EntidadJuego {
  statsBase: {
    salud: number;
    aguante: number;
    ataque: number;
    defensa: number;
    velocidadMovimiento: number;
    capacidadCarga: number;
    resistencias: Record<string, number>;
  };
  especieId?: string;
  itemsInicio: { itemId: string; cantidad: number }[];
}

// --- EFECTOS ---
export type TipoEfecto = "BUFF" | "DEBUFF" | "NEUTRAL";

export interface Efecto extends EntidadJuego {
  tipoEfecto: TipoEfecto;
  mecanicasGameplay: string[];
  duracion: number;
  magnitud: number;
  maxAcumulaciones: number;
  aplicaA: ('jugador' | 'fauna')[];
}

// --- GAME ENTITY UNION ---
export type GameEntity = Jugador | Fauna | Planta | Mineral | Material | Bioma | EspecieInteligente | ArquetipoCristal | Arma | Herramienta | Efecto;
