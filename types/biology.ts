
import { EntidadJuego, NivelRelativo } from './core';

// --- BIOMAS ---
export type CategoriaBiome =
  | 'DESIERTO' | 'MONTAÑA' | 'BOSQUE' | 'JUNGLA' | 'PANTANO' | 'TUNDRA'
  | 'VOLCANICO' | 'INOSPITO' | 'SUBTERRANEO' | 'LECHO_MARINO' | 'PLAYA'
  | 'ACANTILADO' | 'OCEANO_ABIERTO';

export type TipoSuelo = 
  | 'tierra_fertil' 
  | 'arena_fina' 
  | 'roca_solida' 
  | 'hielo_permafrost' 
  | 'ceniza_volcanica' 
  | 'barro_denso' 
  | 'grava_mineral' 
  | 'regolito_polvoriento'
  | 'lecho_marino'
  | 'cristal_bruto' 
  | 'metal_oxidado' 
  | 'carne_viva';

export type NivelLuz = "dark" | "dim" | "normal" | "bright";

export interface Bioma extends EntidadJuego {
  categoria: CategoriaBiome;
  tipoSuelo: TipoSuelo;
  faunaPosible: string[];
  floraPosible: string[];
  mineralesPosibles: string[];
  clima: {
    rangoTemperaturaC: [number, number];
    rangoHumedad: [number, number];
    rangoAltitud: [number, number];
  };
  nivelLuz: NivelLuz;
  peligros: string[];
  densidad: {
    densidadFauna: NivelRelativo;
    densidadFlora: NivelRelativo;
    riquezaRecursos: NivelRelativo;
  };
}

export interface DistribucionBioma {
  biomeId: string;
  coverage: number;
}

// --- FLORA (PLANTAS) ---
export type EstructuraPlanta = 'arborea' | 'arbustiva' | 'herbacea' | 'liana' | 'hongo' | 'acuatica_flotante' | 'acuatica_sumergida' | 'parasita' | 'epifita' | 'succulenta_gigante';
export type FollajePlanta = 'hoja_ancha' | 'aguja' | 'fronda' | 'suculenta' | 'espinas' | 'sin_hojas' | 'cristalino' | 'bioluminiscente' | 'membrana';
export type ReproduccionPlanta = 'fruto_comestible' | 'fruto_toxico' | 'esporas' | 'semillas_voladoras' | 'vainas' | 'rizomas' | 'floracion_nectar' | 'conos';
export type PatronDistribucion = 'solitario' | 'bosque_denso' | 'parches' | 'alfombra';

export interface HabitatPlanta {
  luzRequerida: 'sombra' | 'media' | 'pleno_sol' | 'oscuridad_total';
  sueloPreferido: 'tierra' | 'arena' | 'roca' | 'cieno' | 'agua' | 'ceniza';
  patronDistribucion: PatronDistribucion;
}

export interface PlantDrop {
  materialId: string;
  min: number;
  max: number;
  chance: number;
}

export interface ReglasCosecha {
  herramientaRequeridaId: string | null;
  tiempoRecrecimiento: number;
}

export interface Planta extends EntidadJuego {
  estructura: EstructuraPlanta;
  follaje: FollajePlanta;
  reproduccion: ReproduccionPlanta;
  frutaId?: string;
  drops: PlantDrop[];
  reglasCosecha: ReglasCosecha;
  etapasCrecimiento: number;
  biomeIds: string[];
  habitat: HabitatPlanta;
}

// --- FAUNA ---
export type ReinoAnimal = 'mamifero' | 'reptiloide' | 'aviano' | 'artropodo' | 'pez' | 'anfibio' | 'molusco' | 'silicoide' | 'fungoide' | 'energetico' | 'mecanoide' | 'verme';
export const TODOS_REINOS_ANIMALES: ReinoAnimal[] = ['mamifero', 'reptiloide', 'aviano', 'artropodo', 'pez', 'anfibio', 'molusco', 'silicoide', 'fungoide', 'energetico', 'mecanoide', 'verme'];

export type PlanCorporal = 'bipedo' | 'cuadrupedo' | 'multipodo' | 'serpentino' | 'pisciforme' | 'alado' | 'radial' | 'amorfo' | 'levitante' | 'estatico';
export const TODOS_PLANES_CORPORALES: PlanCorporal[] = ['bipedo', 'cuadrupedo', 'multipodo', 'serpentino', 'pisciforme', 'alado', 'radial', 'amorfo', 'levitante', 'estatico'];

export type Cobertura = 'piel_suave' | 'pelaje' | 'escamas' | 'plumas' | 'quitina' | 'concha' | 'corteza' | 'mineral' | 'baboso' | 'metalico' | 'bioluminiscente' | 'energia_pura' | 'placas_sinteticas';
export const TODAS_COBERTURAS: Cobertura[] = ['piel_suave', 'pelaje', 'escamas', 'plumas', 'quitina', 'concha', 'corteza', 'mineral', 'baboso', 'metalico', 'bioluminiscente', 'energia_pura', 'placas_sinteticas'];

