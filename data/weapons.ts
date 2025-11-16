import { Arma } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 1, fechaCreacion: now, fechaActualizacion: now };
// FIX: Explicitly type `objetivosPermitidos` to match the `EquipoBase` interface, as TypeScript infers it as a generic string array otherwise.
const equipoBaseDefault = { tier: 1, rareza: 'common' as const, durabilidad: 100, tiposCristalCompatibles: [], idPatronAtaque: null, objetivosPermitidos: ['fauna', 'jugador'] as ('fauna' | 'jugador' | 'recursos')[] };

export const ALL_WEAPONS: Arma[] = [
  {
    ...base,
    ...equipoBaseDefault,
    id: 'w_espada_hierro',
    nombre: 'Espada de Hierro',
    descripcion: 'Una espada básica pero fiable, forjada con hierro de duna. Buena para empezar a defenderse.',
    tags: ['arma', 'cuerpo_a_cuerpo', 'basico'],
    tipoArma: 'espada',
    dano: 10,
    velocidad: 'normal',
    alcance: 'corta',
  },
  {
    ...base,
    ...equipoBaseDefault,
    id: 'w_arco_simple',
    nombre: 'Arco Simple',
    descripcion: 'Un arco rudimentario hecho de madera flexible y fibra. Requiere habilidad pero mantiene a los enemigos a distancia.',
    tags: ['arma', 'distancia', 'basico'],
    tipoArma: 'arco',
    dano: 8,
    velocidad: 'normal',
    alcance: 'larga',
  }
];