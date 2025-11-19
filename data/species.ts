
import { EspecieInteligente } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 2, fechaCreacion: now, fechaActualizacion: now };

// Placeholder SVG for Snail Sun (Clean, lightweight)
const SNAIL_SUN_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjMjEyMTIxIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzg0Y2MxNiIgb3BhY2l0eT0iMC4yIi8+PHBhdGggZD0iTTUwIDI1QzM2LjE5IDI1 2NSAzNi4xOSA1MCA1MCA1MFM3NSA2My44MSA3NSA1MCA2My44MSAyNSA1MCAyNXptMCA0MGMtOC4yOCAwLTE1LTYuNzItMTUtMTVzNi43Mi0xNSAxNS0xNSAxNSA2LjcyIDE1IDE1LTYuNzIgMTUtMTUgMTV6IiBmaWxsPSIjODRjYzE2Ii8+PC9zdmc+";

export const ALL_SPECIES: EspecieInteligente[] = [
  {
    ...base,
    id: 'species_snail_sun',
    nombre: 'Snail Sun (Caracol Solar)',
    descripcion: 'Una especie fotosintética con alta resistencia biológica pero fragilidad física.',
    tags: ['fotosintetico', 'herbivoro', 'soporte'],
    colorClave: '#84cc16', // lime-500
    urlImagen: SNAIL_SUN_SVG, 
    lore: [
      'Son seres humanoides esbeltos con piel suave y húmeda, a menudo en tonos verdes y amarillos.',
      'Su espalda está cubierta por una capa de células clorofílicas que les permite realizar fotosíntesis.',
      'Cultura pacífica y comunal, dependientes de la luz solar.'
    ],
    habilidades: [
      {
        nombre: 'Rayo Clorofila',
        descripcion: 'Emite un pulso de energía que cura a aliados o purifica el suelo.',
        tipo: 'ACTIVA',
        cooldownSegundos: 60,
        costoRecurso: { tipo: 'aguante', cantidad: 30 }
      }
    ],
    rasgos: [
      {
        nombre: 'Fotosíntesis Biológica',
        descripcion: 'Regenera hambre pasivamente bajo la luz del sol.',
        tipo: 'VENTAJA',
      },
      {
        nombre: 'Piel Blanda',
        descripcion: 'Sufren más daño físico debido a su falta de armadura natural.',
        tipo: 'DESVENTAJA',
        modificador: { statAfectado: 'defensa', valor: -3, esPorcentaje: false }
      },
      {
        nombre: 'Metabolismo Lento',
        descripcion: 'Consumen oxígeno y aguante más lentamente.',
        tipo: 'VENTAJA',
        modificador: { statAfectado: 'aguante', valor: 20, esPorcentaje: false }
      }
    ],
    planetasComunes: ['JUNGLA'],
    modificadoresStatsBase: { 
      salud: 20, 
      aguante: 30, 
      defensa: -2,
      velocidadMovimiento: -1
    },
    biomasInicio: ['selva_humeda'],
    metabolismo: { 
      dieta: 'fototrofico', 
      entornosFavorables: ['soleado', 'humedo'], 
      entornosDesfavorables: ['frio', 'arido'],
      resistenciaHambre: 1.5,
      resistenciaSed: 0.8
    },
    afinidadCristales: ['LUZ', 'RADIOACTIVO'],
  },
  {
    ...base,
    id: 'species_quillfolk',
    nombre: 'Quillfolk (Pangolín Vaquero)',
    descripcion: 'Robustos supervivientes del desierto, expertos en combate a distancia y autosuficiencia.',
    tags: ['carnivoro', 'artesano', 'tanque'],
    colorClave: '#dc2626', // red-600
    lore: [
      'Humanoides bajos y corpulentos, cubiertos de placas quitinosas y espinas.',
      'Cultura ruda de estilo "western", valoran la puntería y la resistencia.',
      'Son carnívoros estrictos.'
    ],
    habilidades: [
      {
        nombre: 'Tiro Perforante',
        descripcion: 'Un disparo cargado que ignora parte de la armadura del objetivo.',
        tipo: 'ACTIVA',
        cooldownSegundos: 15,
        costoRecurso: { tipo: 'aguante', cantidad: 20 }
      }
    ],
    rasgos: [
      {
        nombre: 'Caparazón Quitinoso',
        descripcion: 'Ofrece protección natural contra ataques físicos.',
        tipo: 'VENTAJA',
        modificador: { statAfectado: 'defensa', valor: 8, esPorcentaje: false }
      },
      {
        nombre: 'Autogeneración',
        descripcion: 'Generan espinas que pueden usarse como munición improvisada.',
        tipo: 'VENTAJA'
      },
      {
        nombre: 'Sangre Caliente',
        descripcion: 'Sufren hipotermia más rápido en climas fríos.',
        tipo: 'DESVENTAJA'
      }
    ],
    planetasComunes: ['DESERTICO'],
    modificadoresStatsBase: { 
      salud: 15, 
      ataque: 5, 
      defensa: 8,
      velocidadMovimiento: -0.5,
      capacidadCarga: 20
    },
    biomasInicio: ['desierto_arido'],
    metabolismo: { 
      dieta: 'carnivoro', 
      entornosFavorables: ['arido', 'calido'], 
      entornosDesfavorables: ['frio'],
      resistenciaHambre: 0.9,
      resistenciaSed: 1.2
    },
    afinidadCristales: ['FUEGO'],
  },
  {
    ...base,
    id: 'species_abyssal_choir',
    nombre: 'Abyssal Choir',
    descripcion: 'Exploradores anfibios de las profundidades, frágiles en tierra pero inigualables en el agua.',
    tags: ['acuatico', 'anfibio', 'explorador'],
    colorClave: '#3b82f6', // blue-500
    lore: [
      'Humanoides altos y delgados con rasgos de peces abisales y bioluminiscencia.',
      'Se comunican mediante canciones sónicas complejas.',
      'Guardianes de conocimientos antiguos submarinos.'
    ],
    habilidades: [
      {
        nombre: 'Canto de Sonar',
        descripcion: 'Revela recursos y enemigos cercanos a través de las paredes.',
        tipo: 'ACTIVA',
        cooldownSegundos: 30,
        costoRecurso: { tipo: 'energia', cantidad: 10 }
      }
    ],
    rasgos: [
      {
        nombre: 'Respiración Anfibia',
        descripcion: 'Pueden respirar bajo el agua indefinidamente.',
        tipo: 'VENTAJA'
      },
      {
        nombre: 'Hidrodinámico',
        descripcion: 'Se mueven mucho más rápido al nadar.',
        tipo: 'VENTAJA'
      },
      {
        nombre: 'Piel Desecable',
        descripcion: 'Se deshidratan extremadamente rápido en tierra firme.',
        tipo: 'DESVENTAJA',
        modificador: { statAfectado: 'salud', valor: -10, esPorcentaje: false }
      }
    ],
    planetasComunes: ['ACUATICO'],
    modificadoresStatsBase: { 
      aguante: 40,
      salud: -10,
      velocidadMovimiento: 1
    },
    biomasInicio: ['arrecife_coralino'],
    metabolismo: { 
      dieta: 'carnivoro', 
      entornosFavorables: ['acuatico'], 
      entornosDesfavorables: ['arido'],
      resistenciaHambre: 1.0,
      resistenciaSed: 0.5 // Muy baja resistencia a la sed fuera del agua
    },
    afinidadCristales: ['HIELO', 'ELECTRICO'],
  },
  {
    ...base,
    id: 'species_aetherial',
    nombre: 'Aetherial',
    descripcion: 'Seres de pura energía. Inmunes a muchas amenazas físicas pero dependientes de cristales para sobrevivir.',
    tags: ['energia', 'volador', 'magico'],
    colorClave: '#a855f7', // purple-500
    lore: [
      'Siluetas humanoides de luz cristalina y energía crepitante.',
      'No tienen sociedad tradicional, meditan cerca de nodos de poder.',
      'Incapaces de usar tecnología mecánica convencional.'
    ],
    habilidades: [
      {
        nombre: 'Sobrecarga Elemental',
        descripcion: 'Consume energía para desatar una explosión basada en el último cristal consumido.',
        tipo: 'ACTIVA',
        cooldownSegundos: 10,
        costoRecurso: { tipo: 'energia', cantidad: 50 }
      }
    ],
    rasgos: [
      {
        nombre: 'Cuerpo Intangible',
        descripcion: 'Alta resistencia al daño físico, pero extremadamente vulnerable a daño mágico o energético.',
        tipo: 'VENTAJA',
        modificador: { statAfectado: 'defensa', valor: -20, esPorcentaje: false } // Mecánica especial: esquiva alta, defensa nula
      },
      {
        nombre: 'Levitación',
        descripcion: 'Ignora terreno difícil y daño por caída.',
        tipo: 'VENTAJA',
        modificador: { statAfectado: 'velocidadMovimiento', valor: 2, esPorcentaje: false }
      },
      {
        nombre: 'Dieta Litotrófica',
        descripcion: 'Solo pueden alimentarse de cristales y minerales energéticos.',
        tipo: 'NEUTRAL'
      }
    ],
    planetasComunes: [],
    modificadoresStatsBase: { 
      ataque: 15, 
      defensa: -15, // Muy frágiles físicamente si les golpean
      aguante: 100, // Usan "aguante" como barra de maná/energía
      salud: -20
    },
    biomasInicio: ['cavernas_cristalinas'],
    metabolismo: { 
      dieta: 'litotrofico', 
      entornosFavorables: ['cristalino'], 
      entornosDesfavorables: [],
      resistenciaHambre: 1.0,
      resistenciaSed: 2.0 // No beben agua
    },
    afinidadCristales: ['MAGICO', 'GRAVEDAD', 'LUZ', 'FUEGO', 'HIELO', 'ELECTRICO'],
  }
];