export type Sentido = 'visual' | 'olfativo' | 'auditivo' | 'vibracion' | 'termico' | 'ecolocalizacion' | 'psiquico' | 'magnetico' | 'electrico';
export const TODOS_SENTIDOS: Sentido[] = ['visual', 'olfativo', 'auditivo', 'vibracion', 'termico', 'ecolocalizacion', 'psiquico', 'magnetico', 'electrico'];

export type Dieta = 'herbivoro' | 'carnivoro' | 'omnivoro' | 'carronero' | 'fototrofico' | 'litotrofico';
export const TODAS_DIETAS: Dieta[] = ['herbivoro', 'carnivoro', 'omnivoro', 'carronero', 'fototrofico', 'litotrofico'];

export type ComportamientoSocial = 'solitario' | 'pareja' | 'manada_caza' | 'manada_defensiva' | 'enjambre' | 'colonia' | 'cardumen';
export const TODOS_COMPORTAMIENTOS_SOCIALES: ComportamientoSocial[] = ['solitario', 'pareja', 'manada_caza', 'manada_defensiva', 'enjambre', 'colonia', 'cardumen'];

export type TamanoFauna = 'diminuto' | 'pequeno' | 'medio' | 'grande' | 'muy_grande' | 'colosal';
export const TODOS_TAMANOS_FAUNA: TamanoFauna[] = ['diminuto', 'pequeno', 'medio', 'grande', 'muy_grande', 'colosal'];

export type Locomocion = 'terrestre' | 'acuatico' | 'volador' | 'anfibio' | 'excavador' | 'estacionario' | 'levitacion' | 'espacial';
export const TODAS_LOCOMOCIONES: Locomocion[] = ['terrestre', 'acuatico', 'volador', 'anfibio', 'excavador', 'estacionario', 'levitacion', 'espacial'];

export type TipoExtremidadesDelanteras = 'ninguna' | 'garras' | 'pinzas' | 'manos' | 'aletas' | 'tentaculos' | 'alas' | 'cuchillas';
export const TODAS_EXTREMIDADES_DELANTERAS: TipoExtremidadesDelanteras[] = ['ninguna', 'garras', 'pinzas', 'manos', 'aletas', 'tentaculos', 'alas', 'cuchillas'];

export type TagUtilidadCola = 'equilibrio' | 'ataque' | 'defensa' | 'natacion' | 'prensil' | 'comunicacion';
export const TODOS_TAGS_UTILIDAD_COLA: TagUtilidadCola[] = ['equilibrio', 'ataque', 'defensa', 'natacion', 'prensil', 'comunicacion'];

export type Temperamento = 'docil' | 'huidizo' | 'defensivo' | 'territorial' | 'agresivo' | 'oportunista' | 'plaga' | 'implacable';
export const TODOS_TEMPERAMENTOS: Temperamento[] = ['docil', 'huidizo', 'defensivo', 'territorial', 'agresivo', 'oportunista', 'plaga', 'implacable'];

export type RolCombate = 'tanque' | 'dps_cuerpo_a_cuerpo' | 'dps_distancia' | 'asesino' | 'sigilo' | 'control_de_area' | 'apoyo' | 'jefe';
export const TODOS_ROLES_COMBATE: RolCombate[] = ['tanque', 'dps_cuerpo_a_cuerpo', 'dps_distancia', 'asesino', 'sigilo', 'control_de_area', 'apoyo', 'jefe'];

export type TagUtilidad = 'montura' | 'bestia_de_carga' | 'mascota' | 'simbionte' | 'productor_recursos';
export const TODOS_TAGS_UTILIDAD: TagUtilidad[] = ['montura', 'bestia_de_carga', 'mascota', 'simbionte', 'productor_recursos'];

export interface Drop {
  materialId: string;
  min: number;
  max: number;
  chance: number;
}

export interface Fauna extends EntidadJuego {
  reino: ReinoAnimal;
  planCorporal: PlanCorporal;
  cobertura: Cobertura;
  sentidos: Sentido[];
  
  tamano: TamanoFauna;
  locomocion: Locomocion;
  cantidadExtremidades: number;
  tipoExtremidadesDelanteras: TipoExtremidadesDelanteras;
  tieneCola: boolean;
  utilidadCola: TagUtilidadCola[];
  
  dieta: Dieta;
  comportamientoSocial: ComportamientoSocial;
  temperamento: Temperamento;
  rolCombate: RolCombate[];
  utilidad: TagUtilidad[];
  
  drops: Drop[];
  urlImagen?: string | null;
  
  biomeIds: string[];
  nivelAmenaza: number; // 1-10
  stats: {
    salud: number;
    dano: number;
    velocidad: number;
    rangoPercepcion: number;
    rangoAgresividad: number;
  };
  idPerfilIA: string | null;
}

// --- ECOSISTEMA GENERADO ---
export interface Ecosistema {
  minerales: string[];
  flora: {
    arboles: string[];
    arbustos: string[];
    cobertura: string[];
    especiales: string[];
  };
  fauna: {
    depredadoresApex: string[];
    depredadoresPequenos: string[];
    presasGrandes: string[];
    presasMedianas: string[];
    presasPequenas: string[];
    carroneros: string[];
  };
}
