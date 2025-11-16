/*
================================================================================
| GUÍA DEL MODELO DE DATOS - GALAXY WORKBENCH                                  |
================================================================================
| Versión: 2.0                                                                 |
| Fecha: 2024-07-26                                                            |
| Autor: IA Senior Frontend Engineer                                           |
--------------------------------------------------------------------------------
| Este documento describe la estructura de datos refactorizada (Fase 0 y 1)    |
| para todas las entidades del juego. El objetivo es establecer un estándar    |
| coherente, escalable y fácil de usar, tanto para desarrolladores humanos     |
| como para sistemas de IA generativa.                                         |
|                                                                              |
| NOTA SOBRE LAS FASES: Las anotaciones "// Fase X" indican propiedades o      |
| modelos de datos que se introducirán en futuras etapas de desarrollo.       |
| Esto permite una planificación a largo plazo sin sobrecargar la              |
| implementación inicial.                                                      |
================================================================================

--- PRINCIPIOS DE DISEÑO ---

1.  **Consistencia (Saneamiento Global - Fase 0)**:
    -   **Nomenclatura**: Todas las claves de los objetos JSON están en español y siguen la convención `camelCase`.
    -   **Idioma**: El idioma principal para datos y claves es el español.
    -   **Tipado Estricto**: Se utilizan tipos de TypeScript para garantizar la integridad de los datos.
    -   **Referencias por ID**: Todas las relaciones entre entidades se realizan mediante `id` (string), nunca por nombres.

2.  **Jerarquía Clara (Núcleo Cosmológico - Fase 1)**:
    -   La estructura del universo sigue un orden lógico y anidado:
        Sistema -> CuerpoCentral (Estrella/Especial) -> Órbitas -> Objetos Orbitales -> Carga Útil (Payloads).
    -   Esta jerarquía facilita la generación procedural y la navegación por los datos.

3.  **Metadatos Estándar**:
    -   Todas las entidades principales heredan de `EntidadBase` o `EntidadJuego`, garantizando que posean un conjunto de metadatos comunes para su gestión.

Esta estructura refactorizada es la nueva "fuente de la verdad". Todo el código de generación y visualización ha sido actualizado para cumplir con este estándar.
*/

// --- METADATOS Y TIPOS BASE ---
export type EstadoEntidad = 'borrador' | 'aprobado' | 'obsoleto';

/**
 * La estructura más fundamental. Se usa para entidades que no tienen un "nombre" 
 * o "descripción" en el sentido tradicional (ej. una Órbita).
 */
export interface EntidadBase {
  id: string; // Identificador único universal (ej: "mat-madera_comun").
  estado: EstadoEntidad; // Ciclo de vida de la entidad.
  version: number; // Versionado para seguimiento de cambios.
  fechaCreacion: string; // Timestamp de creación (ISO 8601).
  fechaActualizacion: string; // Timestamp de la última modificación (ISO 8601).
}

/**
 * Extiende `EntidadBase` y es la base para el 99% de los elementos del juego 
 * (criaturas, materiales, planetas, etc.).
 */
export interface EntidadJuego extends EntidadBase {
  nombre: string; // Nombre visible en el juego.
  descripcion: string; // Texto de lore o informativo para el jugador.
  tags: string[]; // Etiquetas para filtrado y categorización (ej: ["material", "basico"]).
}

// --- TIPOS COSMOLÓGICOS (ESTRELLAS Y SISTEMAS) ---
export type TipoEstrella =
  | 'enana_roja' | 'solar' | 'enana_naranja' | 'azul_caliente' | 'gigante_roja'
  | 'enana_blanca' | 'verde_clorofotica' | 'roja_marcial' | 'azul_abisal'
  | 'cristal' | 'anomala_gravitacional';

export type ValorRelativo = 'muy_baja' | 'baja' | 'media' | 'alta' | 'muy_alta' | 'extrema';
export type TamanoRelativo = 'muy_pequeno' | 'pequeno' | 'medio' | 'grande' | 'muy_grande';
export type EdadEstelar = 'joven' | 'adulta' | 'vieja' | 'moribunda';
export type NivelActividad = 'calma' | 'activa' | 'muy_activa' | 'inestable';
export type Probabilidad = 'muy_bajo' | 'bajo' | 'medio' | 'alto' | 'muy_alto';
export type ProbabilidadSimple = 'baja' | 'media' | 'alta' | 'muy_alta';
export type IntensidadColor = 'apagada' | 'neutra' | 'saturada' | 'muy_saturada';
export type TipoIluminacion = 'dura' | 'suave' | 'fria' | 'calida' | 'verdosa' | 'espectral';

