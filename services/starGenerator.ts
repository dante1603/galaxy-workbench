/**
 * @file starGenerator.ts
 * @description This service is the core of the procedural generation engine.
 * It is responsible for creating entire star systems, including the central star
 * (or special body), its orbits, and the celestial objects within those orbits
 * like planets and asteroid belts.
 */

import type {
  Estrella, Sistema, CuerpoEspecial, Orbita, ObjetoOrbital, CargaUtilPlaneta,
  TipoPlaneta, Cristal, Probabilidad, TipoCristal, CargaUtilCinturonAsteroides,
  ObjetoSubOrbitalPlaneta, CargaUtilLuna, CargaUtilAnillo, Bioma, CategoriaBiome,
  TipoEstrella, EntidadBase, TipoCuerpoCentral, NivelRelativo, DistribucionBioma, Ecosistema
} from '../types';
import { TABLA_ESTRELLAS, CONFIG_CUERPO_CENTRAL, CONFIG_ORBITA } from '../constants/starTables';
import { getAllBiomes, getAllFauna, getAllPlants, getAllMinerals } from './dataService';
import { GREEK_LETTERS, CONSTELLATION_GENITIVES } from '../constants/starNames';
import { roundTo, randRange, pick, id, weightedPick, randInt } from '../utils/helpers';

// --- CONSTANTES FISICAS ---
// 1 Radio Solar aprox = 0.00465 UA. 
// Usamos esto para asegurar que los planetas no nazcan dentro de la estrella.
const RADIO_SOLAR_A_UA = 0.00465; 
const MARGEN_SEGURIDAD_ESTELAR = 1.5; // Los planetas deben estar al menos a 1.5x el radio de la estrella

// --- HELPERS DE GENERACIÓN ---

/**
 * Creates a base metadata object for any new game entity.
 * @param entidadId The ID of the entity being created.
 * @returns An object with default metadata properties.
 */
const crearMetadatosBase = (entidadId: string): Omit<EntidadBase, 'id'> => {
  const now = new Date().toISOString();
  return {
    estado: 'borrador',
    version: 1,
    fechaCreacion: now,
    fechaActualizacion: now,
  };
};

/**
 * Generates a procedural star name based on Greek letters and constellation names.
 * @returns A star name string, e.g., "Alpha Andromedae".
 */
const nombrarEstrella = (): string => {
  return `${pick(GREEK_LETTERS)} ${pick(CONSTELLATION_GENITIVES)}`;
};

/**
 * Converts a probability string (e.g., 'muy_alto') into a numerical weight for calculations.
 * @param prob The probability string.
 * @returns A numerical weight.
 */
const probToWeight = (prob: Probabilidad): number => {
  switch (prob) {
    case 'muy_alto': return 5;
    case 'alto': return 4;
    case 'medio': return 3;
    case 'bajo': return 2;
    case 'muy_bajo': return 1;
    default: return 0;
  }
};

// --- GENERACIÓN DE ECOSISTEMA (CADENA TRÓFICA) ---

/**
 * Generates a cohesive ecosystem based on biome constraints and biological dependencies.
 */
