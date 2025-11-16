import type { TablaEstrellas, TipoCuerpoCentral } from '../types';

/**
 * TABLA_ESTRELLAS
 * -----------------
 * Esta es la base de datos principal para la generación procedural de estrellas.
 * Cada entrada corresponde a un `TipoEstrella` y contiene todas las propiedades
 * físicas y de gameplay asociadas.
 *
 * Propiedades clave:
 * - `peso`: Un valor numérico que determina la probabilidad de que este tipo de
 *   estrella sea elegida durante la generación. Un peso más alto significa que
 *   es más común.
 * - `...datosEstrella`: Todas las demás propiedades que se copiarán directamente
 *   a la entidad `Estrella` generada.
 */
export const TABLA_ESTRELLAS: TablaEstrellas = {
  // --- TIPOS BASE ---
  enana_roja: {
    peso: 40, tipoBase: 'enana_roja',
    masaRelativa: 'baja', radioRelativo: 'pequeno', luminosidadRelativa: 'baja', temperaturaSuperficial: 'baja',
    edadEstelar: 'adulta', metalicidad: 'media', actividad: 'activa',
    colorPrincipal: 'rojo apagado / anaranjado', colorSecundario: ['naranja'], colorCieloPlanetario: 'rojizo', colorHex: '#ff8f70',
    intensidadColor: 'apagada', tipoIluminacion: 'suave',
    claseEstelar: 'M', masaSolar: 0.3, radioSolar: 0.4, luminosidadSolar: 0.04, temperaturaSuperficialK: 3200,
    tipoSistema: { numPlanetasEstimado: [4, 8], probabilidadLunas: 'media', probabilidadCinturonAsteroides: 'media' },
    cristales: { fuego: 'alto', hielo: 'bajo', electrico: 'muy_bajo', gravedad: 'alto', luz: 'muy_bajo', radioactivo: 'bajo', magico: 'muy_bajo', purezaMedia: 'baja' },
    peligros: ['Llamaradas solares frecuentes', 'Zonas habitables muy cercanas a la estrella'],
    atractivosSistema: ['Ideal para bases a largo plazo', 'Recursos estables pero de bajo nivel']
  },
  solar: {
    peso: 20, tipoBase: 'solar',
    masaRelativa: 'media', radioRelativo: 'medio', luminosidadRelativa: 'media', temperaturaSuperficial: 'media',
    edadEstelar: 'adulta', metalicidad: 'media', actividad: 'calma',
    colorPrincipal: 'amarillo/blanco', colorSecundario: ['blanco'], colorCieloPlanetario: 'azul claro', colorHex: '#fff2a1',
    intensidadColor: 'neutra', tipoIluminacion: 'suave',
    claseEstelar: 'G', masaSolar: 1, radioSolar: 1, luminosidadSolar: 1, temperaturaSuperficialK: 5800,
    tipoSistema: { numPlanetasEstimado: [3, 7], probabilidadLunas: 'alta', probabilidadCinturonAsteroides: 'media' },
    cristales: { fuego: 'medio', hielo: 'medio', electrico: 'medio', gravedad: 'bajo', luz: 'medio', radioactivo: 'muy_bajo', magico: 'bajo', purezaMedia: 'media' },
    peligros: ['Pocos peligros estelares sistémicos'],
    atractivosSistema: ['Sistemas balanceados', 'Variedad de biomas clásicos', 'Buen punto de partida']
  },
  enana_naranja: {
    peso: 30, tipoBase: 'enana_naranja',
    masaRelativa: 'baja', radioRelativo: 'pequeno', luminosidadRelativa: 'baja', temperaturaSuperficial: 'media',
    edadEstelar: 'adulta', metalicidad: 'media', actividad: 'calma',
    colorPrincipal: 'naranja', colorSecundario: ['amarillo'], colorCieloPlanetario: 'anaranjado pálido', colorHex: '#ffc56f',
    intensidadColor: 'neutra', tipoIluminacion: 'calida',
    claseEstelar: 'K', masaSolar: 0.6, radioSolar: 0.7, luminosidadSolar: 0.2, temperaturaSuperficialK: 4500,
    tipoSistema: { numPlanetasEstimado: [3, 6], probabilidadLunas: 'media', probabilidadCinturonAsteroides: 'baja' },
    cristales: { fuego: 'medio', hielo: 'alto', electrico: 'bajo', gravedad: 'medio', luz: 'bajo', radioactivo: 'muy_bajo', magico: 'muy_bajo', purezaMedia: 'baja' },
    peligros: ['Climas extremos en los bordes del sistema'],
    atractivosSistema: ['Planetas de exploración hostil pero viable']
  },
  azul_caliente: {
    peso: 5, tipoBase: 'azul_caliente',
    masaRelativa: 'alta', radioRelativo: 'grande', luminosidadRelativa: 'extrema', temperaturaSuperficial: 'extrema',
    edadEstelar: 'joven', metalicidad: 'baja', actividad: 'muy_activa',
    colorPrincipal: 'azul intenso', colorSecundario: ['blanco azulado'], colorCieloPlanetario: 'azul profundo o violeta', colorHex: '#aaccff',
    intensidadColor: 'muy_saturada', tipoIluminacion: 'dura',
    claseEstelar: 'O', masaSolar: 15, radioSolar: 6, luminosidadSolar: 30000, temperaturaSuperficialK: 35000,
    tipoSistema: { numPlanetasEstimado: [2, 5], probabilidadLunas: 'baja', probabilidadCinturonAsteroides: 'alta' },
    cristales: { fuego: 'bajo', hielo: 'medio', electrico: 'muy_alto', gravedad: 'medio', luz: 'alto', radioactivo: 'medio', magico: 'bajo', purezaMedia: 'alta' },
    peligros: ['Alta radiación constante', 'Tormentas energéticas'],
    atractivosSistema: ['Sistemas de alto riesgo/recompensa', 'Cristales eléctricos de alta pureza', 'Misiones avanzadas']
  },
  gigante_roja: {
    peso: 2, tipoBase: 'gigante_roja',
    masaRelativa: 'alta', radioRelativo: 'muy_grande', luminosidadRelativa: 'alta', temperaturaSuperficial: 'baja',
    edadEstelar: 'moribunda', metalicidad: 'alta', actividad: 'inestable',
    colorPrincipal: 'rojo intenso', colorSecundario: ['carmesí'], colorCieloPlanetario: 'rojo sangre', colorHex: '#ff6b6b',
    intensidadColor: 'saturada', tipoIluminacion: 'calida',
    claseEstelar: 'M', masaSolar: 2, radioSolar: 100, luminosidadSolar: 500, temperaturaSuperficialK: 3500,
    tipoSistema: { numPlanetasEstimado: [1, 4], probabilidadLunas: 'baja', probabilidadCinturonAsteroides: 'muy_alta' },
    cristales: { fuego: 'muy_alto', hielo: 'muy_bajo', electrico: 'bajo', gravedad: 'medio', luz: 'muy_bajo', radioactivo: 'alto', magico: 'muy_bajo', purezaMedia: 'media' },
    peligros: ['Pulsos de energía', 'Inestabilidad gravitacional', 'Planetas calcinados'],
    atractivosSistema: ['Exploración de ruinas', 'Cinturones de asteroides ricos en metales', 'Loot raro']
  },
  enana_blanca: {
    peso: 1, tipoBase: 'enana_blanca',
    masaRelativa: 'media', radioRelativo: 'muy_pequeno', luminosidadRelativa: 'muy_baja', temperaturaSuperficial: 'alta',
    edadEstelar: 'moribunda', metalicidad: 'alta', actividad: 'calma',
    colorPrincipal: 'blanco azulado brillante', colorSecundario: ['blanco'], colorCieloPlanetario: 'luz blanca y dura', colorHex: '#cad7ff',
    intensidadColor: 'saturada', tipoIluminacion: 'dura',
    claseEstelar: 'D', masaSolar: 0.8, radioSolar: 0.01, luminosidadSolar: 0.01, temperaturaSuperficialK: 25000,
    tipoSistema: { numPlanetasEstimado: [0, 3], probabilidadLunas: 'baja', probabilidadCinturonAsteroides: 'alta' },
    cristales: { fuego: 'bajo', hielo: 'bajo', electrico: 'medio', gravedad: 'alto', luz: 'alto', radioactivo: 'medio', magico: 'medio', purezaMedia: 'alta' },
    peligros: ['Radiación enfocada', 'Restos de planetas'],
    atractivosSistema: ['Chatarra espacial', 'Reliquias tecnológicas', 'Cristales comprimidos']
  },
  // --- TIPOS ESPECIALES (Con temáticas de gameplay más marcadas) ---
  verde_clorofotica: {
    peso: 4, tipoBase: 'verde_clorofotica',
    masaRelativa: 'media', radioRelativo: 'medio', luminosidadRelativa: 'alta', temperaturaSuperficial: 'media',
    edadEstelar: 'adulta', metalicidad: 'media', actividad: 'calma',
    colorPrincipal: 'verde-amarillento', colorSecundario: ['dorado'], colorCieloPlanetario: 'verde pálido', colorHex: '#A8E063',
    intensidadColor: 'saturada', tipoIluminacion: 'verdosa',
    claseEstelar: 'F', masaSolar: 1.2, radioSolar: 1.3, luminosidadSolar: 2.5, temperaturaSuperficialK: 6500,
    tipoSistema: { numPlanetasEstimado: [3, 6], probabilidadLunas: 'alta', probabilidadCinturonAsteroides: 'baja' },
    cristales: { fuego: 'medio', hielo: 'bajo', electrico: 'medio', gravedad: 'bajo', luz: 'medio', radioactivo: 'alto', magico: 'bajo', purezaMedia: 'media' },
    peligros: ['Polen estelar que interfiere con sensores'],
    atractivosSistema: ['Biomas ricos en flora y fauna', 'Alta probabilidad de recursos de curación y mejoras biológicas', 'Ideal para colonias orgánicas']
  },
  roja_marcial: {
    peso: 4, tipoBase: 'roja_marcial',
    masaRelativa: 'media', radioRelativo: 'medio', luminosidadRelativa: 'media', temperaturaSuperficial: 'media',
    edadEstelar: 'adulta', metalicidad: 'alta', actividad: 'muy_activa',
    colorPrincipal: 'rojo granate', colorSecundario: ['naranja oscuro'], colorCieloPlanetario: 'rojo polvoriento', colorHex: '#D32D41',
    intensidadColor: 'saturada', tipoIluminacion: 'dura',
    claseEstelar: 'K', masaSolar: 0.7, radioSolar: 0.8, luminosidadSolar: 0.3, temperaturaSuperficialK: 4800,
    tipoSistema: { numPlanetasEstimado: [2, 5], probabilidadLunas: 'baja', probabilidadCinturonAsteroides: 'alta' },
    cristales: { fuego: 'muy_alto', hielo: 'bajo', electrico: 'medio', gravedad: 'medio', luz: 'muy_bajo', radioactivo: 'bajo', magico: 'muy_bajo', purezaMedia: 'baja' },
    peligros: ['Llamaradas violentas y frecuentes', 'Viento solar intenso'],
    atractivosSistema: ['Territorio de facciones guerreras', 'Contratos de combate', 'Loot de armas']
  },
  azul_abisal: {
    peso: 4, tipoBase: 'azul_abisal',
    masaRelativa: 'alta', radioRelativo: 'grande', luminosidadRelativa: 'alta', temperaturaSuperficial: 'alta',
    edadEstelar: 'adulta', metalicidad: 'baja', actividad: 'activa',
    colorPrincipal: 'azul frío', colorSecundario: ['cian'], colorCieloPlanetario: 'azul grisáceo', colorHex: '#42A5F5',
    intensidadColor: 'saturada', tipoIluminacion: 'fria',
    claseEstelar: 'B', masaSolar: 8, radioSolar: 4, luminosidadSolar: 5000, temperaturaSuperficialK: 20000,
    tipoSistema: { numPlanetasEstimado: [4, 7], probabilidadLunas: 'alta', probabilidadCinturonAsteroides: 'media' },
    cristales: { fuego: 'bajo', hielo: 'muy_alto', electrico: 'alto', gravedad: 'medio', luz: 'medio', radioactivo: 'muy_bajo', magico: 'medio', purezaMedia: 'media' },
    peligros: ['Bolsas de frío extremo en el espacio', 'Interferencia electromagnética'],
    atractivosSistema: ['Planetas oceánicos profundos', 'Biomas helados', 'Exploración submarina']
  },
  cristal: {
    peso: 0.5, tipoBase: 'cristal',
    masaRelativa: 'media', radioRelativo: 'medio', luminosidadRelativa: 'alta', temperaturaSuperficial: 'alta',
    edadEstelar: 'joven', metalicidad: 'alta', actividad: 'inestable',
    colorPrincipal: 'iridiscente', colorSecundario: ['blanco', 'arcoiris'], colorCieloPlanetario: 'prismático', colorHex: '#E0E0E0',
    intensidadColor: 'muy_saturada', tipoIluminacion: 'espectral',
    claseEstelar: 'A', masaSolar: 2, radioSolar: 1.8, luminosidadSolar: 25, temperaturaSuperficialK: 9000,
    tipoSistema: { numPlanetasEstimado: [1, 3], probabilidadLunas: 'baja', probabilidadCinturonAsteroides: 'muy_alta' },
    cristales: { fuego: 'alto', hielo: 'alto', electrico: 'alto', gravedad: 'alto', luz: 'muy_alto', radioactivo: 'alto', magico: 'alto', purezaMedia: 'alta' },
    peligros: ['Picos de energía elemental aleatorios', 'Campos de distorsión'],
    atractivosSistema: ['Zona Endgame', 'Cristales de alta pureza garantizados', 'Guerra de facciones por recursos']
  },
  anomala_gravitacional: {
    peso: 0.5, tipoBase: 'anomala_gravitacional',
    masaRelativa: 'muy_alta', radioRelativo: 'pequeno', luminosidadRelativa: 'baja', temperaturaSuperficial: 'extrema',
    edadEstelar: 'adulta', metalicidad: 'alta', actividad: 'inestable',
    colorPrincipal: 'oscuro con disco de acreción brillante', colorSecundario: ['violeta', 'azul'], colorCieloPlanetario: 'distorsionado', colorHex: '#9C27B0',
    intensidadColor: 'saturada', tipoIluminacion: 'espectral',
    claseEstelar: 'X', masaSolar: 20, radioSolar: 0.1, luminosidadSolar: 0.001, temperaturaSuperficialK: 100000,
    tipoSistema: { numPlanetasEstimado: [0, 2], probabilidadLunas: 'baja', probabilidadCinturonAsteroides: 'alta' },
    cristales: { fuego: 'bajo', hielo: 'bajo', electrico: 'medio', gravedad: 'muy_alto', luz: 'medio', radioactivo: 'bajo', magico: 'medio', purezaMedia: 'alta' },
    peligros: ['Pozos de gravedad', 'Radiación extrema', 'Distorsiones temporales'],
    atractivosSistema: ['Tecnología de motores y armas de gravedad', 'Extremadamente peligroso', 'Requiere equipamiento especial']
  }
};

