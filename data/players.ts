import { Jugador } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 1, fechaCreacion: now, fechaActualizacion: now };

export const ALL_PLAYERS: Jugador[] = [
  {
    ...base,
    id: 'player_base',
    nombre: 'Jugador Arquetipo',
    descripcion: 'Esta es la plantilla base para cualquier jugador que comience su aventura. Sus estadísticas son un punto de partida equilibrado, diseñadas para ser modificadas por la especie inteligente que elijan.',
    tags: ['jugador', 'base'],
    statsBase: {
      salud: 100,
      aguante: 100,
      ataque: 10,
      defensa: 5,
      velocidadMovimiento: 5,
      capacidadCarga: 100,
      resistencias: {},
    },
    itemsInicio: [],
    // especieId se deja indefinido intencionalmente para el arquetipo base
  },
];