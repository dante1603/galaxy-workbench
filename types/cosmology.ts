
import { EntidadBase, EntidadJuego, NivelRelativo } from './core';
import { Bioma, DistribucionBioma, Ecosistema } from './biology';
import { Cristal, TipoCristal, Probabilidad } from './resources';

// --- TIPOS ESTELARES ---
export type TipoEstrella =
  | 'enana_roja' | 'solar' | 'enana_naranja' | 'azul_caliente' | 'gigante_roja'
  | 'enana_blanca' | 'verde_clorofotica' | 'roja_marcial' | 'azul_abisal'
  | 'cristal' | 'anomala_gravitacional';

export type ValorRelativo = 'muy_baja' | 'baja' | 'media' | 'alta' | 'muy_alta' | 'extrema';
export type TamanoRelativo = 'muy_pequeno' | 'pequeno' | 'medio' | 'grande' | 'muy_grande';
export type EdadEstelar = 'joven' | 'adulta' | 'vieja' | 'moribunda';
export type NivelActividad = 'calma' | 'activa' | 'muy_activa' | 'inestable';

export type ProbabilidadSimple = 'baja' | 'media' | 'alta' | 'muy_alta';
export type IntensidadColor = 'apagada' | 'neutra' | 'saturada' | 'muy_saturada';
export type TipoIluminacion = 'dura' | 'suave' | 'fria' | 'calida' | 'verdosa' | 'espectral';

export interface Estrella extends EntidadBase {
  tipo: "ESTRELLA";
  nombreProvisional: string;
  tipoBase: TipoEstrella;
  masaRelativa: ValorRelativo;
  radioRelativo: TamanoRelativo;
  luminosidadRelativa: ValorRelativo;
  temperaturaSuperficial: ValorRelativo;
  edadEstelar: EdadEstelar;
  metalicidad: ProbabilidadSimple;
  actividad: NivelActividad;
  colorPrincipal: string;
  colorSecundario: string[];
  colorCieloPlanetario: string;
  colorHex: string;
  intensidadColor: IntensidadColor;
  tipoIluminacion: TipoIluminacion;
  peligros: string[];
  atractivosSistema: string[];
  claseEstelar: string;
  masaSolar: number;
  radioSolar: number;
  luminosidadSolar: number;
  temperaturaSuperficialK: number;
  tipoSistema: {
    numPlanetasEstimado: [number, number];
    probabilidadLunas: ProbabilidadSimple;
    probabilidadCinturonAsteroides: ProbabilidadSimple;
  };
  cristales: {
    fuego: Probabilidad;
    hielo: Probabilidad;
    electrico: Probabilidad;
    gravedad: Probabilidad;
    luz: Probabilidad;
    radioactivo: Probabilidad;
    magico: Probabilidad;
    purezaMedia: ProbabilidadSimple;
  };
}

export type TipoCuerpoCentral = "ESTRELLA" | "AGUJERO_NEGRO" | "PULSAR";

export interface CuerpoEspecial extends EntidadJuego {
  tipo: "AGUJERO_NEGRO" | "PULSAR";
  masaMs?: number;
  spin?: number;
  periodoSpinMs?: number;
  campoMagneticoT?: number;
  peligros?: string[];
  atractivosSistema?: string[];
  radioInfluenciaUA?: number;
  reglasEspeciales?: string[];
}

export interface Sistema extends EntidadBase {
  nombre: string;
  cuerpoCentral: Estrella | CuerpoEspecial;
  orbitas: Orbita[];
  tipoSistema: 'ESTRELLA' | 'AGUJERO_NEGRO' | 'BINARIO' | 'ESPECIAL';
  semilla: string;
  nivelPeligro: number;
  presenciaFaccion: { faccionId: string; influencia: number }[];
}

// --- ORBITAS ---
export type TipoObjetoOrbital = "PLANETA" | "CINTURON_ASTEROIDES";
export type TipoSubOrbitaPlaneta = "LUNA" | "ANILLO";
export type TipoOrbita = "PLANETA" | "LUNA" | "CINTURON_ASTEROIDES" | "ANILLO" | "ESTACION";

export interface Orbita extends EntidadBase {
  indiceOrbita: number;
  a_UA: number;
  e: number;
  i_deg: number;
  omega_deg: number;
  Omega_deg: number;
  M0_deg: number;
  objetos: ObjetoOrbital[];
  idPadre: string | null;
  tipoOrbita: TipoOrbita;
  enZonaHabitable: boolean;
}

export type ObjetoOrbital = ObjetoPlaneta | ObjetoCinturonAsteroides;

// --- PLANETAS ---
export type TipoPlaneta = "DESERTICO" | "JUNGLA" | "VOLCANICO" | "ACUATICO" | "GIGANTE_GASEOSO";
export type TipoAtmosfera = "breathable" | "toxic" | "none";

export interface CargaUtilLuna {
  nombre: string;
  descripcion: string;
  tipo: 'rocosa' | 'helada' | 'volcanica';
  biomeId: string;
}

export interface CargaUtilAnillo {
  composicion: 'hielo' | 'roca' | 'metal';
  densidad: 'tenue' | 'medio' | 'denso';
}

export interface CargaUtilCinturonAsteroides {
  composicion: 'rocoso' | 'helado' | 'metalico';
  densidad: 'disperso' | 'moderado' | 'denso';
}

export interface ObjetoLuna extends EntidadBase {
  tipo: "LUNA";
  cargaUtil: CargaUtilLuna;
}

export interface ObjetoAnillo extends EntidadBase {
  tipo: "ANILLO";
  cargaUtil: CargaUtilAnillo;
}

export type ObjetoSubOrbitalPlaneta = ObjetoLuna | ObjetoAnillo;

export interface CargaUtilPlaneta {
  nombre?: string;
  tags?: string[];
  tipoPlaneta: TipoPlaneta;
  tituloTipoPlaneta: string;
  subOrbitas: ObjetoSubOrbitalPlaneta[];
  biomas: Bioma[];
  ecosistema?: Ecosistema;
  cristales: Cristal[] | null;
  atmosfera: {
    composicion: string;
    notas?: string;
  };
  composicionGlobal: {
    roca: number;
    metal: number;
    hielo: number;
  };
  gravedad: NivelRelativo;
  presion: NivelRelativo;
  tipoAtmosfera: TipoAtmosfera;
  rangoTemperaturaC: [number, number];
  rangoHumedad: [number, number];
  distribucionBiomas: DistribucionBioma[];
  peligrosPlanetarios: string[];
  densidadVida: 'none' | NivelRelativo;
}

export interface ObjetoPlaneta extends EntidadBase {
  tipo: "PLANETA";
  cargaUtil: CargaUtilPlaneta;
}
export interface ObjetoCinturonAsteroides extends EntidadBase {
  tipo: "CINTURON_ASTEROIDES";
  cargaUtil: CargaUtilCinturonAsteroides;
}

// Tabla Type Helper
export type TablaEstrellas = {
  [key in TipoEstrella]: Omit<Estrella, 'id' | 'tipo' | 'nombreProvisional' | 'estado' | 'version' | 'fechaCreacion' | 'fechaActualizacion'> & { peso: number };
};
