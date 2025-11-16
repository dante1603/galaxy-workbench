import { EspecieInteligente } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 1, fechaCreacion: now, fechaActualizacion: now };

export const ALL_SPECIES: EspecieInteligente[] = [
  {
    ...base,
    id: 'species_snail_sun',
    nombre: 'Snail Sun (Caracol Solar)',
    descripcion: 'Una especie herbívora que ha desarrollado la capacidad de realizar fotosíntesis, haciéndolos dependientes de la luz solar para su sustento.',
    tags: ['fotosintetico', 'herbivoro', 'pacifico'],
    colorClave: '#84cc16', // lime-500
    lore: [
      'Son seres humanoides esbeltos con piel suave y húmeda, a menudo en tonos verdes y amarillos.',
      'Poseen dos antenas retráctiles en la cabeza que actúan como sensores de luz y humedad.',
      'Su espalda está cubierta por una capa de células clorofílicas que se asemejan a las "ovejas de mar", permitiéndoles realizar fotosíntesis.',
      'Son una cultura pacífica y comunal, estableciendo sus asentamientos en planetas con abundante luz solar y vegetación (Bosques, Pantanos, Tropicales).'
    ],
    reglasGameplay: [
      { titulo: 'Pasiva: Fotosíntesis Biológica', descripcion: 'Regenera hambre al exponerse a luz solar directa, reduciendo la necesidad de consumir alimentos.' },
      { titulo: 'Activa: Rayo Clorofila', descripcion: 'Emite un pulso de energía verde que cura en área a aliados o acelera procesos biológicos locales (purificación, crecimiento).' }
    ],
    debilidades: [
      'Sensibles al frío, sufriendo penalizaciones de resistencia en planetas helados.',
      'Se deshidratan con facilidad en entornos áridos, consumiendo agua más rápido.'
    ],
    restriccionesDiseno: ['Antropomórfico', 'Siempre descalzos para absorber nutrientes del suelo.', 'Estética orgánica y húmeda.'],
    planetasComunes: ['JUNGLA'],
    modificadoresStatsBase: { salud: 10, aguante: 20 },
    biomasInicio: ['selva_humeda', 'bosque_templado'],
    metabolismo: { dieta: 'herbivoro', entornosFavorables: ['soleado', 'humedo'], entornosDesfavorables: ['frio', 'arido'] },
    afinidadCristales: ['LUZ', 'RADIOACTIVO'],
  },
  {
    ...base,
    id: 'species_quillfolk',
    nombre: 'Quillfolk (Pangolín Vaquero)',
    descripcion: 'Una especie robusta y bajita de carnívoros con temática western, conocidos por su habilidad con el arco y su resistencia en climas áridos.',
    tags: ['carnivoro', 'artesano', 'western'],
    colorClave: '#dc2626', // red-600
    lore: [
      'Son humanoides bajos y corpulentos, cubiertos de placas quitinosas y espinas afiladas, similares a los pangolines y puercoespines.',
      'Su cultura tiene una fuerte estética "western", estableciendo pueblos en planetas desérticos que recuerdan al viejo oeste.',
      'Son cazadores expertos y carnívoros estrictos, valorando la autosuficiencia y la habilidad en el combate a distancia.'
    ],
    reglasGameplay: [
      { titulo: 'Pasiva: Autogeneración de Espinas', descripcion: 'Producen munición ósea para sus arcos y armamento especializado de forma natural con el tiempo.' },
      { titulo: 'Activa: Tiro Triple', descripcion: 'Realiza un disparo de arco rápido con tres proyectiles, con daño aumentado y ligera perforación de armadura.' }
    ],
    debilidades: [
      'Metabolismo acelerado que requiere un alto consumo de proteínas (carne).',
      'Menor eficiencia y resistencia en climas extremadamente fríos.'
    ],
    restriccionesDiseno: ['Antropomórfico', 'Bajos de estatura.', 'Siempre llevan algún tipo de sombrero o poncho de estilo western.', 'Estética ruda con placas angulares.'],
    planetasComunes: ['DESERTICO'],
    modificadoresStatsBase: { ataque: 5, defensa: 5 },
    biomasInicio: ['desierto_arido'],
    metabolismo: { dieta: 'carnivoro', entornosFavorables: ['arido', 'calido'], entornosDesfavorables: ['frio'] },
    afinidadCristales: ['FUEGO'],
  },
  {
    ...base,
    id: 'species_abyssal_choir',
    nombre: 'Abyssal Choir',
    descripcion: 'Una especie anfibia y enigmática que se comunica a través de canciones sónicas y bioluminiscencia.',
    tags: ['acuatico', 'anfibio', 'sonico'],
    colorClave: '#3b82f6', // blue-500
    lore: [
      'Son humanoides altos y delgados con características de peces abisales: piel lisa y oscura, ojos grandes y bioluminiscencia en patrones a lo largo de su cuerpo.',
      'No poseen cuerdas vocales, comunicándose a través de una compleja gama de pulsos sónicos y destellos de luz que forman su "canto".',
      'Habitan en las profundidades de los planetas acuáticos, construyendo ciudades de coral bioluminiscente. Son exploradores y guardianes de los secretos del océano.'
    ],
    reglasGameplay: [
      { titulo: 'Pasiva: Respiración Anfibia', descripcion: 'Pueden respirar indefinidamente bajo el agua y no sufren penalizaciones de presión en las profundidades.' },
      { titulo: 'Activa: Canto Sónico', descripcion: 'Pueden emitir un pulso sónico que aturde a los enemigos cercanos y revela la ubicación de minerales a través de las paredes.' }
    ],
    debilidades: [
      'Vulnerabilidad a la deshidratación, consumen agua más rápido fuera de entornos acuáticos o húmedos.'
    ],
    restriccionesDiseno: ['Antropomórfico', 'Rasgos de pez abisal (ojos grandes, señuelos bioluminiscentes).', 'No poseen boca visible.'],
    planetasComunes: ['ACUATICO'],
    modificadoresStatsBase: { aguante: 15 },
    biomasInicio: ['abismo_abisal', 'arrecife_coralino'],
    metabolismo: { dieta: 'carnivoro', entornosFavorables: ['acuatico'], entornosDesfavorables: ['arido'] },
    afinidadCristales: ['HIELO', 'ELECTRICO'],
  },
  {
    ...base,
    id: 'species_aetherial',
    nombre: 'Aetherial',
    descripcion: 'Seres de pura energía cristalina, capaces de volar y manipular energía elemental, pero incapaces de interactuar con la tecnología convencional.',
    tags: ['energia', 'volador', 'anti-tecnologia'],
    colorClave: '#a855f7', // purple-500
    lore: [
      'No tienen una forma física fija, apareciendo como siluetas humanoides compuestas de luz cristalina y energía crepitante.',
      'No tienen una sociedad o cultura en el sentido tradicional. Son seres solitarios que meditan cerca de grandes concentraciones de cristales, a los que consideran sagrados.',
      'Son antiguos y poderosos, viendo a las razas "físicas" con una mezcla de curiosidad y desdén.'
    ],
    reglasGameplay: [
      { titulo: 'Pasiva: Vuelo Natural', descripcion: 'Pueden volar libremente, consumiendo su barra de energía en lugar de resistencia.' },
      { titulo: 'Activa: Absorción de Cristales', descripcion: 'Pueden consumir cristales elementales para recargar su energía y desatar poderosos ataques basados en el tipo de cristal.' }
    ],
    debilidades: [
      'Incompatibilidad Tecnológica: No pueden usar armas, armaduras o herramientas tecnológicas, dependiendo de sus habilidades innatas.'
    ],
    restriccionesDiseno: ['Antropomórfico (silueta)', 'Cuerpo translúcido y energético.', 'Sin rasgos faciales definidos.'],
    planetasComunes: [],
    modificadoresStatsBase: { ataque: 15, defensa: -10 },
    biomasInicio: ['cavernas_cristalinas'],
    metabolismo: { dieta: 'omnivoro', entornosFavorables: ['cristalino'], entornosDesfavorables: [] },
    afinidadCristales: ['MAGICO', 'GRAVEDAD', 'LUZ', 'FUEGO', 'HIELO', 'ELECTRICO'],
  }
];