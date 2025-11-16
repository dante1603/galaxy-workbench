import { Planta } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 1, fechaCreacion: now, fechaActualizacion: now };
const defaultReglasCosecha = { herramientaRequeridaId: null, rendimiento: [], tiempoRecrecimiento: 600 };
const defaultPlantFase6 = { etapasCrecimiento: 3, reglasCosecha: defaultReglasCosecha };

export const ALL_PLANTS: Planta[] = [
  // DESERTICO
  { ...base, ...defaultPlantFase6, id: "p_oasis", nombre: "Palmera Oasis", descripcion: "Una palmera resistente que crece cerca de las raras fuentes de agua del desierto.", tags: ["DESERTICO"], materiales: ['madera', 'hojas', 'fruta_desertica'], tipoPlanta: 'tree', biomeIds: ['desierto_arido', 'playa_arena_blanca'] },
  { ...base, ...defaultPlantFase6, id: "p_arbusto_roca", nombre: "Arbusto de Roca", descripcion: "Un arbusto bajo y robusto que se camufla entre las rocas del desierto.", tags: ["DESERTICO"], materiales: ['palos', 'fibra'], tipoPlanta: 'bush', biomeIds: ['desierto_arido'] },
  { ...base, ...defaultPlantFase6, id: "p_hierba_seca", nombre: "Hierba Seca", descripcion: "Matas de hierba resistente a la sequía, una fuente principal de fibra en zonas áridas.", tags: ["DESERTICO"], materiales: ['fibra'], tipoPlanta: 'grass', biomeIds: ['desierto_arido'] },
  { ...base, ...defaultPlantFase6, id: "p_cactus_vidrio", nombre: "Cactus de Vidrio", descripcion: "Un cactus cuyas espinas son de silicato afilado y cuya pulpa almacena grandes cantidades de agua.", tags: ["DESERTICO"], materiales: ['carne_cactus', 'sabia'], tipoPlanta: 'bush', biomeIds: ['desierto_arido'] },
  { ...base, ...defaultPlantFase6, id: "p_flor_roca", nombre: "Flor de Roca", descripcion: "Una pequeña flor que crece en las grietas de las rocas, produciendo una savia de colores vivos.", tags: ["DESERTICO"], materiales: ['sabia'], tipoPlanta: 'bush', biomeIds: ['cumbres_rocosas'] },
  { ...base, ...defaultPlantFase6, id: "p_raiz_espectral", nombre: "Raíz Seca Espectral", descripcion: "Una red de raíces que a veces crece sobre la superficie, brillando débilmente al anochecer.", tags: ["DESERTICO"], materiales: ['sabia', 'palos'], tipoPlanta: 'bush', biomeIds: ['desierto_salino'] },

  // JUNGLA
  { ...base, ...defaultPlantFase6, id: "p_ceiba", nombre: "Árbol Ceiba Gigante", descripcion: "Un árbol masivo que forma el dosel de la jungla, soportando su propio ecosistema.", tags: ["JUNGLA"], materiales: ['madera', 'hojas', 'sabia'], tipoPlanta: 'tree', biomeIds: ['selva_humeda', 'bosque_templado'] },
  { ...base, ...defaultPlantFase6, id: "p_arbusto_liana", nombre: "Arbusto de Lianas", descripcion: "Un denso arbusto del que brotan lianas fuertes y flexibles.", tags: ["JUNGLA"], materiales: ['palos', 'fibra'], tipoPlanta: 'bush', biomeIds: ['selva_humeda'] },
  { ...base, ...defaultPlantFase6, id: "p_musgo_luminoso", nombre: "Musgo Luminoso", descripcion: "Un musgo bioluminiscente que prospera en la humedad y la oscuridad de la jungla.", tags: ["JUNGLA"], materiales: ['fibra'], tipoPlanta: 'grass', biomeIds: ['selva_humeda', 'cienaga_manglares', 'tundra_helada'] },
  { ...base, ...defaultPlantFase6, id: "p_orquidea_fantasma", nombre: "Orquídea Fantasma", descripcion: "Una orquídea rara que parece flotar en el aire, con pétalos casi translúcidos.", tags: ["JUNGLA"], materiales: ['sabia', 'fruta_jungla'], tipoPlanta: 'bush', biomeIds: ['selva_humeda'] },
  { ...base, ...defaultPlantFase6, id: "p_liana_estranguladora", nombre: "Liana Estranguladora", descripcion: "Una liana agresiva que envuelve a otras plantas e incluso a la fauna.", tags: ["JUNGLA"], materiales: ['fibra', 'palos'], tipoPlanta: 'bush', biomeIds: ['selva_humeda', 'cienaga_manglares'] },
  { ...base, ...defaultPlantFase6, id: "p_hongo_pulso", nombre: "Hongo de Pulso", descripcion: "Un hongo grande que se contrae y expande lentamente, liberando esporas luminosas.", tags: ["JUNGLA"], materiales: ['carne_cactus'], tipoPlanta: 'bush', biomeIds: ['selva_humeda'] },

  // ACUATICO
  { ...base, ...defaultPlantFase6, id: "p_kelp", nombre: "Bosque de Kelp Gigante", descripcion: "Enormes algas que forman densos bosques submarinos, un hábitat clave para la vida marina.", tags: ["ACUATICO"], materiales: ['fibra', 'hojas'], tipoPlanta: 'grass', biomeIds: ['oceano_abierto'] },
  { ...base, ...defaultPlantFase6, id: "p_anemona", nombre: "Anémona de Pulso", descripcion: "Una anémona que emite pulsos de luz para atraer a sus presas.", tags: ["ACUATICO"], materiales: ['sabia'], tipoPlanta: 'bush', biomeIds: ['arrecife_coralino'] },
  { ...base, ...defaultPlantFase6, id: "p_coral_electrico", nombre: "Coral Eléctrico", descripcion: "Un coral que genera una débil carga eléctrica como mecanismo de defensa.", tags: ["ACUATICO"], materiales: ['palos'], tipoPlanta: 'bush', biomeIds: ['arrecife_coralino'] },
  { ...base, ...defaultPlantFase6, id: "p_alga_bio", nombre: "Alga Bioluminiscente", descripcion: "Algas que iluminan las aguas poco profundas, a menudo en simbiosis con otras formas de vida.", tags: ["ACUATICO", "JUNGLA"], materiales: ['fibra', 'fruta_acuatica'], tipoPlanta: 'grass', biomeIds: ['arrecife_coralino', 'selva_humeda'] },
  { ...base, ...defaultPlantFase6, id: "p_esponja_silicato", nombre: "Esponja de Silicato", descripcion: "Una esponja de mar con un esqueleto de fibras de silicato, flexible pero resistente.", tags: ["ACUATICO"], materiales: ['fibra'], tipoPlanta: 'bush', biomeIds: [] },
];