const generarEcosistema = async (biome: Bioma): Promise<Ecosistema> => {
  const ALL_FAUNA = await getAllFauna();
  const ALL_PLANTS = await getAllPlants();
  const ALL_MINERALS = await getAllMinerals();

  const ecosistema: Ecosistema = {
    minerales: [],
    flora: { arboles: [], arbustos: [], cobertura: [], especiales: [] },
    fauna: { 
        depredadoresApex: [], depredadoresPequenos: [], 
        presasGrandes: [], presasMedianas: [], presasPequenas: [], 
        carroneros: [] 
    }
  };

  // 1. MINERALES (Base del suelo)
  // Prioridad: Minerales compatibles con el tipo de suelo > Tags coincidentes > Lista explícita
  const mineralesCompatibles = ALL_MINERALS.filter(m => 
      (m.suelosCompatibles && m.suelosCompatibles.includes(biome.tipoSuelo)) ||
      m.tags.includes(biome.categoria) || 
      biome.mineralesPosibles.includes(m.id)
  );

  if (mineralesCompatibles.length > 0) {
      ecosistema.minerales.push(pick(mineralesCompatibles).id);
      // Chance extra mineral
      if (Math.random() > 0.5) ecosistema.minerales.push(pick(mineralesCompatibles).id);
  }

  // 2. FLORA (Productores)
  // Seleccionar plantas compatibles con el bioma
  const floraCompatible = ALL_PLANTS.filter(p => 
      p.biomeIds.includes(biome.id) || p.tags.includes(biome.categoria)
  );

  // Rellenar Slots de Flora
  const arboles = floraCompatible.filter(p => p.estructura === 'arborea' || p.estructura === 'hongo' || p.estructura === 'succulenta_gigante');
  const arbustos = floraCompatible.filter(p => p.estructura === 'arbustiva' || p.estructura === 'liana');
  const cobertura = floraCompatible.filter(p => p.estructura === 'herbacea' || p.estructura === 'acuatica_flotante');
  const especiales = floraCompatible.filter(p => p.estructura === 'parasita' || p.estructura === 'epifita' || p.estructura === 'acuatica_sumergida');

  if (arboles.length > 0) ecosistema.flora.arboles.push(pick(arboles).id);
  if (arbustos.length > 0) ecosistema.flora.arbustos.push(pick(arbustos).id);
  if (cobertura.length > 0) ecosistema.flora.cobertura.push(pick(cobertura).id);
  if (especiales.length > 0 && Math.random() > 0.3) ecosistema.flora.especiales.push(pick(especiales).id);


  // 3. FAUNA HERBIVORA (Consumidores Primarios)
  // Filtro: Debe ser herbívoro Y ser compatible con el bioma
  // (Simplificación: Asumimos que si el bioma coincide, pueden comer la flora local)
  const herbivorosCompatibles = ALL_FAUNA.filter(f => 
      (f.dieta === 'herbivoro' || f.dieta === 'omnivoro' || f.dieta === 'litotrofico') && 
      (f.biomeIds.includes(biome.id) || f.tags.includes(biome.categoria))
  );

  const presasGrandes = herbivorosCompatibles.filter(f => f.tamano === 'grande' || f.tamano === 'muy_grande' || f.tamano === 'colosal');
  const presasMedianas = herbivorosCompatibles.filter(f => f.tamano === 'medio');
  const presasPequenas = herbivorosCompatibles.filter(f => f.tamano === 'pequeno' || f.tamano === 'diminuto');

  // Solo añadir herbívoros si hay plantas (o son litotróficos)
  const hayComidaVegetal = ecosistema.flora.arboles.length > 0 || ecosistema.flora.arbustos.length > 0 || ecosistema.flora.cobertura.length > 0;
  
  if (hayComidaVegetal) {
      if (presasGrandes.length > 0) ecosistema.fauna.presasGrandes.push(pick(presasGrandes).id);
      if (presasMedianas.length > 0) ecosistema.fauna.presasMedianas.push(pick(presasMedianas).id);
      if (presasPequenas.length > 0) ecosistema.fauna.presasPequenas.push(pick(presasPequenas).id);
  }

  // 4. FAUNA CARNIVORA (Depredadores)
  // Filtro: Carnívoros compatibles con el bioma
  const carnivorosCompatibles = ALL_FAUNA.filter(f => 
      (f.dieta === 'carnivoro' || f.dieta === 'omnivoro') && 
      (f.biomeIds.includes(biome.id) || f.tags.includes(biome.categoria))
  );

  // Lógica Depredador Apex: Necesita presas grandes o medianas
  const hayPresasGrandes = ecosistema.fauna.presasGrandes.length > 0 || ecosistema.fauna.presasMedianas.length > 0;
  
  const apexCandidates = carnivorosCompatibles.filter(f => (f.tamano === 'grande' || f.tamano === 'muy_grande' || f.tamano === 'colosal') && f.rolCombate.includes('jefe') || f.rolCombate.includes('tanque'));
  const smallPredCandidates = carnivorosCompatibles.filter(f => f.tamano === 'pequeno' || f.tamano === 'medio');

  if (hayPresasGrandes && apexCandidates.length > 0) {
      ecosistema.fauna.depredadoresApex.push(pick(apexCandidates).id);
  }

  if ((ecosistema.fauna.presasPequenas.length > 0 || ecosistema.fauna.presasMedianas.length > 0) && smallPredCandidates.length > 0) {
      ecosistema.fauna.depredadoresPequenos.push(pick(smallPredCandidates).id);
  }

  // 5. DESCOMPONEDORES
  const carroneros = ALL_FAUNA.filter(f => f.dieta === 'carronero' && (f.biomeIds.includes(biome.id) || f.tags.includes(biome.categoria)));
  if (carroneros.length > 0) {
      ecosistema.fauna.carroneros.push(pick(carroneros).id);
  }

  return ecosistema;
};