/**
 * Representa una estrella, el cuerpo central de la mayoría de los sistemas.
 * Contiene datos tanto físicos (ej. masaSolar) como de gameplay (ej. peligros).
 */
export interface Estrella extends EntidadBase {
  tipo: "ESTRELLA";
  nombreProvisional: string; // Nombre generado proceduralmente (ej. Alpha Centauri).
  tipoBase: TipoEstrella; // La clasificación base de la estrella.
  masaRelativa: ValorRelativo; // Masa en relación a otras estrellas del juego.
  radioRelativo: TamanoRelativo; // Radio en relación a otras estrellas del juego.
  luminosidadRelativa: ValorRelativo; // Brillo en relación a otras estrellas.
  temperaturaSuperficial: ValorRelativo; // Temperatura en relación a otras estrellas.
  edadEstelar: EdadEstelar; // Etapa del ciclo de vida estelar.
  metalicidad: ProbabilidadSimple; // Abundancia de elementos más pesados que el helio.
  actividad: NivelActividad; // Nivel de llamaradas solares, viento estelar, etc.
  colorPrincipal: string; // Descripción textual del color.
  colorSecundario: string[]; // Otros colores presentes en la corona, etc.
  colorCieloPlanetario: string; // Color típico del cielo en un planeta con atmósfera en este sistema.
  colorHex: string; // Código hexadecimal para representación visual.
  intensidadColor: IntensidadColor; // Saturación del color estelar.
  tipoIluminacion: TipoIluminacion; // Calidad de la luz que proyecta.
  peligros: string[]; // Peligros a nivel de sistema (ej. "Alta radiación").
  atractivosSistema: string[]; // Beneficios a nivel de sistema (ej. "Cristales de alta pureza").
  claseEstelar: string; // Clasificación espectral (O, B, A, F, G, K, M).
  masaSolar: number; // Masa en múltiplos de la masa del Sol.
  radioSolar: number; // Radio en múltiplos del radio del Sol.
  luminosidadSolar: number; // Luminosidad en múltiplos de la del Sol.
  temperaturaSuperficialK: number; // Temperatura en Kelvin.
  tipoSistema: {
    numPlanetasEstimado: [number, number]; // Rango [min, max] de planetas probables.
    probabilidadLunas: ProbabilidadSimple;
    probabilidadCinturonAsteroides: ProbabilidadSimple;
  };
  // Probabilidades de encontrar cada tipo de cristal en el sistema.
  cristales: {
    fuego: Probabilidad;
    hielo: Probabilidad;
    electrico: Probabilidad;
    gravedad: Probabilidad;
    luz: Probabilidad;
    radioactivo: Probabilidad;
    magico: Probabilidad;
    purezaMedia: ProbabilidadSimple; // Pureza media general de los cristales en el sistema.
  };
}

export type TipoCuerpoCentral = "ESTRELLA" | "AGUJERO_NEGRO" | "PULSAR";

/**
 * Representa cuerpos celestes anómalos que pueden ser el centro de un sistema,
 * como agujeros negros o púlsares.
 */
export interface CuerpoEspecial extends EntidadJuego {
  tipo: "AGUJERO_NEGRO" | "PULSAR";
  masaMs?: number; // Masa en masas solares.
  spin?: number; // Parámetro de rotación (adimensional, 0 a 1).
  periodoSpinMs?: number; // Período de rotación en milisegundos (para púlsares).
  campoMagneticoT?: number; // Campo magnético en Teslas (para púlsares).
  peligros?: string[];
  atractivosSistema?: string[];
  radioInfluenciaUA?: number; // Radio de influencia gravitacional o de peligro.
  reglasEspeciales?: string[]; // Reglas de juego únicas para este sistema.
}

/**
 * La entidad principal que engloba un cuerpo central y sus órbitas.
 * Es el contenedor de más alto nivel para una localización en el juego.
 */
