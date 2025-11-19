
import { Planta } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 3, fechaCreacion: now, fechaActualizacion: now };
const defaultReglasCosecha = { herramientaRequeridaId: null, tiempoRecrecimiento: 600 };
const defaultPlantFase6 = { etapasCrecimiento: 3, reglasCosecha: defaultReglasCosecha };

export const ALL_PLANTS: Planta[] = [
  // DESERTICO
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_oasis", 
    nombre: "Palmera Oasis", 
    descripcion: "Una palmera resistente que crece cerca de las raras fuentes de agua del desierto.", 
    tags: ["DESERTICO", "ALIMENTO"], 
    frutaId: 'm_datil_espacial',
    drops: [
        { materialId: 'madera', min: 3, max: 6, chance: 1.0 },
        { materialId: 'hojas', min: 2, max: 4, chance: 0.8 },
        { materialId: 'm_datil_espacial', min: 1, max: 3, chance: 0.5 }
    ],
    estructura: 'arborea',
    follaje: 'fronda',
    reproduccion: 'fruto_comestible',
    biomeIds: ['desierto_arido', 'playa_arena_blanca'],
    habitat: { luzRequerida: 'pleno_sol', sueloPreferido: 'arena', patronDistribucion: 'parches' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_arbusto_roca", 
    nombre: "Arbusto de Roca", 
    descripcion: "Un arbusto bajo y robusto que se camufla entre las rocas del desierto.", 
    tags: ["DESERTICO", "CAMUFLAJE"], 
    drops: [
        { materialId: 'palos', min: 2, max: 4, chance: 1.0 },
        { materialId: 'fibra', min: 1, max: 2, chance: 0.6 }
    ],
    estructura: 'arbustiva',
    follaje: 'sin_hojas',
    reproduccion: 'semillas_voladoras',
    biomeIds: ['desierto_arido'],
    habitat: { luzRequerida: 'pleno_sol', sueloPreferido: 'roca', patronDistribucion: 'solitario' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_hierba_seca", 
    nombre: "Hierba Seca", 
    descripcion: "Matas de hierba resistente a la sequía, una fuente principal de fibra en zonas áridas.", 
    tags: ["DESERTICO", "FIBRA"], 
    drops: [
        { materialId: 'fibra', min: 2, max: 5, chance: 1.0 }
    ],
    estructura: 'herbacea',
    follaje: 'hoja_ancha', // Seca
    reproduccion: 'esporas',
    biomeIds: ['desierto_arido'],
    habitat: { luzRequerida: 'pleno_sol', sueloPreferido: 'arena', patronDistribucion: 'alfombra' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_cactus_vidrio", 
    nombre: "Cactus de Vidrio", 
    descripcion: "Un cactus cuyas espinas son de silicato afilado y cuya pulpa almacena grandes cantidades de agua.", 
    tags: ["DESERTICO", "AGUA", "PELIGRO"], 
    drops: [
        { materialId: 'carne_cactus', min: 1, max: 3, chance: 1.0 },
        { materialId: 'sabia', min: 1, max: 1, chance: 0.3 }
    ],
    estructura: 'succulenta_gigante',
    follaje: 'espinas',
    reproduccion: 'floracion_nectar',
    biomeIds: ['desierto_arido'],
    habitat: { luzRequerida: 'pleno_sol', sueloPreferido: 'arena', patronDistribucion: 'solitario' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_flor_roca", 
    nombre: "Flor de Roca", 
    descripcion: "Una pequeña flor que crece en las grietas de las rocas, produciendo una savia de colores vivos.", 
    tags: ["DESERTICO", "MEDICINAL"], 
    frutaId: 'm_nectar_roca',
    drops: [
        { materialId: 'm_nectar_roca', min: 1, max: 1, chance: 1.0 },
        { materialId: 'sabia', min: 1, max: 1, chance: 0.5 }
    ],
    estructura: 'herbacea',
    follaje: 'suculenta',
    reproduccion: 'floracion_nectar',
    biomeIds: ['cumbres_rocosas'],
    habitat: { luzRequerida: 'media', sueloPreferido: 'roca', patronDistribucion: 'solitario' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_raiz_espectral", 
    nombre: "Raíz Seca Espectral", 
    descripcion: "Una red de raíces que a veces crece sobre la superficie, brillando débilmente al anochecer.", 
    tags: ["DESERTICO", "LUZ"], 
    drops: [
        { materialId: 'palos', min: 1, max: 3, chance: 0.9 },
        { materialId: 'sabia', min: 1, max: 1, chance: 0.2 }
    ],
    estructura: 'parasita',
    follaje: 'sin_hojas',
    reproduccion: 'rizomas',
    biomeIds: ['desierto_salino'],
    habitat: { luzRequerida: 'sombra', sueloPreferido: 'cieno', patronDistribucion: 'parches' }
  },

  // JUNGLA
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_ceiba", 
    nombre: "Árbol Ceiba Gigante", 
    descripcion: "Un árbol masivo que forma el dosel de la jungla, soportando su propio ecosistema.", 
    tags: ["JUNGLA", "MADERA"], 
    frutaId: 'm_higo_ceiba',
    drops: [
        { materialId: 'madera', min: 10, max: 20, chance: 1.0 },
        { materialId: 'hojas', min: 5, max: 10, chance: 0.8 },
        { materialId: 'sabia', min: 1, max: 3, chance: 0.4 },
        { materialId: 'm_higo_ceiba', min: 1, max: 2, chance: 0.3 }
    ],
    estructura: 'arborea',
    follaje: 'hoja_ancha',
    reproduccion: 'vainas',
    biomeIds: ['selva_humeda', 'bosque_templado'],
    habitat: { luzRequerida: 'pleno_sol', sueloPreferido: 'tierra', patronDistribucion: 'bosque_denso' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_arbusto_liana", 
    nombre: "Arbusto de Lianas", 
    descripcion: "Un denso arbusto del que brotan lianas fuertes y flexibles.", 
    tags: ["JUNGLA", "OBSTACULO"], 
    frutaId: 'm_bayas_toxicas',
    drops: [
        { materialId: 'palos', min: 2, max: 4, chance: 1.0 },
        { materialId: 'fibra', min: 2, max: 5, chance: 0.9 },
        { materialId: 'm_bayas_toxicas', min: 1, max: 5, chance: 0.5 }
    ],
    estructura: 'arbustiva',
    follaje: 'fronda',
    reproduccion: 'fruto_toxico',
    biomeIds: ['selva_humeda'],
    habitat: { luzRequerida: 'media', sueloPreferido: 'tierra', patronDistribucion: 'parches' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_musgo_luminoso", 
    nombre: "Musgo Luminoso", 
    descripcion: "Un musgo bioluminiscente que prospera en la humedad y la oscuridad de la jungla.", 
    tags: ["JUNGLA", "LUZ"], 
    drops: [
        { materialId: 'fibra', min: 1, max: 2, chance: 1.0 },
        { materialId: 'glandula_luminosa', min: 1, max: 1, chance: 0.1 }
    ],
    estructura: 'herbacea',
    follaje: 'bioluminiscente',
    reproduccion: 'esporas',
    biomeIds: ['selva_humeda', 'cienaga_manglares', 'tundra_helada'],
    habitat: { luzRequerida: 'sombra', sueloPreferido: 'roca', patronDistribucion: 'alfombra' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_orquidea_fantasma", 
    nombre: "Orquídea Fantasma", 
    descripcion: "Una orquídea rara que parece flotar en el aire, con pétalos casi translúcidos.", 
    tags: ["JUNGLA", "RARO"], 
    frutaId: 'm_nectar_espectral', // Updated to specific item
    drops: [
        { materialId: 'm_nectar_espectral', min: 1, max: 1, chance: 1.0 },
        { materialId: 'sabia', min: 1, max: 2, chance: 0.8 }
    ],
    estructura: 'epifita',
    follaje: 'membrana',
    reproduccion: 'floracion_nectar',
    biomeIds: ['selva_humeda'],
    habitat: { luzRequerida: 'sombra', sueloPreferido: 'tierra', patronDistribucion: 'solitario' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_liana_estranguladora", 
    nombre: "Liana Estranguladora", 
    descripcion: "Una liana agresiva que envuelve a otras plantas e incluso a la fauna.", 
    tags: ["JUNGLA", "PELIGRO"], 
    drops: [
        { materialId: 'fibra', min: 3, max: 6, chance: 1.0 },
        { materialId: 'palos', min: 1, max: 2, chance: 0.5 }
    ],
    estructura: 'liana',
    follaje: 'hoja_ancha',
    reproduccion: 'semillas_voladoras',
    biomeIds: ['selva_humeda', 'cienaga_manglares'],
    habitat: { luzRequerida: 'media', sueloPreferido: 'tierra', patronDistribucion: 'parches' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_hongo_pulso", 
    nombre: "Hongo de Pulso", 
    descripcion: "Un hongo grande que se contrae y expande lentamente, liberando esporas luminosas.", 
    tags: ["JUNGLA", "COMIDA"], 
    frutaId: 'm_esporas_neon',
    drops: [
        { materialId: 'biomasa_fungica', min: 1, max: 3, chance: 1.0 },
        { materialId: 'm_esporas_neon', min: 1, max: 2, chance: 0.7 }
    ],
    estructura: 'hongo',
    follaje: 'sin_hojas',
    reproduccion: 'esporas',
    biomeIds: ['selva_humeda'],
    habitat: { luzRequerida: 'oscuridad_total', sueloPreferido: 'cieno', patronDistribucion: 'parches' }
  },

  // ACUATICO
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_kelp", 
    nombre: "Bosque de Kelp Gigante", 
    descripcion: "Enormes algas que forman densos bosques submarinos, un hábitat clave para la vida marina.", 
    tags: ["ACUATICO", "REFUGIO"], 
    drops: [
        { materialId: 'fibra', min: 4, max: 8, chance: 1.0 },
        { materialId: 'hojas', min: 2, max: 4, chance: 0.8 }
    ],
    estructura: 'acuatica_sumergida',
    follaje: 'fronda',
    reproduccion: 'esporas',
    biomeIds: ['oceano_abierto'],
    habitat: { luzRequerida: 'media', sueloPreferido: 'agua', patronDistribucion: 'bosque_denso' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_anemona", 
    nombre: "Anémona de Pulso", 
    descripcion: "Una anémona que emite pulsos de luz para atraer a sus presas.", 
    tags: ["ACUATICO", "LUZ"], 
    drops: [
        { materialId: 'sabia', min: 1, max: 2, chance: 0.8 }
    ],
    estructura: 'parasita',
    follaje: 'membrana',
    reproduccion: 'rizomas',
    biomeIds: ['arrecife_coralino'],
    habitat: { luzRequerida: 'media', sueloPreferido: 'roca', patronDistribucion: 'parches' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_coral_electrico", 
    nombre: "Coral Eléctrico", 
    descripcion: "Un coral que genera una débil carga eléctrica como mecanismo de defensa.", 
    tags: ["ACUATICO", "PELIGRO", "ENERGIA"], 
    drops: [
        { materialId: 'palos', min: 1, max: 2, chance: 0.8 },
        { materialId: 'glandula_electrica', min: 0, max: 1, chance: 0.05 } // Raro
    ],
    estructura: 'acuatica_sumergida',
    follaje: 'cristalino',
    reproduccion: 'esporas',
    biomeIds: ['arrecife_coralino'],
    habitat: { luzRequerida: 'pleno_sol', sueloPreferido: 'roca', patronDistribucion: 'parches' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_alga_bio", 
    nombre: "Alga Bioluminiscente", 
    descripcion: "Algas que iluminan las aguas poco profundas, a menudo en simbiosis con otras formas de vida.", 
    tags: ["ACUATICO", "LUZ"], 
    frutaId: 'm_bulbo_abismal', // Updated to specific item
    drops: [
        { materialId: 'fibra', min: 1, max: 3, chance: 1.0 },
        { materialId: 'm_bulbo_abismal', min: 1, max: 2, chance: 0.6 }
    ],
    estructura: 'acuatica_flotante',
    follaje: 'bioluminiscente',
    reproduccion: 'esporas',
    biomeIds: ['arrecife_coralino', 'selva_humeda'],
    habitat: { luzRequerida: 'media', sueloPreferido: 'agua', patronDistribucion: 'alfombra' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_esponja_silicato", 
    nombre: "Esponja de Silicato", 
    descripcion: "Una esponja de mar con un esqueleto de fibras de silicato, flexible pero resistente.", 
    tags: ["ACUATICO", "MATERIAL"], 
    drops: [
        { materialId: 'fibra', min: 2, max: 4, chance: 1.0 }
    ],
    estructura: 'acuatica_sumergida',
    follaje: 'sin_hojas',
    reproduccion: 'esporas',
    biomeIds: [],
    habitat: { luzRequerida: 'sombra', sueloPreferido: 'roca', patronDistribucion: 'solitario' }
  },
  // TUNDRA / COLD
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_pino_aguja_gris", 
    nombre: "Pino de Aguja Gris", 
    descripcion: "Conífera robusta adaptada a climas extremos, su madera es densa y resistente al fuego.", 
    tags: ["TUNDRA", "MADERA"], 
    drops: [
        { materialId: 'madera', min: 8, max: 15, chance: 1.0 },
        { materialId: 'sabia', min: 1, max: 2, chance: 0.3 }
    ],
    estructura: 'arborea',
    follaje: 'aguja',
    reproduccion: 'conos',
    biomeIds: ['tundra_helada', 'bosque_templado', 'cumbres_rocosas'],
    habitat: { luzRequerida: 'media', sueloPreferido: 'tierra', patronDistribucion: 'bosque_denso' }
  },
  { 
    ...base, 
    ...defaultPlantFase6, 
    id: "p_arbusto_baya_escarcha", 
    nombre: "Arbusto de Baya Escarcha", 
    descripcion: "Arbusto bajo que produce bayas azules comestibles que nunca se congelan.", 
    tags: ["TUNDRA", "COMIDA"], 
    frutaId: 'm_bayas_toxicas', // Placeholder until frost berry item created
    drops: [
        { materialId: 'palos', min: 2, max: 3, chance: 1.0 },
        { materialId: 'fibra', min: 1, max: 2, chance: 0.5 }
    ],
    estructura: 'arbustiva',
    follaje: 'hoja_ancha',
    reproduccion: 'fruto_comestible',
    biomeIds: ['tundra_helada'],
    habitat: { luzRequerida: 'media', sueloPreferido: 'tierra', patronDistribucion: 'parches' }
  },
];