// --- GENERACIÓN DE CARGAS ÚTILES Y SUB-ÓRBITAS ---

/** Generates the payload data for a moon. */
const generarCargaUtilLuna = (todosBiomas: Bioma[]): CargaUtilLuna => {
    const tipoLuna = pick<'rocosa' | 'helada' | 'volcanica'>(['rocosa', 'helada', 'volcanica']);
    const biomasInospitos = todosBiomas.filter(b => b.categoria === 'INOSPITO');
    
    // Fallback if no specific inhospitable biomes found
    const biomaLuna = biomasInospitos.length > 0 ? pick(biomasInospitos) : pick(todosBiomas);
    
    return {
        nombre: `Luna ${tipoLuna.charAt(0).toUpperCase() + tipoLuna.slice(1)}`,
        descripcion: `Una luna ${tipoLuna} con un bioma inhóspito.`,
        tipo: tipoLuna,
        biomeId: biomaLuna ? biomaLuna.id : 'unknown',
    };
};

/** Generates the payload data for a planetary ring. */
const generarCargaUtilAnillo = (): CargaUtilAnillo => {
    return {
        composicion: pick(['hielo', 'roca', 'metal']),
        densidad: pick(['tenue', 'medio', 'denso']),
    };
};

/**
 * Generates sub-orbital objects (moons and rings) for a given planet.
 * @param planeta The planet payload to generate sub-orbits for.
 * @returns An array of sub-orbital objects.
 */
const generarSubOrbitas = (planeta: CargaUtilPlaneta, todosBiomas: Bioma[]): ObjetoSubOrbitalPlaneta[] => {
    const subOrbitas: ObjetoSubOrbitalPlaneta[] = [];
    const esGiganteGaseoso = planeta.tipoPlaneta === "GIGANTE_GASEOSO";

    // Rings are more likely for gas giants.
    const chanceAnillo = esGiganteGaseoso ? 0.6 : 0.1;
    if (Math.random() < chanceAnillo) {
        const idAnillo = id('ANILLO');
        subOrbitas.push({
            id: idAnillo,
            ...crearMetadatosBase(idAnillo),
            tipo: 'ANILLO',
            cargaUtil: generarCargaUtilAnillo(),
        });
    }
    
    // Gas giants can have more moons.
    const maxLunas = esGiganteGaseoso ? 6 : 3;
    const numLunas = Math.floor(Math.random() * (maxLunas + 1));
    for (let i = 0; i < numLunas; i++) {
        const idLuna = id('LUNA');
        subOrbitas.push({
            id: idLuna,
            ...crearMetadatosBase(idLuna),
            tipo: 'LUNA',
            cargaUtil: generarCargaUtilLuna(todosBiomas),
        });
    }

    return subOrbitas;
};

/**
 * Generates the detailed payload for a planet, including its type, biomes, crystals, etc.
 * @param cuerpoCentral The central star or body of the system.
 * @param a_UA The planet's distance from the central body in AU.
 * @returns A promise that resolves to the generated planet payload.
 */
