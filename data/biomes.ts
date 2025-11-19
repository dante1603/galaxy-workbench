
import { Bioma } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 4, fechaCreacion: now, fechaActualizacion: now, tags: [] };
const defaultFase2 = {
  clima: { rangoTemperaturaC: [10, 30] as [number, number], rangoHumedad: [0.3, 0.7] as [number, number], rangoAltitud: [0, 1000] as [number, number] },
  nivelLuz: 'normal' as const,
  peligros: [],
  densidad: { densidadFauna: 'medium' as const, densidadFlora: 'medium' as const, riquezaRecursos: 'medium' as const }
};

export const ALL_BIOMES: Bioma[] = [
  // --- DESERT BIOMES ---
  {
    ...base,
    ...defaultFase2,
    id: 'desierto_arido',
    nombre: 'Mar de Dunas',
    descripcion: 'Océanos de arena de silicato que se extienden hasta el horizonte. La vida se oculta bajo la superficie durante el día para evitar la radiación solar binaria.',
    categoria: 'DESIERTO',
    tipoSuelo: 'arena_fina',
    faunaPosible: ['f_aracnido_silice', 'f_verme_duna', 'f_compy_adaptable'],
    floraPosible: ['p_cactus_vidrio', 'p_hierba_seca', 'p_arbusto_roca', 'p_oasis'],
    mineralesPosibles: ['min_hierro_duna', 'min_sal_leviatan'],
    clima: { rangoTemperaturaC: [35, 65], rangoHumedad: [0.0, 0.15], rangoAltitud: [0, 400] },
    nivelLuz: 'bright',
    peligros: ['Tormentas de arena', 'Golpe de calor'],
    densidad: { densidadFauna: 'low', densidadFlora: 'low', riquezaRecursos: 'medium' },
  },
  {
    ...base,
    ...defaultFase2,
    id: 'desierto_salino',
    nombre: 'Salinas Cristalinas',
    descripcion: 'Antiguo lecho marino evaporado. La superficie es una costra blanca cegadora de sal y minerales. Extremadamente hostil.',
    categoria: 'DESIERTO',
    tipoSuelo: 'cristal_bruto',
    faunaPosible: ['f_aracnido_silice', 'f_compy_adaptable'], // Pocos sobreviven aquí
    floraPosible: ['p_raiz_espectral'],
    mineralesPosibles: ['min_sal_leviatan', 'min_veta_bismuto'],
    clima: { rangoTemperaturaC: [25, 55], rangoHumedad: [0.0, 0.05], rangoAltitud: [0, 200] },
    nivelLuz: 'bright',
    peligros: ['Reflejo cegador', 'Deshidratación acelerada'],
    densidad: { densidadFauna: 'low', densidadFlora: 'low', riquezaRecursos: 'high' },
  },
  
  // --- MOUNTAIN BIOMES ---
  {
    ...base,
    ...defaultFase2,
    id: 'cumbres_rocosas',
    nombre: 'Agujas de Piedra',
    descripcion: 'Formaciones montañosas verticales y afiladas donde el viento aúlla constantemente. El hogar de depredadores aéreos.',
    categoria: 'MONTAÑA',
    tipoSuelo: 'roca_solida',
    faunaPosible: ['f_kestrel_termico'],
    floraPosible: ['p_flor_roca', 'p_pino_aguja_gris'],
    mineralesPosibles: ['min_nodulo_cobre', 'min_titanio_bruto', 'min_obsidiana_filosa'],
    clima: { rangoTemperaturaC: [-5, 20], rangoHumedad: [0.2, 0.5], rangoAltitud: [1500, 4000] },
    nivelLuz: 'bright',
    peligros: ['Caídas mortales', 'Vientos huracanados'],
    densidad: { densidadFauna: 'medium', densidadFlora: 'low', riquezaRecursos: 'high' },
  },

  // --- FOREST/JUNGLE BIOMES ---
  {
    ...base,
    ...defaultFase2,
    id: 'selva_humeda',
    nombre: 'Jungla Xeno-Tropical',
    descripcion: 'Bioma de alta densidad con mega-flora que bloquea la luz solar. El suelo es rico en nutrientes pero bullente de parásitos.',
    categoria: 'JUNGLA',
    tipoSuelo: 'tierra_fertil',
    faunaPosible: ['f_acechador_umbrio', 'f_simio_micelial', 'f_caracol_galopador', 'f_compy_adaptable'],
    floraPosible: ['p_ceiba', 'p_arbusto_liana', 'p_musgo_luminoso', 'p_orquidea_fantasma', 'p_liana_estranguladora', 'p_hongo_pulso'],
    mineralesPosibles: ['min_nodulo_cobre', 'min_veta_bismuto'],
    clima: { rangoTemperaturaC: [24, 38], rangoHumedad: [0.8, 1.0], rangoAltitud: [0, 600] },
    nivelLuz: 'dim',
    peligros: ['Flora depredadora', 'Visibilidad reducida', 'Envenenamiento'],
    densidad: { densidadFauna: 'high', densidadFlora: 'high', riquezaRecursos: 'high' },
  },
  {
    ...base,
    ...defaultFase2,
    id: 'bosque_templado',
    nombre: 'Bosque de Coníferas Gigantes',
    descripcion: 'Árboles de corteza dura que alcanzan cientos de metros. Un bioma equilibrado y rico en madera.',
    categoria: 'BOSQUE',
    tipoSuelo: 'tierra_fertil',
    faunaPosible: ['f_caracol_galopador', 'f_compy_adaptable'], // Fauna más estándar
    floraPosible: ['p_pino_aguja_gris', 'p_ceiba'],
    mineralesPosibles: ['min_nodulo_cobre'],
    clima: { rangoTemperaturaC: [10, 25], rangoHumedad: [0.4, 0.7], rangoAltitud: [200, 1000] },
    nivelLuz: 'normal',
    densidad: { densidadFauna: 'medium', densidadFlora: 'high', riquezaRecursos: 'medium' },
  },

  // --- TUNDRA BIOMES ---
  {
    ...base,
    ...defaultFase2,
    id: 'tundra_helada',
    nombre: 'Páramo de Permafrost',
    descripcion: 'Tierra congelada donde el suelo nunca se deshiela. La vida es escasa y resistente, adaptada al ciclo de congelación.',
    categoria: 'TUNDRA',
    tipoSuelo: 'hielo_permafrost',
    faunaPosible: ['f_aikia'], // Aikia es nativa y protegida de aquí
    floraPosible: ['p_musgo_luminoso', 'p_pino_aguja_gris', 'p_arbusto_baya_escarcha'],
    mineralesPosibles: ['min_hielo_seco', 'min_cuarzo_azul'],
    clima: { rangoTemperaturaC: [-40, -10], rangoHumedad: [0.1, 0.4], rangoAltitud: [200, 1200] },
    nivelLuz: 'normal', // O 'dim' en invierno
    peligros: ['Hipotermia', 'Tormentas de nieve'],
    densidad: { densidadFauna: 'low', densidadFlora: 'low', riquezaRecursos: 'medium' },
  },

  // --- VOLCANIC BIOMES ---
  {
    ...base,
    ...defaultFase2,
    id: 'llanura_volcanica',
    nombre: 'Campos de Basalto',
    descripcion: 'Actividad geológica reciente ha cubierto la zona de lava enfriada y ceniza. El aire es tóxico y el suelo inestable.',
    categoria: 'VOLCANICO',
    tipoSuelo: 'ceniza_volcanica',
    faunaPosible: ['f_lagarto_titan', 'f_kestrel_termico'],
    floraPosible: [], // Muy poca flora
    mineralesPosibles: ['min_azufre_cristalino', 'min_obsidiana_filosa', 'min_magma_congelado'],
    clima: { rangoTemperaturaC: [50, 200], rangoHumedad: [0.0, 0.2], rangoAltitud: [100, 1500] },
    nivelLuz: 'dim', // Por el humo y ceniza
    peligros: ['Gases tóxicos', 'Erupciones activas', 'Lava'],
    densidad: { densidadFauna: 'low', densidadFlora: 'low', riquezaRecursos: 'high' },
  },

  // --- AQUATIC BIOMES ---
  {
    ...base,
    ...defaultFase2,
    id: 'oceano_abierto',
    nombre: 'Océano Global',
    descripcion: 'Vastas extensiones de agua salada. La superficie es turbulenta, pero la verdadera riqueza está bajo las olas.',
    categoria: 'OCEANO_ABIERTO',
    tipoSuelo: 'lecho_marino',
    faunaPosible: ['f_tiburón_plaocodermo'],
    floraPosible: ['p_kelp'],
    mineralesPosibles: ['min_sal_leviatan'],
    clima: { rangoTemperaturaC: [15, 25], rangoHumedad: [1.0, 1.0], rangoAltitud: [0, 0] },
    densidad: { densidadFauna: 'medium', densidadFlora: 'medium', riquezaRecursos: 'medium' },
  },
  {
    ...base,
    ...defaultFase2,
    id: 'arrecife_coralino',
    nombre: 'Arrecife Bioluminiscente',
    descripcion: 'Aguas someras repletas de estructuras de coral que brillan en la oscuridad. Un paraíso visual y biológico.',
    categoria: 'LECHO_MARINO',
    tipoSuelo: 'arena_fina',
    faunaPosible: ['f_tiburón_plaocodermo'],
    floraPosible: ['p_anemona', 'p_coral_electrico', 'p_alga_bio'],
    mineralesPosibles: ['min_sal_leviatan'],
    clima: { rangoTemperaturaC: [22, 28], rangoHumedad: [1.0, 1.0], rangoAltitud: [-50, -5] },
    nivelLuz: 'bright', // Por bioluminiscencia
    densidad: { densidadFauna: 'high', densidadFlora: 'high', riquezaRecursos: 'medium' },
  },
  {
    ...base,
    ...defaultFase2,
    id: 'abismo_abisal',
    nombre: 'Fosa de las Marianas (Xeno)',
    descripcion: 'Profundidades aplastantes donde la única luz es biológica. Hogar de pesadillas y recursos extraños.',
    categoria: 'LECHO_MARINO',
    tipoSuelo: 'barro_denso',
    faunaPosible: ['f_kraken_abisal'],
    floraPosible: ['p_alga_bio'], // Versiones profundas
    mineralesPosibles: ['min_barro_ferromagnetico'],
    clima: { rangoTemperaturaC: [2, 5], rangoHumedad: [1.0, 1.0], rangoAltitud: [-8000, -1000] },
    nivelLuz: 'dark',
    peligros: ['Presión extrema', 'Oscuridad total'],
    densidad: { densidadFauna: 'low', densidadFlora: 'low', riquezaRecursos: 'high' },
  },

  // --- UNDERGROUND / CAVE BIOMES (NUEVO) ---
  {
    ...base,
    ...defaultFase2,
    id: 'cavernas_cristalinas',
    nombre: 'Geoda Gigante Subterránea',
    descripcion: 'Redes de cuevas masivas donde cristales geométricos crecen de las paredes. La acústica es extraña y resonante.',
    categoria: 'SUBTERRANEO',
    tipoSuelo: 'grava_mineral',
    faunaPosible: ['f_aracnido_silice', 'f_simio_micelial'], // Adaptados a la oscuridad
    floraPosible: ['p_hongo_pulso', 'p_musgo_luminoso'],
    mineralesPosibles: ['min_veta_bismuto', 'min_nodulo_cobre', 'min_titanio_bruto'],
    clima: { rangoTemperaturaC: [10, 15], rangoHumedad: [0.8, 0.9], rangoAltitud: [-500, -2000] },
    nivelLuz: 'dim',
    peligros: ['Derrumbes', 'Gases atrapados'],
    densidad: { densidadFauna: 'medium', densidadFlora: 'low', riquezaRecursos: 'high' },
  },

  // --- EXOTIC / HORROR BIOMES (NUEVO) ---
  {
    ...base,
    ...defaultFase2,
    id: 'paramo_organico',
    nombre: 'Superficie de Carne',
    descripcion: 'Un paisaje inquietante donde el suelo es tejido vivo, los árboles son hueso calcificado y los ríos son de fluidos viscosos.',
    categoria: 'INOSPITO',
    tipoSuelo: 'carne_viva',
    faunaPosible: ['f_acechador_umbrio', 'f_verme_duna'], // Depredadores que se alimentan del planeta
    floraPosible: ['p_hongo_pulso', 'p_raiz_espectral'],
    mineralesPosibles: ['min_metal_sangre', 'min_carne_fosilizada'],
    clima: { rangoTemperaturaC: [36, 40], rangoHumedad: [0.9, 1.0], rangoAltitud: [0, 500] },
    nivelLuz: 'dim',
    peligros: ['Suelo ácido', 'Terreno pegajoso', 'Terror psicológico'],
    densidad: { densidadFauna: 'high', densidadFlora: 'medium', riquezaRecursos: 'high' },
  },

  // --- SPACE / INHOSPITABLE ---
  {
    ...base,
    ...defaultFase2,
    id: 'regolito_inospito',
    nombre: 'Regolito Lunar',
    descripcion: 'Polvo gris fino y rocas de impacto. Sin atmósfera, expuesto al vacío del espacio. Solo habitado por entidades de silicio.',
    categoria: 'INOSPITO',
    tipoSuelo: 'regolito_polvoriento',
    faunaPosible: ['f_fauces_regolito'],
    floraPosible: [],
    mineralesPosibles: ['min_hierro_duna', 'min_titanio_bruto'],
    clima: { rangoTemperaturaC: [-150, 120], rangoHumedad: [0.0, 0.0], rangoAltitud: [0, 5000] },
    nivelLuz: 'bright',
    peligros: ['Vacío', 'Radiación', 'Micro-meteoritos'],
    densidad: { densidadFauna: 'low', densidadFlora: 'low', riquezaRecursos: 'medium' },
  },
];
