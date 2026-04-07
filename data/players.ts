
import { Jugador } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 2, fechaCreacion: now, fechaActualizacion: now };

export const ALL_PLAYERS: Jugador[] = [
  {
    ...base,
    id: 'player_base',
    nombre: 'Simbionte Neural Alpha-1', // Nombre REAL del Jugador (El Parásito)
    descripcion: 'Un parásito consciente capaz de reescribir el sistema nervioso de formas de vida alienígenas complejas. Proyecta una interfaz táctica directamente en el córtex visual de su anfitrión.',
    tags: ['jugador', 'parasito', 'admin'],
    datosParasito: {
        nombreSimbionte: "Alpha-1",
        nivelConsciencia: 1,
        colorSimbionte: "#06b6d4", // Cyan fluorescente (Color del modelo 3D de la babosa)
        tiempoVidaTotal: 0,
        huespedesPoseidos: 0
    },
    // Stats del cuerpo "por defecto" (antes de elegir especie o aplicar modificadores)
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
    // especieId undefined indica que aún no ha parasitado un cuerpo específico permanentemente
  },
];