const generarCargaUtilPlaneta = async (cuerpoCentral: Estrella | CuerpoEspecial, a_UA: number): Promise<CargaUtilPlaneta> => {
    const TODOS_BIOMAS = await getAllBiomes();
    const esGiganteGaseoso = a_UA > 2.5 && Math.random() < 0.5;

    let tipoPlaneta: TipoPlaneta;
    let titulo: string;

    if (esGiganteGaseoso) {
        tipoPlaneta = "GIGANTE_GASEOSO";
        titulo = "Gigante Gaseoso";
    } else {
        // Determine planet type based on weights, potentially influenced by the star type.
        const pesosTipoPlaneta: { tipo: TipoPlaneta, peso: number }[] = [
            { tipo: "DESERTICO", peso: 1 }, { tipo: "JUNGLA", peso: 1 },
            { tipo: "VOLCANICO", peso: 1 }, { tipo: "ACUATICO", peso: 1 },
        ];

        if (cuerpoCentral.tipo === 'ESTRELLA') {
            const estrella = cuerpoCentral as Estrella;
            // Hotter/more aggressive stars increase the chance of volcanic/desert planets.
            switch(estrella.tipoBase) {
                case 'roja_marcial':
                case 'gigante_roja':
                    pesosTipoPlaneta.find(p => p.tipo === 'VOLCANICO')!.peso += 3;
                    pesosTipoPlaneta.find(p => p.tipo === 'DESERTICO')!.peso += 2;
                    break;
                case 'azul_abisal':
                    pesosTipoPlaneta.find(p => p.tipo === 'ACUATICO')!.peso += 4;
                    break;
                case 'verde_clorofotica':
                    pesosTipoPlaneta.find(p => p.tipo === 'JUNGLA')!.peso += 4;
                    break;
            }
        }
        tipoPlaneta = weightedPick(pesosTipoPlaneta).tipo;
        const mapaTitulos: Record<TipoPlaneta, string> = {
            DESERTICO: "Planeta Desértico", JUNGLA: "Planeta Selvático",
            VOLCANICO: "Planeta Volcánico", ACUATICO: "Planeta Acuático",
            GIGANTE_GASEOSO: "Gigante Gaseoso",
        };
        titulo = mapaTitulos[tipoPlaneta];
    }
    
    // Select a few compatible biomes for the planet.
    const biomas: Bioma[] = [];
    const distribucionBiomas: DistribucionBioma[] = [];

    if (tipoPlaneta !== 'GIGANTE_GASEOSO') {
        const categoriasPorTipoPlaneta: Record<TipoPlaneta, CategoriaBiome[]> = {
            DESERTICO: ['DESIERTO', 'MONTAÑA', 'ACANTILADO'],
            JUNGLA: ['JUNGLA', 'BOSQUE', 'PANTANO'],
            VOLCANICO: ['VOLCANICO', 'MONTAÑA', 'INOSPITO'],
            ACUATICO: ['LECHO_MARINO', 'PLAYA', 'ACANTILADO', 'OCEANO_ABIERTO', 'SUBTERRANEO'],
            GIGANTE_GASEOSO: [],
        };
  
        const categoriasPosibles = categoriasPorTipoPlaneta[tipoPlaneta] || [];
        const biomasDisponibles = TODOS_BIOMAS.filter(b => categoriasPosibles.includes(b.categoria));
        
        if (biomasDisponibles.length > 0) {
             const numBiomas = randInt(1, Math.min(3, biomasDisponibles.length));
        
             const biomasSeleccionados = new Set<Bioma>();
             const biomasDisponiblesCopia = [...biomasDisponibles];
       
             while (biomasSeleccionados.size < numBiomas && biomasDisponiblesCopia.length > 0) {
                 const biomaElegido = pick(biomasDisponiblesCopia);
                 biomasSeleccionados.add(biomaElegido);
                 const index = biomasDisponiblesCopia.indexOf(biomaElegido);
                 if (index > -1) {
                   biomasDisponiblesCopia.splice(index, 1);
                 }
             }
             biomas.push(...Array.from(biomasSeleccionados));
        }

        // Assign coverage percentages for each selected biome.
        if (biomas.length > 0) {
            let remainingCoverage = 1.0;
            for (let i = 0; i < biomas.length - 1; i++) {
                const coverage = roundTo(randRange(0.1, remainingCoverage * 0.7), 2);
                distribucionBiomas.push({ biomeId: biomas[i].id, coverage });
                remainingCoverage -= coverage;
            }
            distribucionBiomas.push({ biomeId: biomas[biomas.length - 1].id, coverage: roundTo(remainingCoverage, 2) });
        }
    }

    // Generate Ecosystem based on the PRIMARY biome
    let ecosistema: Ecosistema | undefined = undefined;
    if (biomas.length > 0) {
        // We use the most dominant biome for the main ecosystem generation for simplicity
        const mainBiome = biomas[0]; 
        ecosistema = await generarEcosistema(mainBiome);
    }

    // Generate crystals based on the parent star's crystal probabilities.
    let cristalesPlaneta: Cristal[] | null = [];
    if (tipoPlaneta !== "GIGANTE_GASEOSO" && cuerpoCentral.tipo === 'ESTRELLA') {
        const estrella = cuerpoCentral as Estrella;
        const pesosCristales = [
            { tipo: 'FUEGO', peso: probToWeight(estrella.cristales.fuego) },
            { tipo: 'HIELO', peso: probToWeight(estrella.cristales.hielo) },
            { tipo: 'ELECTRICO', peso: probToWeight(estrella.cristales.electrico) },
            { tipo: 'GRAVEDAD', peso: probToWeight(estrella.cristales.gravedad) },
            { tipo: 'LUZ', peso: probToWeight(estrella.cristales.luz) },
            { tipo: 'RADIOACTIVO', peso: probToWeight(estrella.cristales.radioactivo) },
            { tipo: 'MAGICO', peso: probToWeight(estrella.cristales.magico) },
        ].filter(c => c.peso > 0);

        const numCristales = randInt(1, 3);
        
        // SAFETY CHECK: Only pick if there are crystals to pick from
        if (pesosCristales.length > 0) {
            for (let i = 0; i < numCristales && pesosCristales.length > 0; i++) {
                const tipoCristalElegido = weightedPick(pesosCristales);
                if (tipoCristalElegido && tipoCristalElegido.tipo) {
                     cristalesPlaneta.push({
                        tipo: tipoCristalElegido.tipo as TipoCristal,
                        pureza: roundTo(randRange(0.2, 0.9), 2),
                    });
                    const index = pesosCristales.findIndex(c => c.tipo === tipoCristalElegido.tipo);
                    if (index > -1) pesosCristales.splice(index, 1);
                }
            }
        }
    } else {
        cristalesPlaneta = null;
    }
    
    // Generate random global composition (rock, metal, ice).
    let r = Math.random(), m = Math.random(), i = Math.random();
    const sum = r + m + i;
    const roca = roundTo(r / sum, 2);
    const metal = roundTo(m / sum, 2);
    const hielo = roundTo(1 - roca - metal, 2);

    // Approximate temperature and humidity based on distance.
    const baseTemp = esGiganteGaseoso ? -150 : (500 / Math.max(0.5, a_UA)) - 150;
    const baseHum = esGiganteGaseoso ? 0 : Math.max(0, 1 - a_UA / 2);

    const cargaUtil: CargaUtilPlaneta = {
        tipoPlaneta: tipoPlaneta,
        tituloTipoPlaneta: titulo,
        subOrbitas: [],
        biomas: biomas,
        ecosistema: ecosistema, // Assign the generated food web
        cristales: cristalesPlaneta,
        atmosfera: { composicion: esGiganteGaseoso ? "Hidrógeno, Helio" : "desconocida" },
        composicionGlobal: { roca, metal, hielo },
        tags: [],
        gravedad: pick<NivelRelativo>(['low', 'medium', 'high']),
        presion: pick<NivelRelativo>(['low', 'medium', 'high']),
        tipoAtmosfera: esGiganteGaseoso ? 'toxic' : pick(['breathable', 'toxic', 'none']),
        rangoTemperaturaC: [roundTo(baseTemp - 20, 0), roundTo(baseTemp + 20, 0)],
        rangoHumedad: [roundTo(Math.max(0, baseHum - 0.1), 2), roundTo(Math.min(1, baseHum + 0.1), 2)],
        distribucionBiomas: distribucionBiomas,
        peligrosPlanetarios: [],
        densidadVida: esGiganteGaseoso || biomas.length === 0 ? 'none' : pick(['low', 'medium', 'high']),
    };
    
    cargaUtil.subOrbitas = generarSubOrbitas(cargaUtil, TODOS_BIOMAS);
    return cargaUtil;
};

