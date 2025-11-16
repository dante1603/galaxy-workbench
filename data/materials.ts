import { Material } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 1, fechaCreacion: now, fechaActualizacion: now };
const recursoBaseComun = { rareza: 'common' as const, tier: 1, valorBase: 5, spawn: {} };
const recursoBasePocoComun = { rareza: 'uncommon' as const, tier: 2, valorBase: 15, spawn: {} };
const recursoBaseRaro = { rareza: 'rare' as const, tier: 3, valorBase: 50, spawn: {} };
const recursoBaseEpico = { rareza: 'epic' as const, tier: 4, valorBase: 150, spawn: {} };
const recursoBaseLegendario = { rareza: 'legendary' as const, tier: 5, valorBase: 500, spawn: {} };


export const ALL_MATERIALS: Material[] = [
  // --- RECURSOS VEGETALES ---
  { ...base, ...recursoBaseComun, id: 'madera', nombre: 'Madera', descripcion: 'Material de construcción básico obtenido de árboles y plantas grandes.', tags: ['material'], origen: 'vegetal' },
  { ...base, ...recursoBaseComun, id: 'palos', nombre: 'Palos', descripcion: 'Ramas delgadas y resistentes, útiles para herramientas y estructuras simples.', tags: ['material'], origen: 'vegetal' },
  { ...base, ...recursoBaseComun, id: 'hojas', nombre: 'Hojas', descripcion: 'Follaje de plantas, puede usarse para crear refugios o como biomasa.', tags: ['material'], origen: 'vegetal' },
  { ...base, ...recursoBaseComun, id: 'fibra', nombre: 'Fibra Vegetal', descripcion: 'Fibras resistentes extraídas de varias plantas, esenciales para cuerdas y tejidos.', tags: ['material'], origen: 'vegetal' },
  { ...base, ...recursoBasePocoComun, id: 'sabia', nombre: 'Sabia', descripcion: 'Líquido viscoso y a menudo energéticamente rico que circula por ciertas plantas.', tags: ['alquimia'], origen: 'vegetal' },
  { ...base, ...recursoBaseComun, id: 'carne_cactus', nombre: 'Carne de Cactus', descripcion: 'Pulpa fibrosa y rica en agua de plantas xerófitas.', tags: ['consumible'], origen: 'vegetal' },
  { ...base, ...recursoBaseComun, id: 'fruta_desertica', nombre: 'Baya del Desierto', descripcion: 'Fruto pequeño y resistente que crece en climas áridos, una fuente de sustento.', tags: ['consumible'], origen: 'vegetal' },
  { ...base, ...recursoBaseComun, id: 'fruta_jungla', nombre: 'Fruta Tropical', descripcion: 'Fruto jugoso y dulce de biomas selváticos, rico en nutrientes.', tags: ['consumible'], origen: 'vegetal' },
  { ...base, ...recursoBaseComun, id: 'fruta_acuatica', nombre: 'Bulbo Bioluminiscente', descripcion: 'Órgano de una planta acuática que emite una luz suave y contiene nutrientes.', tags: ['consumible'], origen: 'vegetal' },
  
  // --- RECURSOS ANIMALES ---
  { ...base, ...recursoBaseComun, id: 'carne_mamifero', nombre: 'Carne de Mamífero', descripcion: 'Carne estándar, una fuente de proteínas común.', tags: ['consumible'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'carne_reptiliana', nombre: 'Carne Reptiliana', descripcion: 'Carne fibrosa y exótica, a menudo con un sabor peculiar.', tags: ['consumible'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'carne_aviana', nombre: 'Carne de Ave', descripcion: 'Carne ligera y fácil de cocinar.', tags: ['consumible'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'carne_pescado', nombre: 'Carne de Pescado', descripcion: 'Carne tierna de criaturas acuáticas.', tags: ['consumible'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'biomasa_insectoide', nombre: 'Biomasa Insectoide', descripcion: 'Pasta nutritiva procesada de cuerpos de insectos.', tags: ['consumible'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'carne_anfibia', nombre: 'Carne de Anfibio', descripcion: 'Carne de textura inusual, a menudo requiere una preparación especial.', tags: ['consumible'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'carne_molusco', nombre: 'Carne de Molusco', descripcion: 'Carne flexible y rica en minerales de criaturas como calamares.', tags: ['consumible'], origen: 'animal' },
  { ...base, ...recursoBaseRaro, id: 'carne_colosal', nombre: 'Carne Colosal', descripcion: 'Un trozo masivo de carne de una criatura de tamaño titánico. Puede alimentar a un grupo durante días.', tags: ['consumible'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'carne_abismal', nombre: 'Carne Abismal', descripcion: 'Carne oscura y aceitosa de las criaturas de las profundidades, con propiedades bioluminiscentes.', tags: ['consumible'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'hueso', nombre: 'Hueso', descripcion: 'Material básico para herramientas y estructuras simples.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBaseEpico, id: 'hueso_colosal', nombre: 'Hueso Colosal', descripcion: 'Un hueso del tamaño de un árbol, increíblemente denso y resistente. Se usa en armamento pesado.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'cuero', nombre: 'Cuero', descripcion: 'Piel tratada, flexible y resistente. Ideal para armaduras ligeras.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'cuero_grueso', nombre: 'Cuero Grueso', descripcion: 'Piel de criaturas grandes, más gruesa y resistente que el cuero normal.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'quitina', nombre: 'Quitina', descripcion: 'Material duro pero ligero del exoesqueleto de artrópodos.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'quitina_reforzada', nombre: 'Quitina Reforzada', descripcion: 'Placas de quitina excepcionalmente duras de depredadores ápice.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'escama', nombre: 'Escama', descripcion: 'Escamas superpuestas que ofrecen protección ligera.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'escama_grande', nombre: 'Escama Grande', descripcion: 'Escama del tamaño de un plato, de criaturas marinas o reptiles gigantes.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBaseComun, id: 'pluma', nombre: 'Pluma', descripcion: 'Plumas de criaturas aviares, útiles para estabilizar proyectiles.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'veneno', nombre: 'Glándula de Veneno', descripcion: 'Una glándula que contiene una potente toxina, puede aplicarse a las armas.', tags: ['mejora'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'biomasa_fungica', nombre: 'Biomasa Fúngica', descripcion: 'Materia orgánica de criaturas fúngicas, usada en medicina y alquimia.', tags: ['alquimia'], origen: 'animal' },
  { ...base, ...recursoBasePocoComun, id: 'placa_osea', nombre: 'Placa Ósea', descripcion: 'Fragmento de armadura natural de criaturas blindadas.', tags: ['material'], origen: 'animal' },
  { ...base, ...recursoBaseRaro, id: 'piel_camaleonica', nombre: 'Piel Camaleónica', descripcion: 'Una piel que puede cambiar de color. Usada en equipo de sigilo.', tags: ['mejora'], origen: 'animal' },
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