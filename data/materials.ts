
import { Material } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 1, fechaCreacion: now, fechaActualizacion: now };
const recursoBaseComun = { rareza: 'common' as const, tier: 1, valorBase: 5, spawn: {} };
const recursoBasePocoComun = { rareza: 'uncommon' as const, tier: 2, valorBase: 15, spawn: {} };
const recursoBaseRaro = { rareza: 'rare' as const, tier: 3, valorBase: 50, spawn: {} };
const recursoBaseEpico = { rareza: 'epic' as const, tier: 4, valorBase: 150, spawn: {} };
const recursoBaseLegendario = { rareza: 'legendary' as const, tier: 5, valorBase: 500, spawn: {} };


export const ALL_MATERIALS: Material[] = [
  // --- RECURSOS VEGETALES BÁSICOS ---
  { ...base, ...recursoBaseComun, id: 'madera', nombre: 'Madera', descripcion: 'Material de construcción básico obtenido de árboles y plantas grandes.', tags: ['material'], origen: 'vegetal' },
  { ...base, ...recursoBaseComun, id: 'palos', nombre: 'Palos', descripcion: 'Ramas delgadas y resistentes, útiles para herramientas y estructuras simples.', tags: ['material'], origen: 'vegetal' },
  { ...base, ...recursoBaseComun, id: 'hojas', nombre: 'Hojas', descripcion: 'Follaje de plantas, puede usarse para crear refugios o como biomasa.', tags: ['material'], origen: 'vegetal' },
  { ...base, ...recursoBaseComun, id: 'fibra', nombre: 'Fibra Vegetal', descripcion: 'Fibras resistentes extraídas de varias plantas, esenciales para cuerdas y tejidos.', tags: ['material'], origen: 'vegetal' },
  { ...base, ...recursoBasePocoComun, id: 'sabia', nombre: 'Savia', descripcion: 'Líquido viscoso y a menudo energéticamente rico que circula por ciertas plantas.', tags: ['alquimia'], origen: 'vegetal' },
  { 
    ...base, ...recursoBaseComun, 
    id: 'carne_cactus', 
    nombre: 'Carne de Cactus', 
    descripcion: 'Pulpa fibrosa y rica en agua de plantas xerófitas.', 
    tags: ['consumible'], 
    origen: 'vegetal',
    datosConsumible: {
        salud: 5,
        hambre: 10,
        aguante: 5
    } 
  },
  
  // --- FRUTAS Y CONSUMIBLES VEGETALES ---
  { 
    ...base, ...recursoBaseComun, 
    id: 'm_datil_espacial', 
    nombre: 'Dátil Espacial', 
    descripcion: 'Un fruto seco y extremadamente dulce del desierto, lleno de energía concentrada.', 
    tags: ['consumible', 'fruta', 'desierto'], 
    origen: 'vegetal',
    datosConsumible: {
        hambre: 15,
        aguante: 30,
        efectos: [{ id: 'effect_vigorizado', chance: 0.3 }]
    }
  },
  { 
    ...base, ...recursoBasePocoComun, 
    id: 'm_higo_ceiba', 
    nombre: 'Higo de Ceiba', 
    descripcion: 'Un fruto masivo que crece en los árboles más grandes de la jungla. Una sola pieza alimenta a una persona todo el día.', 
    tags: ['consumible', 'fruta', 'jungla'], 
    origen: 'vegetal',
    datosConsumible: {
        hambre: 60,
        salud: 10
    }
  },
  { 
    ...base, ...recursoBaseComun, 
    id: 'm_bayas_toxicas', 
    nombre: 'Bayas Venenosas', 
    descripcion: 'Pequeños frutos de colores brillantes. Comestibles en pequeñas dosis, pero causan parálisis si se consumen en exceso.', 
    tags: ['consumible', 'toxico', 'fruta'], 
    origen: 'vegetal',
    datosConsumible: {
        hambre: 5,
        salud: -5,
        efectos: [
            { id: 'effect_envenenamiento', chance: 0.8 },
            { id: 'effect_paralisis', chance: 0.1 }
        ]
    }
  },
  { ...base, ...recursoBaseComun, id: 'm_esporas_neon', nombre: 'Esporas Neón', descripcion: 'Polvo brillante recolectado de hongos gigantes. Usado como fuente de luz o alucinógeno.', tags: ['material', 'alquimia'], origen: 'vegetal' },
  { 
    ...base, ...recursoBasePocoComun, 
    id: 'm_nectar_roca', 
    nombre: 'Néctar de Roca', 
    descripcion: 'Sustancia espesa y dulce que brota de flores que crecen en piedra sólida.', 
    tags: ['consumible', 'curativo'], 
    origen: 'vegetal',
    datosConsumible: {
        salud: 25,
        aguante: 10,
        efectos: [{ id: 'effect_regeneracion', chance: 1.0 }]
    }
  },
  { 
    ...base, ...recursoBaseComun, 
    id: 'm_lechuga_crater', 
    nombre: 'Lechuga de Cráter', 
    descripcion: 'Una verdura de hojas anchas y crujientes que crece en los bordes de cráteres húmedos. Rica en hierro.', 
    tags: ['consumible', 'verdura'], 
    origen: 'vegetal',
    datosConsumible: {
        hambre: 15,
        salud: 2
    }
  },
  { 
    ...base, ...recursoBaseComun, 
    id: 'm_raiz_almidonada', 
    nombre: 'Raíz Almidonada', 
    descripcion: 'Un tubérculo denso y nutritivo. Debe cocinarse para desbloquear todo su potencial energético.', 
    tags: ['consumible', 'verdura', 'cocina'], 
    origen: 'vegetal',
    datosConsumible: {
        hambre: 10 // Cruda da poco
    }
  },
  { 
    ...base, ...recursoBaseComun, 
    id: 'm_bulbo_abismal', 
    nombre: 'Bulbo Abisal', 
    descripcion: 'Órgano bioluminiscente de flora acuática. Tiene un sabor salado y propiedades energizantes.', 
    tags: ['consumible', 'fruta', 'acuatico'], 
    origen: 'vegetal',
    datosConsumible: {
        hambre: 20,
        aguante: 15
    }
  },
  { 
    ...base, ...recursoBaseRaro, 
    id: 'm_nectar_espectral', 
    nombre: 'Néctar Espectral', 
    descripcion: 'Sustancia casi etérea recolectada de la Orquídea Fantasma. Induce una leve sensación de ingravidez al consumirse.', 
    tags: ['consumible', 'alquimia', 'raro'], 
    origen: 'vegetal',
    datosConsumible: {
        aguante: 50,
        efectos: [{ id: 'effect_confusion', chance: 0.2 }]
    }
  },

  // --- RECURSOS ANIMALES ---
  { 
    ...base, ...recursoBaseComun, 
    id: 'carne_mamifero', 
    nombre: 'Carne de Mamífero', 
    descripcion: 'Carne roja estándar, rica en proteínas.', 
    tags: ['consumible', 'cocina'], 
    origen: 'animal',
    datosConsumible: {
        hambre: 25,
        salud: 5
    }
  },
  { 
    ...base, ...recursoBaseComun, 
    id: 'carne_reptiliana', 
    nombre: 'Carne Reptiliana', 
    descripcion: 'Carne blanca y fibrosa, a menudo con un sabor fuerte.', 
    tags: ['consumible', 'cocina'], 
    origen: 'animal',
    datosConsumible: {
        hambre: 20,
        salud: 2
    }
  },
  { 
    ...base, ...recursoBaseComun, 
    id: 'carne_aviana', 
    nombre: 'Carne de Ave', 
    descripcion: 'Carne ligera y fácil de cocinar.', 
    tags: ['consumible', 'cocina'], 
    origen: 'animal',
    datosConsumible: {
        hambre: 15,
        salud: 5
    }
  },
  { 
    ...base, ...recursoBaseComun, 
    id: 'carne_pescado', 
    nombre: 'Carne de Pescado', 
    descripcion: 'Carne tierna de criaturas acuáticas, se cocina rápido.', 
    tags: ['consumible', 'cocina'], 
    origen: 'animal',
    datosConsumible: {
        hambre: 15,
        salud: 8
    }
  },
  { 
    ...base, ...recursoBaseComun, 
    id: 'biomasa_insectoide', 
    nombre: 'Biomasa Insectoide', 
    descripcion: 'Pasta nutritiva procesada de cuerpos de insectos. No es apetecible, pero sustenta.', 
    tags: ['consumible', 'supervivencia'], 
    origen: 'animal',
    datosConsumible: {
        hambre: 35,
        salud: -2 // Sabe mal
    }
  },
  { 
    ...base, ...recursoBaseComun, 
    id: 'carne_anfibia', 
    nombre: 'Carne de Anfibio', 
    descripcion: 'Carne de textura gelatinosa, requiere una preparación cuidadosa para eliminar toxinas.', 
    tags: ['consumible', 'cocina'], 
    origen: 'animal',
    datosConsumible: {
        hambre: 15,
        efectos: [{ id: 'effect_envenenamiento', chance: 0.3 }] // Si se come cruda
    }
  },
  { 
    ...base, ...recursoBaseComun, 
    id: 'carne_molusco', 
    nombre: 'Carne de Molusco', 
    descripcion: 'Carne flexible y gomosa, rica en minerales.', 
    tags: ['consumible', 'cocina'], 
    origen: 'animal',
    datosConsumible: {
        hambre: 10,
        aguante: 5
    }
  },
  { 
    ...base, ...recursoBaseRaro, 
    id: 'carne_colosal', 
    nombre: 'Carne Colosal', 
    descripcion: 'Un trozo masivo de carne de una criatura de tamaño titánico. Puede alimentar a un grupo durante días.', 
    tags: ['consumible', 'cocina', 'raro'], 
    origen: 'animal',
    datosConsumible: {
        hambre: 100,
        salud: 50,
        efectos: [{ id: 'effect_vigorizado', chance: 1.0 }]
    }
  },
  { 
    ...base, ...recursoBasePocoComun, 
    id: 'carne_abismal', 
    nombre: 'Carne Abismal', 
    descripcion: 'Carne oscura y aceitosa de las profundidades. Brilla levemente antes de cocinarse.', 
    tags: ['consumible', 'cocina'], 
    origen: 'animal',
    datosConsumible: {
        hambre: 30,
        salud: 10,
        efectos: [{ id: 'effect_ceguera', chance: 0.1 }]
    }
  },
  
  { ...base, ...recursoBaseComun, id: 'hueso', nombre: 'Hueso', descripcion: 'Material básico para herramientas y estructuras simples.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBaseEpico, id: 'hueso_colosal', nombre: 'Hueso Colosal', descripcion: 'Un hueso del tamaño de un árbol, increíblemente denso y resistente. Se usa en armamento pesado.', tags: ['material', 'raro'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'cuero', nombre: 'Cuero', descripcion: 'Piel tratada, flexible y resistente. Ideal para armaduras ligeras.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'cuero_grueso', nombre: 'Cuero Grueso', descripcion: 'Piel de criaturas grandes, más difícil de trabajar pero ofrece mayor protección.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'quitina', nombre: 'Quitina', descripcion: 'Material duro y ligero del exoesqueleto de artrópodos.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'quitina_reforzada', nombre: 'Quitina Reforzada', descripcion: 'Placas de quitina excepcionalmente duras de depredadores ápice.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'escama', nombre: 'Escama', descripcion: 'Escamas superpuestas que ofrecen protección ligera.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'escama_grande', nombre: 'Escama Grande', descripcion: 'Escama del tamaño de un escudo, de criaturas marinas o reptiles gigantes.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'pluma', nombre: 'Pluma', descripcion: 'Plumas de criaturas aviares, útiles para estabilizar proyectiles.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'veneno', nombre: 'Glándula de Veneno', descripcion: 'Una glándula que contiene una potente toxina, puede aplicarse a las armas.', tags: ['mejora', 'alquimia'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'biomasa_fungica', nombre: 'Biomasa Fúngica', descripcion: 'Materia orgánica de criaturas fúngicas, usada en medicina y alquimia.', tags: ['alquimia'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'placa_osea', nombre: 'Placa Ósea', descripcion: 'Fragmento de armadura natural de criaturas blindadas.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBaseRaro, id: 'piel_camaleonica', nombre: 'Piel Camaleónica', descripcion: 'Una piel que puede cambiar de color. Usada en equipo de sigilo.', tags: ['mejora', 'raro'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'glandula_luminosa', nombre: 'Glándula Luminosa', descripcion: 'Un órgano que produce luz biológica.', tags: ['componente'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'glandula_electrica', nombre: 'Glándula Eléctrica', descripcion: 'Un órgano capaz de generar y almacenar una potente carga eléctrica.', tags: ['componente'], origen: 'animal' },
  { ...base, ...recursoBaseRaro, id: 'tentaculo_colosal', nombre: 'Tentáculo Colosal', descripcion: 'Un tentáculo masivo con ventosas potentes.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'tinta_abismal', nombre: 'Tinta Abismal', descripcion: 'Una tinta oscura y bioluminiscente que puede oscurecer el agua.', tags: ['mejora'], origen: 'animal' },
  { ...base, ...recursoBaseLegendario, id: 'nucleo_termonuclear', nombre: 'Núcleo Termonuclear', descripcion: 'El corazón de un lagarto titán, una fuente de energía casi inagotable. Drop de Jefe.', tags: ['legendario'], origen: 'animal' },
  { ...base, ...recursoBaseLegendario, id: 'diente_regolito', nombre: 'Diente de Regolito', descripcion: 'Un diente afilado como el cristal, compuesto de roca lunar compactada. Drop de Jefe.', tags: ['legendario'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'pelo_aislante', nombre: 'Pelaje Aislante', descripcion: 'Un pelaje denso que ofrece una protección increíble contra el frío.', tags: ['material'], origen: 'animal' },

  // --- RECURSOS MINERALES (PROCESADOS) ---
  { ...base, ...recursoBaseComun, id: 'lingote_hierro', nombre: 'Lingote de Hierro', descripcion: 'Hierro de Duna refinado en un lingote resistente, listo para la forja.', tags: ['material', 'refinado'], origen: 'mineral' },
  { ...base, ...recursoBaseComun, id: 'lingote_cobre', nombre: 'Lingote de Cobre', descripcion: 'Cobre purificado, un excelente conductor para componentes electrónicos.', tags: ['material', 'refinado'], origen: 'mineral' },
  { ...base, ...recursoBasePocoComun, id: 'lingote_bismuto', nombre: 'Lingote de Bismuto', descripcion: 'Bismuto refinado, cuyas propiedades iridiscentes son valoradas en aleaciones avanzadas.', tags: ['material', 'refinado'], origen: 'mineral' },
  { ...base, ...recursoBasePocoComun, id: 'polvo_azufre', nombre: 'Polvo de Azufre', descripcion: 'Azufre finamente molido, un componente clave en explosivos y reacciones químicas.', tags: ['alquimia', 'refinado'], origen: 'mineral' },
];