/** Generates the payload for an asteroid belt. */
const generarCargaUtilCinturonAsteroides = (): CargaUtilCinturonAsteroides => {
    return {
        composicion: pick(['rocoso', 'helado', 'metalico']),
        densidad: pick(['disperso', 'moderado', 'denso']),
    };
};

// --- GENERACIÓN DE CUERPOS PRINCIPALES ---

/**
 * Generates a star by picking a type from the star table and filling in its data.
 * @returns A complete Estrella object.
 */
const generarEstrella = (): Estrella => {
  const tipoEstrellaKey = weightedPick(Object.values(TABLA_ESTRELLAS)).tipoBase as TipoEstrella;
  const datosEstrella = TABLA_ESTRELLAS[tipoEstrellaKey];
  const idEstrella = id('ESTRELLA');

  return {
    id: idEstrella,
    ...crearMetadatosBase(idEstrella),
    tipo: "ESTRELLA",
    nombreProvisional: nombrarEstrella(),
    ...datosEstrella,
  };
};

/**
 * Generates a special central body, like a black hole or pulsar.
 * @param tipo The type of special body to generate.
 * @returns A complete CuerpoEspecial object.
 */
const generarCuerpoEspecial = (tipo: "AGUJERO_NEGRO" | "PULSAR"): CuerpoEspecial => {
    let camposEspecificos: Partial<CuerpoEspecial> = {};
    let nombre = '';
    const idCuerpo = id(tipo);

    switch (tipo) {
        case "AGUJERO_NEGRO":
            nombre = `Cygnus ${idCuerpo.split('-')[1].toUpperCase()}`;
            const pBh = CONFIG_CUERPO_CENTRAL.parametrosCuerpoEspecial.AGUJERO_NEGRO;
            camposEspecificos = {
                masaMs: roundTo(randRange(pBh.masaMs.min, pBh.masaMs.max), 2),
                spin: roundTo(randRange(pBh.spin.min, pBh.spin.max), 3),
                peligros: ['Horizonte de sucesos mortal', 'Espaguetización', 'Radiación de Hawking'],
                atractivosSistema: ['Acceso a Orbes de Distorsión para motores de salto', 'Fuente de Cristales de Distorsión (Dantesita)', 'Investigación de física extrema'],
            };
            break;
        case "PULSAR":
            nombre = `PSR ${idCuerpo.split('-')[1].toUpperCase()}`;
            const pP = CONFIG_CUERPO_CENTRAL.parametrosCuerpoEspecial.PULSAR;
            camposEspecificos = {
                periodoSpinMs: roundTo(randRange(pP.periodoSpinMs.min, pP.periodoSpinMs.max), 4),
                campoMagneticoT: roundTo(randRange(pP.campoMagneticoT.min, pP.campoMagneticoT.max), 0),
            };
            break;
    }

    return {
        id: idCuerpo,
        ...crearMetadatosBase(idCuerpo),
        tipo,
        nombre,
        descripcion: `Un ${tipo.replace('_', ' ')} con características anómalas.`,
        tags: ['anomalia', 'peligroso'],
        ...camposEspecificos
    };
};

