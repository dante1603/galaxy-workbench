
import { Mineral } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 4, fechaCreacion: now, fechaActualizacion: now };
const recursoBaseComun = { rareza: 'common' as const, tier: 1, valorBase: 10, spawn: {} };
const recursoBasePocoComun = { rareza: 'uncommon' as const, tier: 2, valorBase: 25, spawn: {} };
const recursoBaseRaro = { rareza: 'rare' as const, tier: 3, valorBase: 75, spawn: {} };
const recursoBaseEpico = { rareza: 'epic' as const, tier: 4, valorBase: 200, spawn: {} };

export const ALL_MINERALS: Mineral[] = [
  // -- METALES INDUSTRIALES --
  { 
    ...base, ...recursoBaseComun, 
    id: 'min_hierro_duna', 
    nombre: "Hematita de Duna", 
    descripcion: "Óxido de hierro mezclado con silicatos del desierto. Fundamental para la construcción básica.", 
    tags: ["DESERTICO", "INOSPITO", "CONSTRUCCION"],
    suelosCompatibles: ['arena_fina', 'regolito_polvoriento'],
    formulaQuimica: 'Fe₂O₃·SiO₂',
    dureza: 5.5,
    datosProcesamiento: {
        metodo: 'fundicion',
        productoId: 'lingote_hierro',
        cantidadResultado: 1,
        tiempoBaseSegundos: 30
    }
  },
  { 
    ...base, ...recursoBaseComun, 
    id: 'min_nodulo_cobre', 
    nombre: "Malaquita Pura", 
    descripcion: "Carbonato de cobre verde brillante. Excelente conductor para electrónica primitiva.", 
    tags: ["JUNGLA", "MONTAÑA", "ELECTRONICA"],
    suelosCompatibles: ['roca_solida', 'grava_mineral', 'tierra_fertil'],
    formulaQuimica: 'Cu₂CO₃(OH)₂',
    dureza: 3.5, // Suave
    datosProcesamiento: {
        metodo: 'fundicion',
        productoId: 'lingote_cobre',
        cantidadResultado: 1,
        tiempoBaseSegundos: 20
    }
  },
  {
    ...base, ...recursoBaseComun,
    id: 'min_titanio_bruto',
    nombre: "Rutilo (Titanio)",
    descripcion: "Vetas metálicas ligeras y resistentes a la corrosión. Clave para componentes aeroespaciales.",
    tags: ["MONTAÑA", "INOSPITO"],
    suelosCompatibles: ['roca_solida', 'regolito_polvoriento'],
    formulaQuimica: 'TiO₂',
    dureza: 6.0,
    datosProcesamiento: {
        metodo: 'electrolisis', // Más complejo
        productoId: 'placa_titanio', // Nota: Este item debería crearse en materials.ts, pero lo dejamos referenciado
        cantidadResultado: 1,
        tiempoBaseSegundos: 60
    }
  },

  // -- MINERALES VOLCÁNICOS --
  { 
    ...base, ...recursoBasePocoComun, 
    id: 'min_azufre_cristalino', 
    nombre: "Azufre Nativo", 
    descripcion: "Cristales amarillos depositados por fumarolas. Reactivo químico esencial.", 
    tags: ["VOLCANICO", "ALQUIMIA"],
    suelosCompatibles: ['ceniza_volcanica'],
    formulaQuimica: 'S₈',
    dureza: 2.0, // Muy frágil
    datosProcesamiento: {
        metodo: 'trituracion',
        productoId: 'polvo_azufre',
        cantidadResultado: 3, // Da más cantidad
        tiempoBaseSegundos: 5
    }
  },
  {
    ...base, ...recursoBasePocoComun,
    id: 'min_obsidiana_filosa',
    nombre: "Obsidiana de Filo",
    descripcion: "Vidrio volcánico con fractura concoidea, más afilado que el acero quirúrgico.",
    tags: ["VOLCANICO", "ARMA"],
    suelosCompatibles: ['ceniza_volcanica', 'roca_solida'],
    formulaQuimica: 'SiO₂·MgO·Fe₃O₄',
    dureza: 5.0,
    datosProcesamiento: {
        metodo: 'corte_laser', // O tallado manual
        productoId: 'hoja_obsidiana',
        cantidadResultado: 2,
        tiempoBaseSegundos: 15
    }
  },
  { 
    ...base, ...recursoBaseRaro, 
    id: 'min_magma_congelado', 
    nombre: "Núcleo de Pirofita", 
    descripcion: "Roca que ha atrapado calor geotérmico en su estructura molecular. Siempre está caliente al tacto.", 
    tags: ["VOLCANICO", "ENERGIA"],
    suelosCompatibles: ['ceniza_volcanica'],
    formulaQuimica: 'Al₂Si₄O₁₀(OH)₂·🔥',
    dureza: 7.5,
    // Sin procesamiento directo, se usa tal cual como combustible avanzado
  },

  // -- MINERALES EXÓTICOS / BIOLÓGICOS --
  { 
    ...base, ...recursoBasePocoComun, 
    id: 'min_veta_bismuto', 
    nombre: "Bismuto Geométrico", 
    descripcion: "Metal post-transición que forma cristales en espiral iridiscentes. Usado en tecnologías de campo.", 
    tags: ["JUNGLA", "SUBTERRANEO"],
    suelosCompatibles: ['roca_solida', 'grava_mineral'],
    formulaQuimica: 'Bi',
    dureza: 2.5,
    datosProcesamiento: {
        metodo: 'fundicion',
        productoId: 'lingote_bismuto',
        cantidadResultado: 1,
        tiempoBaseSegundos: 45
    }
  },
  { 
    ...base, ...recursoBaseComun, 
    id: 'min_sal_leviatan', 
    nombre: "Halita Marina", 
    descripcion: "Cubos de sal gigantes formados por la evaporación de océanos primigenios.", 
    tags: ["ACUATICO", "DESERTICO", "COCINA"],
    suelosCompatibles: ['cristal_bruto', 'arena_fina', 'lecho_marino'],
    formulaQuimica: 'NaCl',
    dureza: 2.5,
    datosProcesamiento: {
        metodo: 'trituracion',
        productoId: 'sal_mesa',
        cantidadResultado: 5,
        tiempoBaseSegundos: 2
    }
  },
  
  // -- MINERALES DE SUELOS ESPECÍFICOS --
  {
    ...base, ...recursoBaseComun,
    id: 'min_hielo_seco',
    nombre: "Hielo de CO2",
    descripcion: "Dióxido de carbono sólido sublimable. Mantiene temperaturas criogénicas.",
    tags: ["TUNDRA", "INOSPITO"],
    suelosCompatibles: ['hielo_permafrost'],
    formulaQuimica: 'CO₂',
    dureza: 1.5,
  },
  {
    ...base, ...recursoBaseRaro,
    id: 'min_cuarzo_azul',
    nombre: "Crio-Gema",
    descripcion: "Cristal resonante que vibra ante cambios de temperatura extremos.",
    tags: ["TUNDRA", "MAGICO"],
    suelosCompatibles: ['hielo_permafrost', 'roca_solida'],
    formulaQuimica: 'SiO₂:Co',
    dureza: 7.0,
    datosProcesamiento: {
        metodo: 'corte_laser',
        productoId: 'lente_crio',
        cantidadResultado: 1,
        tiempoBaseSegundos: 120
    }
  },
  {
    ...base, ...recursoBasePocoComun,
    id: 'min_barro_ferromagnetico',
    nombre: "Lodo Ferroso",
    descripcion: "Suelo saturado de nanopartículas de hierro. Reacciona a campos magnéticos.",
    tags: ["PANTANO"],
    suelosCompatibles: ['barro_denso'],
    formulaQuimica: 'Fe₃O₄·H₂O',
    dureza: 1.0,
    datosProcesamiento: {
        metodo: 'centrifugado',
        productoId: 'pasta_magnetica',
        cantidadResultado: 2,
        tiempoBaseSegundos: 30
    }
  },
  
  // -- BIOMASA MINERALIZADA (Horror/Organic Biomes) --
  {
    ...base, ...recursoBaseRaro,
    id: 'min_carne_fosilizada',
    nombre: "Osteolito (Hueso Piedra)",
    descripcion: "Restos calcificados de megafauna antigua, ahora indistinguibles de la roca madre.",
    tags: ["INOSPITO", "CARNE"],
    suelosCompatibles: ['carne_viva', 'roca_solida'],
    formulaQuimica: 'Ca₁₀(PO₄)₆(OH)₂',
    dureza: 5.0,
  },
  {
    ...base, ...recursoBaseEpico,
    id: 'min_metal_sangre',
    nombre: "Hemoglobina Cristalizada",
    descripcion: "Hierro orgánico purificado extraído de venas planetarias masivas.",
    tags: ["CARNE", "RARO"],
    suelosCompatibles: ['carne_viva'],
    formulaQuimica: 'C₃₄H₃₂FeN₄O₄',
    dureza: 4.0,
    datosProcesamiento: {
        metodo: 'fundicion',
        productoId: 'lingote_sangre',
        cantidadResultado: 1,
        tiempoBaseSegundos: 90
    }
  }
];
