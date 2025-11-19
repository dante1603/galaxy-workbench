
import { Fauna } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 3, fechaCreacion: now, fechaActualizacion: now };
const defaultStats = { salud: 50, dano: 5, velocidad: 3, rangoPercepcion: 15, rangoAgresividad: 10 };
const defaultFase6 = { biomeIds: [], nivelAmenaza: 1, stats: defaultStats, idPerfilIA: null };

export const ALL_FAUNA: Fauna[] = [
  // --- ENTIDADES FIJAS (PROTECTED) ---
  {
    ...base,
    ...defaultFase6,
    id: "f_caracol_galopador", // ID PROTEGIDO
    nombre: "Caracol Galopador", // NOMBRE PROTEGIDO
    descripcion: "El Caracol Galopador es una sorprendente adaptación de molusco terrestre, con una concha endurecida y aerodinámica. Posee cuatro apéndices musculosos que le permiten alcanzar velocidades considerables.",
    tags: ["BOSQUE", "JUNGLA", "PROTECTED", "MONTURA"],
    dieta: 'herbivoro',
    reino: 'molusco',
    planCorporal: 'cuadrupedo',
    cobertura: 'concha',
    sentidos: ['visual', 'vibracion'],
    tamano: 'medio',
    comportamientoSocial: 'manada_defensiva',
    locomocion: 'terrestre',
    cantidadExtremidades: 4,
    tipoExtremidadesDelanteras: 'ninguna',
    tieneCola: false,
    utilidadCola: [],
    temperamento: 'docil',
    rolCombate: [],
    utilidad: ['montura', 'bestia_de_carga'],
    drops: [
      { materialId: 'carne_molusco', min: 1, max: 2, chance: 0.9 },
      { materialId: 'quitina_reforzada', min: 1, max: 1, chance: 0.25 },
    ]
  },
  {
    ...base,
    ...defaultFase6,
    id: "f_compy_adaptable", // ID PROTEGIDO
    nombre: "Compsognathus Carroñero", // NOMBRE PROTEGIDO
    descripcion: "Un pequeño dinosaurio reptiloide altamente adaptable. Se encuentra en casi cualquier bioma, alimentándose de los restos dejados por depredadores mayores.",
    tags: ["DESERTICO", "JUNGLA", "BOSQUE", "PROTECTED"],
    dieta: 'carronero',
    reino: 'reptiloide',
    planCorporal: 'bipedo',
    cobertura: 'escamas',
    sentidos: ['visual', 'olfativo'],
    tamano: 'pequeno',
    comportamientoSocial: 'manada_caza',
    locomocion: 'terrestre',
    cantidadExtremidades: 2,
    tipoExtremidadesDelanteras: 'garras',
    tieneCola: true,
    utilidadCola: ['equilibrio'],
    temperamento: 'oportunista',
    rolCombate: [],
    utilidad: [],
    drops: [
      { materialId: 'carne_reptiliana', min: 1, max: 1, chance: 0.8 },
      { materialId: 'hueso', min: 1, max: 2, chance: 0.5 },
    ]
  },
  {
    ...base,
    ...defaultFase6,
    id: "f_aikia", // ID PROTEGIDO
    nombre: "Aikia", // NOMBRE PROTEGIDO
    descripcion: "Un pequeño felino de pelaje blanco y espeso, adaptado perfectamente a la tundra. Sus ojos grandes le permiten cazar en las largas noches polares.",
    tags: ["TUNDRA", "PROTECTED", "SIGILO"],
    dieta: 'carnivoro',
    reino: 'mamifero',
    planCorporal: 'cuadrupedo',
    cobertura: 'pelaje',
    sentidos: ['olfativo', 'termico', 'visual'],
    tamano: 'pequeno',
    comportamientoSocial: 'solitario',
    locomocion: 'terrestre',
    cantidadExtremidades: 4,
    tipoExtremidadesDelanteras: 'garras',
    tieneCola: true,
    utilidadCola: ['equilibrio'],
    temperamento: 'agresivo',
    rolCombate: ['sigilo', 'asesino'],
    utilidad: [],
    drops: [
      { materialId: 'carne_mamifero', min: 1, max: 1, chance: 0.9 },
      { materialId: 'pelo_aislante', min: 1, max: 2, chance: 0.8 },
      { materialId: 'cuero', min: 1, max: 1, chance: 0.5 },
    ]
  },

  // --- XENO-FAUNA PROCEDURAL (REDISENADA) ---
  
  // DESERTICO / SCI-FI TROPES
  {
    ...base,
    ...defaultFase6,
    id: "f_shai_xeno", 
    nombre: "Shai-Hulud Xeno (Gusano de Arena)", 
    descripcion: "Un titán anélido que domina los desiertos profundos. Su boca es un pozo de dientes cristalinos. Percibe las vibraciones rítmicas sobre la arena.",
    tags: ["DESERTICO", "BOSS", "DUNE"],
    dieta: 'litotrofico',
    reino: 'verme',
    planCorporal: 'serpentino',
    cobertura: 'escamas',
    sentidos: ['vibracion'],
    tamano: 'colosal',
    comportamientoSocial: 'solitario',
    locomocion: 'excavador',
    cantidadExtremidades: 0,
    tipoExtremidadesDelanteras: 'ninguna',
    tieneCola: false,
    utilidadCola: [],
    temperamento: 'territorial',
    rolCombate: ['jefe', 'control_de_area'],
    utilidad: [],
    drops: [
      { materialId: 'carne_colosal', min: 5, max: 10, chance: 1.0 },
      { materialId: 'diente_regolito', min: 2, max: 5, chance: 0.8 },
    ],
    nivelAmenaza: 10
  },
  {
    ...base,
    ...defaultFase6,
    id: "f_pozo_sarlacc", 
    nombre: "Xeno-Sarlacc", 
    descripcion: "Un depredador de emboscada estacionario que se entierra en fosos de arena. Sus tentáculos arrastran a las presas hacia un pico central oculto.",
    tags: ["DESERTICO", "TRAMPA"],
    dieta: 'carnivoro',
    reino: 'verme', // O planta carnivora, pero verme encaja bien
    planCorporal: 'estatico', // Nuevo: Radial/estatico
    cobertura: 'baboso',
    sentidos: ['vibracion'],
    tamano: 'muy_grande',
    comportamientoSocial: 'solitario',
    locomocion: 'estacionario',
    cantidadExtremidades: 8,
    tipoExtremidadesDelanteras: 'tentaculos',
    tieneCola: false,
    utilidadCola: [],
    temperamento: 'agresivo',
    rolCombate: ['control_de_area'],
    utilidad: [],
    drops: [
      { materialId: 'biomasa_insectoide', min: 5, max: 10, chance: 1.0 },
      { materialId: 'tentaculo_colosal', min: 1, max: 3, chance: 0.5 },
    ]
  },

  // ACUATICO PREHISTORICO
  {
    ...base,
    ...defaultFase6,
    id: "f_osteo_placodermo", 
    nombre: "Osteo-Depredador (Tipo Dunkleosteus)", 
    descripcion: "Un pez blindado de la era devónica adaptado a océanos alienígenas. Sus mandíbulas son placas óseas autoafilables capaces de partir metal.",
    tags: ["ACUATICO", "PREHISTORICO"],
    dieta: 'carnivoro',
    reino: 'pez',
    planCorporal: 'pisciforme',
    cobertura: 'placas_sinteticas', // O hueso
    sentidos: ['olfativo', 'vibracion'],
    tamano: 'grande',
    comportamientoSocial: 'solitario',
    locomocion: 'acuatico',
    cantidadExtremidades: 0,
    tipoExtremidadesDelanteras: 'aletas',
    tieneCola: true,
    utilidadCola: ['natacion', 'ataque'],
    temperamento: 'agresivo',
    rolCombate: ['tanque', 'dps_cuerpo_a_cuerpo'],
    utilidad: [],
    drops: [
      { materialId: 'placa_osea', min: 2, max: 5, chance: 1.0 },
      { materialId: 'carne_pescado', min: 4, max: 8, chance: 1.0 },
    ]
  },

  // VOLADOR GIGANTE / CARBONIFERO
  {
    ...base,
    ...defaultFase6,
    id: "f_libelula_titan", 
    nombre: "Libélula Titán (Meganeura)", 
    descripcion: "Un insecto volador del tamaño de un águila. Sus alas zumban con un tono grave y caza en enjambres en biomas de jungla densa.",
    tags: ["JUNGLA", "PANTANO", "CARBONIFERO"],
    dieta: 'carnivoro',
    reino: 'artropodo',
    planCorporal: 'alado',
    cobertura: 'quitina',
    sentidos: ['visual', 'vibracion'],
    tamano: 'pequeno', // Para un insecto es gigante, pero en escala global es pequeño/medio
    comportamientoSocial: 'enjambre',
    locomocion: 'volador',
    cantidadExtremidades: 6,
    tipoExtremidadesDelanteras: 'garras',
    tieneCola: true,
    utilidadCola: ['equilibrio'],
    temperamento: 'agresivo',
    rolCombate: ['dps_distancia', 'asesino'],
    utilidad: [],
    drops: [
      { materialId: 'quitina', min: 1, max: 2, chance: 0.8 },
      { materialId: 'biomasa_insectoide', min: 1, max: 1, chance: 0.5 },
    ]
  },
  {
    ...base,
    ...defaultFase6,
    id: "f_pterosaurio_real", 
    nombre: "Pterosaurio Real", 
    descripcion: "Reptil volador con una envergadura masiva y una cresta colorida. Domina los cielos de los acantilados costeros.",
    tags: ["ACANTILADO", "PREHISTORICO"],
    dieta: 'carnivoro',
    reino: 'reptiloide',
    planCorporal: 'alado',
    cobertura: 'piel_suave', // O picnofibras
    sentidos: ['visual'],
    tamano: 'grande',
    comportamientoSocial: 'colonia',
    locomocion: 'volador',
    cantidadExtremidades: 4, // Alas son brazos
    tipoExtremidadesDelanteras: 'alas',
    tieneCola: false,
    utilidadCola: [],
    temperamento: 'territorial',
    rolCombate: ['dps_distancia'],
    utilidad: ['montura'],
    drops: [
      { materialId: 'cuero', min: 2, max: 3, chance: 0.9 },
      { materialId: 'hueso', min: 1, max: 2, chance: 0.6 },
    ]
  },

  // FAUNA ESPACIAL
  {
    ...base,
    ...defaultFase6,
    id: "f_ballena_nebulosa", 
    nombre: "Cetáceo de Nebulosa", 
    descripcion: "Una inmensa criatura pacífica que 'nada' a través del vacío espacial, filtrando polvo estelar y radiación con barbas de energía.",
    tags: ["ESPACIO", "PACIFICO", "COSMICO"],
    dieta: 'fototrofico', // Se alimenta de radiacion
    reino: 'mamifero', // O energetico
    planCorporal: 'pisciforme',
    cobertura: 'piel_suave', // Reforzada contra vacio
    sentidos: ['magnetico', 'ecolocalizacion'],
    tamano: 'colosal',
    comportamientoSocial: 'pareja',
    locomocion: 'espacial', // NUEVO TIPO
    cantidadExtremidades: 2,
    tipoExtremidadesDelanteras: 'aletas',
    tieneCola: true,
    utilidadCola: ['natacion'],
    temperamento: 'docil',
    rolCombate: ['tanque'],
    utilidad: ['productor_recursos'],
    drops: [
      { materialId: 'carne_colosal', min: 10, max: 20, chance: 1.0 },
      { materialId: 'glandula_luminosa', min: 5, max: 10, chance: 1.0 },
    ],
    nivelAmenaza: 0
  },
  {
    ...base,
    ...defaultFase6,
    id: "f_gusano_asteroide", 
    nombre: "Perforador de Asteroides", 
    descripcion: "Un gusano lítico que vive en el interior de grandes asteroides. Sale al vacío para atacar naves o devorar minerales expuestos.",
    tags: ["ESPACIO", "INOSPITO"],
    dieta: 'litotrofico',
    reino: 'verme',
    planCorporal: 'serpentino',
    cobertura: 'mineral',
    sentidos: ['vibracion'],
    tamano: 'muy_grande',
    comportamientoSocial: 'solitario',
    locomocion: 'espacial', // Se mueve entre rocas en 0g
    cantidadExtremidades: 0,
    tipoExtremidadesDelanteras: 'ninguna',
    tieneCola: false,
    utilidadCola: [],
    temperamento: 'agresivo',
    rolCombate: ['jefe', 'asesino'],
    utilidad: [],
    drops: [
      { materialId: 'diente_regolito', min: 4, max: 6, chance: 1.0 },
      { materialId: 'min_titanio_bruto', min: 5, max: 10, chance: 0.8 },
    ],
    nivelAmenaza: 8
  },

  // ENTIDADES CLÁSICAS (Ya existentes o renombradas)
  {
    ...base,
    ...defaultFase6,
    id: "f_aracnido_silice", 
    nombre: "Arácnido de Sílice", 
    descripcion: "Un artrópodo cuyo exoesqueleto ha asimilado arena cristalizada, haciéndolo casi invisible en las dunas y extremadamente duro.",
    tags: ["DESERTICO", "CAMUFLAJE"],
    dieta: 'carnivoro',
    reino: 'artropodo',
    planCorporal: 'multipodo',
    cobertura: 'mineral',
    sentidos: ['vibracion'],
    tamano: 'pequeno',
    comportamientoSocial: 'solitario',
    locomocion: 'terrestre',
    cantidadExtremidades: 8,
    tipoExtremidadesDelanteras: 'pinzas',
    tieneCola: true,
    utilidadCola: ['ataque'],
    temperamento: 'agresivo',
    rolCombate: ['asesino', 'sigilo'],
    utilidad: [],
    drops: [
      { materialId: 'biomasa_insectoide', min: 1, max: 1, chance: 0.75 },
      { materialId: 'quitina', min: 1, max: 2, chance: 0.5 },
      { materialId: 'veneno', min: 1, max: 1, chance: 0.3 },
    ]
  },
  {
    ...base,
    ...defaultFase6,
    id: "f_acechador_umbrio", 
    nombre: "Acechador Umbrío", 
    descripcion: "Un depredador con pelaje que absorbe la luz, haciéndolo parecer una silueta vacía en la penumbra de la jungla.",
    tags: ["JUNGLA", "NOCTURNO"],
    dieta: 'carnivoro',
    reino: 'mamifero',
    planCorporal: 'cuadrupedo',
    cobertura: 'pelaje',
    sentidos: ['olfativo', 'auditivo'],
    tamano: 'grande', 
    comportamientoSocial: 'solitario',
    locomocion: 'terrestre',
    cantidadExtremidades: 4,
    tipoExtremidadesDelanteras: 'garras',
    tieneCola: true,
    utilidadCola: ['equilibrio'],
    temperamento: 'agresivo',
    rolCombate: ['sigilo', 'asesino'],
    utilidad: [],
    drops: [
      { materialId: 'carne_mamifero', min: 1, max: 2, chance: 0.9 },
      { materialId: 'cuero', min: 1, max: 1, chance: 0.75 },
    ]
  },
  {
    ...base,
    ...defaultFase6,
    nivelAmenaza: 10,
    id: "f_kraken_abisal", 
    nombre: "Kraken Abisal", 
    descripcion: "Horror cefalópodo de las profundidades. Sus tentáculos pueden aplastar submarinos y su piel genera pulsos hipnóticos de luz.",
    tags: ["ACUATICO", "BOSS"],
    dieta: 'carnivoro',
    reino: 'molusco',
    planCorporal: 'radial',
    cobertura: 'baboso',
    sentidos: ['ecolocalizacion', 'magnetico'],
    tamano: 'colosal',
    comportamientoSocial: 'solitario',
    locomocion: 'acuatico',
    cantidadExtremidades: 10,
    tipoExtremidadesDelanteras: 'tentaculos',
    tieneCola: false,
    utilidadCola: [],
    temperamento: 'agresivo',
    rolCombate: ['jefe'],
    utilidad: [],
    drops: [
      { materialId: 'tentaculo_colosal', min: 1, max: 2, chance: 1.0 },
      { materialId: 'tinta_abismal', min: 1, max: 1, chance: 0.8 },
    ]
  },
  {
    ...base,
    ...defaultFase6,
    nivelAmenaza: 10,
    id: "f_lagarto_titan", 
    nombre: "Titán Magmático (Tipo Rancor)", 
    descripcion: "Un reptil bipedo colosal cuyo metabolismo se basa en la fisión nuclear natural. Exuda calor extremo y es inmune a la lava.",
    tags: ["VOLCANICO", "BOSS", "RANCOR"],
    dieta: 'litotrofico', // come rocas/magma
    reino: 'reptiloide',
    planCorporal: 'bipedo', // Rancor es bipedo
    cobertura: 'escamas', // O placas
    sentidos: ['termico', 'vibracion'],
    tamano: 'colosal',
    comportamientoSocial: 'solitario',
    locomocion: 'terrestre',
    cantidadExtremidades: 4, // 2 brazos, 2 piernas
    tipoExtremidadesDelanteras: 'manos', // Garras prensiles
    tieneCola: false,
    utilidadCola: [],
    temperamento: 'implacable',
    rolCombate: ['jefe', 'control_de_area'],
    utilidad: [],
    drops: [
      { materialId: 'nucleo_termonuclear', min: 1, max: 1, chance: 1.0 },
      { materialId: 'escama_grande', min: 4, max: 8, chance: 1.0 },
    ]
  },
];
