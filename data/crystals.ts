
import { ArquetipoCristal } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 2, fechaCreacion: now, fechaActualizacion: now };
const recursoBaseComun = { rareza: 'common' as const, tier: 1, valorBase: 20, spawn: {} };
const recursoBasePocoComun = { rareza: 'uncommon' as const, tier: 2, valorBase: 50, spawn: {} };
const recursoBaseRaro = { rareza: 'rare' as const, tier: 3, valorBase: 150, spawn: {} };
const recursoBaseEpico = { rareza: 'epic' as const, tier: 4, valorBase: 400, spawn: {} };
const fase3Default = { elemento: 'NEUTRAL' as const, potenciaBase: 10, escalado: 'LINEAR' as const, tiposArmaCompatibles: [], tiposHerramientaCompatibles: [] };

export const ALL_CRYSTALS: ArquetipoCristal[] = [
    // --- CRISTALES ELEMENTALES BÁSICOS ---
    { 
        ...base, ...recursoBaseComun, ...fase3Default, 
        elemento: 'FIRE', 
        id: "c_ignis", 
        nombre: "Piroclasto Vivo", 
        descripcion: "Una formación cristalina que vibra termalmente. No es fuego real, sino una reacción exotérmica perpetua atrapada en una red de silicato.", 
        tipoCristal: "FUEGO", 
        tags:['volcanico', 'combustible'] 
    },
    { 
        ...base, ...recursoBaseComun, ...fase3Default, 
        elemento: 'ICE', 
        id: "c_crio", 
        nombre: "Crio-Cuarzo", 
        descripcion: "Cristal con estructura de red endotérmica. Absorbe calor activamente del entorno, provocando quemaduras por frío al tacto.", 
        tipoCristal: "HIELO", 
        tags:['tundra', 'refrigerante'] 
    },
    { 
        ...base, ...recursoBaseComun, ...fase3Default, 
        elemento: 'ELECTRIC', 
        id: "c_volta", 
        nombre: "Fulgurita Activa", 
        descripcion: "Formado por impactos de rayos en atmósferas ricas en sílice. Mantiene una carga estática capaz de alimentar circuitos simples.", 
        tipoCristal: "ELECTRICO", 
        tags:['energia', 'tormenta'] 
    },
    
    // --- CRISTALES AVANZADOS ---
    { 
        ...base, ...recursoBasePocoComun, ...fase3Default, 
        elemento: 'GRAVITY', 
        id: "c_grav", 
        nombre: "Gravitonita Bruta", 
        descripcion: "Un mineral extremadamente denso que distorsiona la luz a su alrededor. Se utiliza en estabilizadores de naves.", 
        tipoCristal: "GRAVEDAD", 
        tags:['pesado', 'espacio'] 
    },
    { 
        ...base, ...recursoBaseComun, ...fase3Default, 
        id: "c_lumen", 
        nombre: "Prisma Fotónico", 
        descripcion: "Estructura cristalina perfecta que amplifica cualquier fuente de luz que la atraviesa. Usado en óptica láser.", 
        tipoCristal: "LUZ", 
        tags:['optica', 'laser'] 
    },
    { 
        ...base, ...recursoBasePocoComun, ...fase3Default, 
        id: "c_nuc", 
        nombre: "Uranita Cristalizada", 
        descripcion: "Isótopos inestables atrapados en una matriz de vidrio natural. Brilla con un verde enfermizo.", 
        tipoCristal: "RADIOACTIVO", 
        tags:['peligroso', 'reactor'] 
    },
    
    // --- ENTIDADES FIJAS (PROTECTED) ---
    { 
        ...base, ...recursoBaseRaro, ...fase3Default, 
        elemento: 'GRAVITY', 
        id: "c_dantesita", // ID PROTEGIDO
        nombre: "Cristal de Distorsión (Dantesita)", // NOMBRE PROTEGIDO
        descripcion: "Un cristal negro opaco encontrado exclusivamente en las cercanías de agujeros negros. Absorbe la luz y deforma el espacio a su alrededor. Es un componente clave en tecnologías gravitacionales.", 
        tipoCristal: "GRAVEDAD", 
        tags: ["BLACK_HOLE", "PROTECTED", "ENDGAME"] 
    },

    // --- CRISTALES EXÓTICOS ---
    { 
        ...base, ...recursoBaseRaro, ...fase3Default, 
        id: "c_eter", 
        nombre: "Resonancia de Éter", 
        descripcion: "Materia física que parece vibrar en una frecuencia dimensional diferente. Permite manipular la realidad localmente.", 
        tipoCristal: "MAGICO", 
        tags:['dimensional', 'psiquico'] 
    },
    { 
        ...base, ...recursoBaseEpico, ...fase3Default, 
        id: "c_orbe_distorsion", 
        nombre: "Orbe de Singularidad", 
        descripcion: "Esferas negras perfectas. Técnicamente no son materia, sino un punto de espacio-tiempo colapsado y estabilizado.", 
        tipoCristal: "MAGICO", 
        tags: ["BLACK_HOLE", "LEGENDARY"] 
    },
];