export interface Sistema extends EntidadBase {
  nombre: string;
  cuerpoCentral: Estrella | CuerpoEspecial;
  orbitas: Orbita[];
  tipoSistema: 'ESTRELLA' | 'AGUJERO_NEGRO' | 'BINARIO' | 'ESPECIAL';
  semilla: string; // Semilla usada para la generación procedural.
  nivelPeligro: number; // Nivel de amenaza general del sistema (ej. 1-10).
  presenciaFaccion: { faccionId: string; influencia: number }[]; // Fase futura.
}

// --- TIPOS DE ÓRBITAS Y OBJETOS ORBITALES ---
export type TipoObjetoOrbital = "PLANETA" | "CINTURON_ASTEROIDES";
export type TipoSubOrbitaPlaneta = "LUNA" | "ANILLO";
export type TipoOrbita = "PLANETA" | "LUNA" | "CINTURON_ASTEROIDES" | "ANILLO" | "ESTACION";

/**
 * Define la trayectoria de uno o más objetos alrededor de un cuerpo padre.
 * Utiliza elementos orbitales keplerianos para describir la órbita.
 */
export interface Orbita extends EntidadBase {
  indiceOrbita: number; // Orden de la órbita desde el cuerpo central (1, 2, 3...).
  // --- Elementos Orbitales ---
  a_UA: number; // Semieje mayor en Unidades Astronómicas (distancia media).
  e: number; // Excentricidad (0=círculo, <1=elipse).
  i_deg: number; // Inclinación en grados.
  omega_deg: number; // Argumento del periastro en grados.
  Omega_deg: number; // Longitud del nodo ascendente en grados.
  M0_deg: number; // Anomalía media en la época en grados.
  // --- Contenido de la Órbita ---
  objetos: ObjetoOrbital[]; // Planetas, cinturones, etc. que comparten esta órbita.
  idPadre: string | null; // ID del cuerpo alrededor del cual se orbita.
  tipoOrbita: TipoOrbita;
  enZonaHabitable: boolean; // Simplificación para determinar si puede haber agua líquida.
}

export type ObjetoOrbital = ObjetoPlaneta | ObjetoCinturonAsteroides;

// --- PLANETAS, LUNAS, ANILLOS, CINTURONES ---
export type TipoPlaneta = "DESERTICO" | "JUNGLA" | "VOLCANICO" | "ACUATICO" | "GIGANTE_GASEOSO";

