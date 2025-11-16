import { ArquetipoCristal } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 1, fechaCreacion: now, fechaActualizacion: now };
const recursoBaseComun = { rareza: 'common' as const, tier: 1, valorBase: 20, spawn: {} };
const recursoBasePocoComun = { rareza: 'uncommon' as const, tier: 2, valorBase: 50, spawn: {} };
const recursoBaseRaro = { rareza: 'rare' as const, tier: 3, valorBase: 150, spawn: {} };
const fase3Default = { elemento: 'NEUTRAL' as const, potenciaBase: 10, escalado: 'LINEAR' as const, tiposArmaCompatibles: [], tiposHerramientaCompatibles: [] };


export const ALL_CRYSTALS: ArquetipoCristal[] = [
    { ...base, ...recursoBaseComun, ...fase3Default, elemento: 'FIRE', id: "c_ignis", nombre: "Fragmento de Ignis", descripcion: "Un cristal que arde con un calor interno constante. Fuente primaria de energía de FUEGO.", tipoCristal: "FUEGO", tags:[] },
    { ...base, ...recursoBaseComun, ...fase3Default, elemento: 'ICE', id: "c_crio", nombre: "Esquirla de Crio", descripcion: "Frío al tacto, este cristal absorbe la energía térmica de su entorno. Fuente de HIELO.", tipoCristal: "HIELO", tags:[] },
    { ...base, ...recursoBaseComun, ...fase3Default, elemento: 'ELECTRIC', id: "c_volta", nombre: "Núcleo Voltaico", descripcion: "Un cristal que almacena y libera energía eléctrica de forma natural. Fuente de ELECTRICIDAD.", tipoCristal: "ELECTRICO", tags:[] },
    { ...base, ...recursoBasePocoComun, ...fase3Default, elemento: 'GRAVITY', id: "c_grav", nombre: "Lente Gravitacional", descripcion: "Un cristal denso que deforma sutilmente el espacio a su alrededor. Fuente de GRAVEDAD.", tipoCristal: "GRAVEDAD", tags:[] },
    { ...base, ...recursoBaseComun, ...fase3Default, id: "c_lumen", nombre: "Prisma Lumínico", descripcion: "Un cristal perfectamente translúcido que puede refractar y enfocar la luz. Fuente de LUZ.", tipoCristal: "LUZ", tags:[] },
    { ...base, ...recursoBasePocoComun, ...fase3Default, id: "c_nuc", nombre: "Núcleo Inestable", descripcion: "Un cristal que emite una radiación constante y decae lentamente. Fuente RADIOACTIVA.", tipoCristal: "RADIOACTIVO", tags:[] },
    { ...base, ...recursoBaseRaro, ...fase3Default, id: "c_eter", nombre: "Fragmento Etéreo", descripcion: "Un cristal de comando extremadamente raro que puede interactuar directamente con las reglas del universo, permitiendo la creación de tecnología que altera la realidad.", tipoCristal: "MAGICO", tags:[] },
    { ...base, ...recursoBasePocoComun, ...fase3Default, elemento: 'FIRE', id: "c_silicato_fuego", nombre: "Silicato de Fuego", descripcion: "Un silicato extremadamente resistente al calor, forjado en ambientes de altas temperaturas.", tipoCristal: "FUEGO", tags:[] },
    { ...base, ...recursoBaseComun, ...fase3Default, id: "c_cristal_arena", nombre: "Cristal de Arena", descripcion: "Arena fusionada por el impacto de un meteorito o una intensa actividad energética.", tipoCristal: "LUZ", tags:[] },
    { ...base, ...recursoBasePocoComun, ...fase3Default, id: "c_gema_sol", nombre: "Gema del Sol", descripcion: "Una gema que parece atrapar la luz del sol, encontrada en la superficie de desiertos abrasadores.", tipoCristal: "LUZ", tags:[] },
    { ...base, ...recursoBasePocoComun, ...fase3Default, id: "c_geoda_iridiscente", nombre: "Geoda Iridiscente", descripcion: "Geodas que contienen cristales que refractan la luz en un deslumbrante arcoíris.", tipoCristal: "MAGICO", tags:[] },
    { ...base, ...recursoBaseComun, ...fase3Default, id: "c_cristal_savia", nombre: "Cristal de Savia", descripcion: "Savia de árbol fosilizada durante milenios, dura como una gema y con una leve firma radioactiva.", tipoCristal: "RADIOACTIVO", tags:[] },
    { ...base, ...recursoBasePocoComun, ...fase3Default, elemento: 'GRAVITY', id: "c_obsidiana_reforzada", nombre: "Obsidiana Reforzada", descripcion: "Vidrio volcánico con vetas de metales pesados, increíblemente denso y con propiedades gravitacionales anómalas.", tipoCristal: "GRAVEDAD", tags:[] },
    { ...base, ...recursoBaseRaro, ...fase3Default, elemento: 'GRAVITY', id: "c_diamante_ceniza", nombre: "Diamante de Ceniza", descripcion: "Diamantes formados bajo la inmensa presión de erupciones volcánicas, capaces de enfocar la gravedad.", tipoCristal: "GRAVEDAD", tags:[] },
    { ...base, ...recursoBasePocoComun, ...fase3Default, elemento: 'ELECTRIC', id: "c_coral_metalico", nombre: "Coral Metálico", descripcion: "Una forma de vida coralina que integra metales del agua, generando un campo bio-eléctrico.", tipoCristal: "ELECTRICO", tags:[] },
    { ...base, ...recursoBaseRaro, ...fase3Default, id: "c_luminita", nombre: "Luminita", descripcion: "Un cristal blanco que tiene la asombrosa capacidad de distorsionar y redirigir la luz, pudiendo concentrarla en un haz de luz sólida.", tipoCristal: "LUZ", tags: ["JUNGLA"] },
    { ...base, ...recursoBaseRaro, ...fase3Default, elemento: 'GRAVITY', id: "c_dantesita", nombre: "Cristal de Distorsión (Dantesita)", descripcion: "Un cristal negro opaco encontrado exclusivamente en las cercanías de agujeros negros. Absorbe la luz y deforma el espacio a su alrededor. Es un componente clave en tecnologías gravitacionales.", tipoCristal: "GRAVEDAD", tags: ["BLACK_HOLE"] },
    { ...base, ...recursoBaseRaro, ...fase3Default, id: "c_orbe_distorsion", nombre: "Orbe de Distorsión", descripcion: "Esferas negras perfectas que emiten un halo de luz, encontradas flotando en el espacio-tiempo anómalo que conecta agujeros negros. Son esenciales para fabricar motores de salto interestelar. Solo se pueden recolectar durante el tránsito por un agujero negro.", tipoCristal: "MAGICO", tags: ["BLACK_HOLE"] },
];