/**
 * CONFIG_CUERPO_CENTRAL
 * ---------------------
 * Define las probabilidades de que un sistema sea generado con un cuerpo
 * central específico (Estrella, Agujero Negro, etc.) y los parámetros
 * para la generación de cuerpos especiales.
 */
export const CONFIG_CUERPO_CENTRAL = {
  probabilidades: [
    { tipo: "ESTRELLA", peso: 98 },
    { tipo: "AGUJERO_NEGRO", peso: 1 },
    { tipo: "PULSAR", peso: 1 },
  ] as { tipo: TipoCuerpoCentral, peso: number }[],
  parametrosCuerpoEspecial: {
    AGUJERO_NEGRO: {
      masaMs: { min: 3, max: 30 },
      spin: { min: 0, max: 1 },
    },
    PULSAR: {
      periodoSpinMs: { min: 1, max: 100 },
      campoMagneticoT: { min: 1e4, max: 1e9 },
    },
  },
};

/**
 * CONFIG_ORBITA
 * -------------
 * Controla los parámetros para la generación de las órbitas planetarias.
 * - `numOrbitas`: Rango por defecto del número de órbitas. Será sobreescrito por la configuración de la estrella.
 * - `paramsPorCuerpo`: Parámetros orbitales específicos según el tipo de cuerpo central.
 *   - `a0_UA`: Rango para el semieje mayor (distancia) de la primera órbita.
 *   - `k_espaciado`: Multiplicador para espaciar las órbitas sucesivas, simulando una ley de Titius-Bode.
 *   - `i_deg`: Rango de inclinación de la órbita.
 * - `general`: Parámetros comunes para todas las órbitas (excentricidad, ángulos, etc.).
 */
export const CONFIG_ORBITA = {
  numOrbitas: { min: 1, max: 5 }, // Será sobreescrito por el tipo de estrella
  paramsPorCuerpo: {
    ESTRELLA: {
      a0_UA: { min: 0.2, max: 0.6 },
      k_espaciado: { min: 1.4, max: 2.0 },
      i_deg: { min: 0, max: 5 },
    },
    AGUJERO_NEGRO: {
      a0_UA: { min: 0.01, max: 0.2 },
      k_espaciado: { min: 1.6, max: 2.2 },
      i_deg: { min: 0, max: 20 },
    },
    PULSAR: {
      a0_UA: { min: 0.01, max: 0.2 },
      k_espaciado: { min: 1.6, max: 2.2 },
      i_deg: { min: 0, max: 20 },
    },
  },
  general: {
    e: { min: 0.0, max: 0.35 },
    omega_deg: { min: 0, max: 360 },
    Omega_deg: { min: 0, max: 360 },
    M0_deg: { min: 0, max: 360 },
  }
};