// --- GENERACIÓN DE ÓRBITAS Y SISTEMA ---

/**
 * Generates all the orbits and their contents for a given central body.
 * @param cuerpoCentral The star or special body at the system's center.
 * @returns A promise that resolves to an array of Orbita objects.
 */
const generarOrbitas = async (cuerpoCentral: Estrella | CuerpoEspecial): Promise<Orbita[]> => {
    // The number of orbits depends on the star's properties.
    let numOrbitas = 0;
    if (cuerpoCentral.tipo === 'ESTRELLA') {
        const [min, max] = cuerpoCentral.tipoSistema.numPlanetasEstimado;
        numOrbitas = randInt(min, max);
    } else {
        numOrbitas = randInt(0, CONFIG_ORBITA.numOrbitas.max - 2);
    }
    
    if (numOrbitas === 0) return [];
    
    // Calcular distancia mínima segura basada en el radio físico de la estrella
    let radioSeguridadAU = 0.05; // Default para cuerpos no estelares
    
    // ADJUSTMENT: Increase orbit distance for Black Holes to clear visual model
    if (cuerpoCentral.tipo === 'AGUJERO_NEGRO') {
         radioSeguridadAU = 1.5; // 1.5 AU minimum to clear the accretion disk
    } else if (cuerpoCentral.tipo === 'ESTRELLA') {
         radioSeguridadAU = cuerpoCentral.radioSolar * RADIO_SOLAR_A_UA * MARGEN_SEGURIDAD_ESTELAR;
    }

    const esEstrellaJoven = cuerpoCentral.tipo === 'ESTRELLA' && cuerpoCentral.edadEstelar === 'joven';
    const orbitas: Orbita[] = [];
    const config = CONFIG_ORBITA.paramsPorCuerpo[cuerpoCentral.tipo] || CONFIG_ORBITA.paramsPorCuerpo.ESTRELLA;
    
    // Override config for Black Holes specifically to push orbits out
    if(cuerpoCentral.tipo === 'AGUJERO_NEGRO') {
        config.a0_UA = { min: 1.5, max: 2.5 }; 
    }

    let ultimo_a = 0;

    for (let i = 0; i < numOrbitas; i++) {
        let a_UA: number;
        // Calculate orbital distance using a Titius-Bode-like progression.
        if (i === 0) {
            a_UA = randRange(config.a0_UA.min, config.a0_UA.max);
            // Ensure orbit is outside the body's physical/visual radius
            if (a_UA < radioSeguridadAU) {
                a_UA = radioSeguridadAU + randRange(0.1, 0.3);
            }
        } else {
            a_UA = ultimo_a * randRange(config.k_espaciado.min, config.k_espaciado.max);
        }
        ultimo_a = a_UA;

        // Decide if the orbit contains a planet or an asteroid belt.
        let objetoOrbital: ObjetoOrbital;
        const esCinturonAsteroides = esEstrellaJoven || Math.random() < 0.15;

        if (esCinturonAsteroides) {
            const idCA = id('CA');
            objetoOrbital = {
                id: idCA,
                ...crearMetadatosBase(idCA),
                tipo: 'CINTURON_ASTEROIDES',
                cargaUtil: generarCargaUtilCinturonAsteroides(),
            };
        } else {
            const idPL = id('PL');
            objetoOrbital = {
                id: idPL,
                ...crearMetadatosBase(idPL),
                tipo: 'PLANETA',
                cargaUtil: await generarCargaUtilPlaneta(cuerpoCentral, a_UA),
            };
        }
        
        // Assemble the final orbit object with Keplerian elements.
        const idOrbita = id('ORB');
        const orbita: Orbita = {
            id: idOrbita,
            ...crearMetadatosBase(idOrbita),
            indiceOrbita: i + 1,
            a_UA: roundTo(a_UA, 3),
            e: roundTo(randRange(CONFIG_ORBITA.general.e.min, CONFIG_ORBITA.general.e.max), 3),
            i_deg: roundTo(randRange(config.i_deg.min, config.i_deg.max), 2),
            omega_deg: roundTo(randRange(CONFIG_ORBITA.general.omega_deg.min, CONFIG_ORBITA.general.omega_deg.max), 1),
            Omega_deg: roundTo(randRange(CONFIG_ORBITA.general.Omega_deg.min, CONFIG_ORBITA.general.Omega_deg.max), 1),
            M0_deg: roundTo(randRange(CONFIG_ORBITA.general.M0_deg.min, CONFIG_ORBITA.general.M0_deg.max), 1),
            objetos: [objetoOrbital],
            idPadre: cuerpoCentral.id,
            tipoOrbita: 'PLANETA', // Simplification, could be more complex
            enZonaHabitable: a_UA > 0.8 && a_UA < 1.5, // Simple "Goldilocks zone" check
        };
        orbitas.push(orbita);
    }
    return orbitas;
};