export interface CargaUtilLuna {
  nombre: string;
  descripcion: string;
  tipo: 'rocosa' | 'helada' | 'volcanica';
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

export type NivelRelativo = "low" | "medium" | "high";
export type TipoAtmosfera = "breathable" | "toxic" | "none";

export interface DistribucionBioma {
  biomeId: string;
  coverage: number; // Porcentaje de cobertura de 0.0 a 1.0.
}

/**
 * Contiene todos los datos específicos de un planeta.
 * Es el "payload" de un ObjetoPlaneta.
 */
export interface CargaUtilPlaneta {
  nombre?: string; // Nombre opcional, si no se usa el título.
  tags?: string[];
  tipoPlaneta: TipoPlaneta; // Clasificación principal del planeta.
  tituloTipoPlaneta: string; // Título descriptivo (ej. "Planeta Selvático").
  subOrbitas: ObjetoSubOrbitalPlaneta[]; // Lunas y anillos que orbitan este planeta.
  biomas: Bioma[]; // Lista de posibles biomas que existen en el planeta.
  cristales: Cristal[] | null; // Cristales encontrables. Null si no aplica (ej. gigante gaseoso).
  atmosfera: {
    composicion: string;
    notas?: string;
  };
  composicionGlobal: {
    roca: number; // %
    metal: number; // %
    hielo: number; // %
  };
  // Fase 2: Propiedades planetarias detalladas.
  gravedad: NivelRelativo;
  presion: NivelRelativo;
  tipoAtmosfera: TipoAtmosfera;
  rangoTemperaturaC: [number, number]; // [min, max]
  rangoHumedad: [number, number]; // [min, max] de 0.0 a 1.0
  distribucionBiomas: DistribucionBioma[]; // Distribución porcentual de los biomas.
  peligrosPlanetarios: string[]; // Peligros a nivel de planeta (ej. "Lluvia ácida").
  densidadVida: 'none' | NivelRelativo; // Nivel general de vida (flora/fauna).
}

/**
 * Contenedor para la carga útil de un planeta.
 * Actúa como la entidad principal en una órbita.
 */
export interface ObjetoPlaneta extends EntidadBase {
  tipo: "PLANETA";
  cargaUtil: CargaUtilPlaneta;
}
export interface ObjetoCinturonAsteroides extends EntidadBase {
  tipo: "CINTURON_ASTEROIDES";
  cargaUtil: CargaUtilCinturonAsteroides;
}

// --- BIOMAS Y CRISTALES ---
export type TipoCristal = "FUEGO" | "HIELO" | "ELECTRICO" | "GRAVEDAD" | "MAGICO" | "LUZ" | "RADIOACTIVO";

export interface Cristal {
  tipo: TipoCristal;
  pureza: number; // De 0.0 a 1.0.
}

export type CategoriaBiome =
  | 'DESIERTO' | 'MONTAÑA' | 'BOSQUE' | 'JUNGLA' | 'PANTANO' | 'TUNDRA'
  | 'VOLCANICO' | 'INOSPITO' | 'SUBTERRANEO' | 'LECHO_MARINO' | 'PLAYA'
  | 'ACANTILADO' | 'OCEANO_ABIERTO';

export type NivelLuz = "dark" | "dim" | "normal" | "bright";

/**
 * Representa una región específica dentro de un planeta con su propio
 * clima, flora, fauna y recursos.
 */
export interface Bioma extends EntidadJuego {
  categoria: CategoriaBiome; // Clasificación general del bioma.
  faunaPosible: string[]; // IDs de la fauna que puede aparecer.
  floraPosible: string[]; // IDs de la flora que puede aparecer.
  mineralesPosibles: string[]; // IDs de los minerales que pueden aparecer.
  // Fase 2: Propiedades de bioma detalladas.
  clima: {
    rangoTemperaturaC: [number, number];
    rangoHumedad: [number, number];
    rangoAltitud: [number, number]; // En metros.
  };
  nivelLuz: NivelLuz; // Nivel de luz ambiental.
  peligros: string[]; // Peligros específicos del bioma.
  densidad: {
    densidadFauna: NivelRelativo;
    densidadFlora: NivelRelativo;
    riquezaRecursos: NivelRelativo;
  };
}

// --- RECURSOS (FASE 3) ---
export type Rareza = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ElementoCristal = "FIRE" | "ICE" | "ELECTRIC" | "GRAVITY" | "NEUTRAL";
export type Escalado = "LINEAR" | "EXPONENTIAL";

/**
 * Propiedades base para cualquier recurso recolectable en el juego.
 */
export interface RecursoBase {
  rareza: Rareza;
  tier: number; // Nivel de progresión del recurso.
  valorBase: number; // Valor en la economía del juego.
  spawn: SpawnInfo; // Información sobre dónde encontrar el recurso.
}
export interface SpawnInfo {
  planetIds?: string[]; // Planetas específicos.
  biomeIds?: string[]; // Biomas específicos.
  depthRange?: [number, number]; // Rango de profundidad/altitud.
}

// --- ARQUETIPOS / WIKI ---
export type OrigenMaterial = 'vegetal' | 'animal' | 'mineral';

/**
 * Materiales procesados o recolectados directamente.
 */
export interface Material extends EntidadJuego, RecursoBase {
  origen: OrigenMaterial;
}

export interface Mineral extends EntidadJuego, RecursoBase {}

export type TipoPlanta = "tree" | "bush" | "grass";
export interface ReglasCosecha {
  herramientaRequeridaId: string | null;
  rendimiento: { itemId: string; cantidad: [number, number] }[];
  tiempoRecrecimiento: number; // En segundos.
}
export interface Planta extends EntidadJuego {
  materiales: string[]; // Array de IDs de materiales que se obtienen de esta planta.
  // Fase 6
  tipoPlanta: TipoPlanta;
  biomeIds: string[];
  etapasCrecimiento: number;
  reglasCosecha: ReglasCosecha;
}

export interface ArquetipoCristal extends EntidadJuego, RecursoBase {
  tipoCristal: TipoCristal;
  // Fase 3
  elemento: ElementoCristal; // Elemento de daño/efecto asociado.
  potenciaBase: number; // Potencia base para crafteo o habilidades.
  escalado: Escalado; // Cómo escala la potencia.
  tiposArmaCompatibles: string[]; // IDs de tipos de armas.
  tiposHerramientaCompatibles:string[]; // IDs de tipos de herramientas.
}

// --- TIPOS DE FAUNA ---
export type Dieta = 'herbivoro' | 'carnivoro' | 'omnivoro' | 'carronero';
export const TODAS_DIETAS: Dieta[] = ['herbivoro', 'carnivoro', 'omnivoro', 'carronero'];
export type ComportamientoSocial = 'solitario' | 'pareja' | 'manada_caza' | 'manada_defensiva' | 'enjambre' | 'colonia' | 'cardumen';
export const TODOS_COMPORTAMIENTOS_SOCIALES: ComportamientoSocial[] = ['solitario', 'pareja', 'manada_caza', 'manada_defensiva', 'enjambre', 'colonia', 'cardumen'];
export type ReinoAnimal = 'mamifero' | 'dinosaurio_aviano' | 'dinosaurio_reptiloide' | 'artropodo' | 'pez' | 'anfibio' | 'molusco' | 'constructo_silicio' | 'fungoide';
export const TODOS_REINOS_ANIMALES: ReinoAnimal[] = ['mamifero', 'dinosaurio_aviano', 'dinosaurio_reptiloide', 'artropodo', 'pez', 'anfibio', 'molusco', 'constructo_silicio', 'fungoide'];
export type TamanoFauna = 'diminuto' | 'pequeno' | 'medio' | 'grande' | 'muy_grande' | 'colosal';
export const TODOS_TAMANOS_FAUNA: TamanoFauna[] = ['diminuto', 'pequeno', 'medio', 'grande', 'muy_grande', 'colosal'];
export type Locomocion = 'terrestre' | 'acuatico' | 'volador' | 'anfibio' | 'excavador' | 'estacionario';
export const TODAS_LOCOMOCIONES: Locomocion[] = ['terrestre', 'acuatico', 'volador', 'anfibio', 'excavador', 'estacionario'];
export type FormaCorporal = 'vertebrado' | 'insectoide' | 'serpentino' | 'moluscoide' | 'fungoide' | 'amorfo' | 'cuadrupedo_masivo';
export const TODAS_FORMAS_CORPORALES: FormaCorporal[] = ['vertebrado', 'insectoide', 'serpentino', 'moluscoide', 'fungoide', 'amorfo', 'cuadrupedo_masivo'];
export type TipoExtremidadesDelanteras = 'ninguna' | 'garras' | 'pinzas' | 'manos' | 'aletas' | 'tentaculos';
export const TODAS_EXTREMIDADES_DELANTERAS: TipoExtremidadesDelanteras[] = ['ninguna', 'garras', 'pinzas', 'manos', 'aletas', 'tentaculos'];
export type TagUtilidadCola = 'equilibrio' | 'ataque' | 'defensa' | 'natacion' | 'comunicacion';
export const TODOS_TAGS_UTILIDAD_COLA: TagUtilidadCola[] = ['equilibrio', 'ataque', 'defensa', 'natacion', 'comunicacion'];
export type Temperamento = 'docil' | 'defensivo' | 'territorial' | 'agresivo' | 'oportunista' | 'plaga';
export const TODOS_TEMPERAMENTOS: Temperamento[] = ['docil', 'defensivo', 'territorial', 'agresivo', 'oportunista', 'plaga'];
export type RolCombate = 'tanque' | 'dps_cuerpo_a_cuerpo' | 'dps_distancia' | 'asesino' | 'sigilo' | 'control_de_area' | 'jefe';
export const TODOS_ROLES_COMBATE: RolCombate[] = ['tanque', 'dps_cuerpo_a_cuerpo', 'dps_distancia', 'asesino', 'sigilo', 'control_de_area', 'jefe'];
export type TagUtilidad = 'montura' | 'bestia_de_carga' | 'mascota' | 'simbionte';
export const TODOS_TAGS_UTILIDAD: TagUtilidad[] = ['montura', 'bestia_de_carga', 'mascota', 'simbionte'];

export interface Drop {
  materialId: string;
  min: number;
  max: number;
  chance: number; // De 0.0 a 1.0.
}

export interface Fauna extends EntidadJuego {
  // Fase 4
  reino: ReinoAnimal;
  tamano: TamanoFauna;
  locomocion: Locomocion;
  formaCorporal: FormaCorporal;
  cantidadExtremidades: number;
  tipoExtremidadesDelanteras: TipoExtremidadesDelanteras;
  tieneCola: boolean;
  utilidadCola: TagUtilidadCola[];
  // Fase 5
  dieta: Dieta;
  comportamientoSocial: ComportamientoSocial;
  temperamento: Temperamento;
  rolCombate: RolCombate[];
  utilidad: TagUtilidad[];
  drops: Drop[];
  // Fase 6
  biomeIds: string[];
  nivelAmenaza: number; // 1-10
  stats: {
    salud: number;
    dano: number;
    velocidad: number;
    rangoPercepcion: number; // En metros.
    rangoAgresividad: number; // En metros.
  };
  idPerfilIA: string | null;
}

// --- TIPOS DE ESPECIES INTELIGENTES ---
export interface ReglaGameplay {
  titulo: string;
  descripcion: string;
}
export interface Metabolismo {
  dieta: Dieta;
  entornosFavorables: string[];
  entornosDesfavorables: string[];
}
export interface EspecieInteligente extends EntidadJuego {
  lore: string[];
  reglasGameplay: ReglaGameplay[];
  debilidades: string[];
  restriccionesDiseno: string[];
  planetasComunes: TipoPlaneta[];
  colorClave: string; // Hex color for UI representation.
  // Fase 7
  urlImagen?: string | null; // URL a un concept art de la especie.
  modificadoresStatsBase: {
    salud?: number;
    aguante?: number;
    ataque?: number;
    defensa?: number;
  };
  biomasInicio: string[]; // IDs de biomas.
  metabolismo: Metabolismo;
  afinidadCristales: TipoCristal[];
}

// --- TIPOS DE EQUIPO, RECETAS, ETC. ---
export type TipoArma = 'espada' | 'hacha_combate' | 'martillo' | 'lanza' | 'arco' | 'ballesta';
export type TipoHerramienta = 'pico' | 'hacha_tala' | 'pala' | 'martillo_crafteo';

export interface EquipoBase extends EntidadJuego {
  tier: number;
  rareza: Rareza;
  durabilidad: number;
  tiposCristalCompatibles: TipoCristal[];
  idPatronAtaque: string | null; // ID a un patrón de ataque (ej. 'barrido_espada').
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
  eficiencia: number; // Multiplicador de recolección.
}

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
  // Fase 5
  idEstacionCrafteo: string | null; // Null = crafteo de inventario.
  tiempoCrafteo: number; // En segundos.
  requisitoHabilidad: { habilidadId: string; nivel: number } | null;
}

