import { Herramienta } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 1, fechaCreacion: now, fechaActualizacion: now };
// FIX: Explicitly type `objetivosPermitidos` to match the `EquipoBase` interface, as TypeScript infers it as a generic string array otherwise.
const equipoBaseDefault = { tier: 1, rareza: 'common' as const, tiposCristalCompatibles: [], idPatronAtaque: null, objetivosPermitidos: ['recursos'] as ('fauna' | 'jugador' | 'recursos')[] };

export const ALL_TOOLS: Herramienta[] = [
  {
    ...base,
    ...equipoBaseDefault,
    id: 't_pico_hierro',
    nombre: 'Pico de Hierro',
    descripcion: 'Una herramienta robusta para extraer minerales de las rocas.',
    tags: ['herramienta', 'mineria', 'basico'],
    tipoHerramienta: 'pico',
    eficiencia: 1.0,
    durabilidad: 100,
  },
  {
    ...base,
    ...equipoBaseDefault,
    id: 't_hacha_hierro',
    nombre: 'Hacha de Hierro',
    descripcion: 'Una herramienta afilada para talar árboles y obtener madera.',
    tags: ['herramienta', 'tala', 'basico'],
    tipoHerramienta: 'hacha_tala',
    eficiencia: 1.0,
    durabilidad: 100,
  },
  {
    ...base,
    ...equipoBaseDefault,
    id: 't_pala_hierro',
    nombre: 'Pala de Hierro',
    descripcion: 'Una herramienta para cavar en tierra blanda o arena.',
    tags: ['herramienta', 'excavacion', 'basico'],
    tipoHerramienta: 'pala',
    eficiencia: 1.0,
    durabilidad: 100,
  }
];