/**
 * The main entry point for the generation service. Creates a complete, random star system.
 * @param options Configuration options for generation, e.g., forcing a specific central body type.
 * @returns A promise that resolves to a fully populated Sistema object.
 */
export const generateSystem = async (options: { centralBody?: TipoCuerpoCentral | 'Any' } = {}): Promise<Sistema> => {
  const { centralBody = 'Any' } = options;
  let tipoCuerpoCentral: TipoCuerpoCentral;

  // Determine the central body type based on options or weighted probability.
  if (centralBody !== 'Any' && centralBody) {
    tipoCuerpoCentral = centralBody;
  } else {
    tipoCuerpoCentral = weightedPick(CONFIG_CUERPO_CENTRAL.probabilidades).tipo;
  }
  
  // Generate the central body.
  let cuerpoCentral: Estrella | CuerpoEspecial;
  if (tipoCuerpoCentral === 'ESTRELLA') {
    cuerpoCentral = generarEstrella();
  } else {
    cuerpoCentral = generarCuerpoEspecial(tipoCuerpoCentral as "AGUJERO_NEGRO" | "PULSAR");
  }
  
  // Generate its orbits.
  const orbitas = await generarOrbitas(cuerpoCentral);
  const idSistema = id('SYS');

  const nombreSistema = cuerpoCentral.tipo === 'ESTRELLA' 
    ? (cuerpoCentral as Estrella).nombreProvisional 
    : (cuerpoCentral as CuerpoEspecial).nombre;

  // Assemble the final system object.
  return {
    id: idSistema,
    ...crearMetadatosBase(idSistema),
    nombre: nombreSistema,
    cuerpoCentral,
    orbitas,
    tipoSistema: cuerpoCentral.tipo === 'ESTRELLA' ? 'ESTRELLA' : 'AGUJERO_NEGRO', // Simplification
    semilla: Math.random().toString(36).substring(2, 11),
    nivelPeligro: randInt(1, 10),
    presenciaFaccion: [], // To be implemented in a future phase.
  };
};