// --- TIPO JUGADOR ---
export interface Jugador extends EntidadJuego {
  statsBase: {
    salud: number;
    aguante: number;
    ataque: number;
    defensa: number;
    velocidadMovimiento: number;
    capacidadCarga: number;
    resistencias: Record<string, number>; // Ej. { fuego: 0.25 }
  };
  especieId?: string;
  itemsInicio: { itemId: string; cantidad: number }[];
}

// --- TIPO EFECTO ---
export type TipoEfecto = "BUFF" | "DEBUFF" | "NEUTRAL";

export interface Efecto extends EntidadJuego {
  tipoEfecto: TipoEfecto;
  mecanicasGameplay: string[];
  // Fase 5
  duracion: number; // En segundos.
  magnitud: number; // Potencia del efecto.
  maxAcumulaciones: number; // Cuántas veces se puede apilar.
  aplicaA: ('jugador' | 'fauna')[];
}

// --- TIPOS DE TABLA (Para constantes) ---
export type TablaEstrellas = {
  [key in TipoEstrella]: Omit<Estrella, 'id' | 'tipo' | 'nombreProvisional' | 'estado' | 'version' | 'fechaCreacion' | 'fechaActualizacion'> & { peso: number };
};


export type GameEntity = Jugador | Fauna | Planta | Mineral | Material | Bioma | EspecieInteligente | ArquetipoCristal | Arma | Herramienta | Efecto;