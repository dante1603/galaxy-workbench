import { Efecto } from '../types';

const now = new Date().toISOString();
const base = { estado: 'aprobado' as const, version: 1, fechaCreacion: now, fechaActualizacion: now };
// FIX: Explicitly type `aplicaA` to match the `Efecto` interface, as TypeScript infers it as a generic string array otherwise.
const fase5Default = { duracion: 5, magnitud: 1, maxAcumulaciones: 1, aplicaA: ['jugador', 'fauna'] as ('jugador' | 'fauna')[] };

export const ALL_EFFECTS: Efecto[] = [
  // --- DEBUFFS (Efectos Negativos) ---
  {
    ...base,
    ...fase5Default,
    id: 'effect_quemadura',
    nombre: 'Quemadura',
    descripcion: 'El fuego inflige daño continuo y reduce la efectividad de la curación.',
    tipoEfecto: 'DEBUFF',
    tags: ['daño_elemental', 'fuego', 'dot'],
    mecanicasGameplay: ['Inflige 1-3 de daño por fuego cada segundo.', 'Reduce la curación recibida en un 25%.']
  },
  {
    ...base,
    ...fase5Default,
    id: 'effect_sobrecalentamiento',
    nombre: 'Sobrecalentamiento',
    descripcion: 'El calor extremo agota la resistencia y puede causar daño directo.',
    tipoEfecto: 'DEBUFF',
    tags: ['ambiental', 'calor'],
    mecanicasGameplay: ['Aumenta el consumo de aguante en un 50%.', 'Si se acumula, inflige daño por calor directo.']
  },
  {
    ...base,
    ...fase5Default,
    id: 'effect_envenenamiento',
    nombre: 'Envenenamiento',
    descripcion: 'Una toxina que causa daño progresivo en el tiempo.',
    tipoEfecto: 'DEBUFF',
    tags: ['toxina', 'dot'],
    mecanicasGameplay: ['Inflige 2 de daño por veneno cada 2 segundos, ignorando parte de la armadura.']
  },
  {
    ...base,
    ...fase5Default,
    id: 'effect_paralisis',
    nombre: 'Parálisis',
    descripcion: 'Una descarga eléctrica que entumece los músculos, reduciendo drásticamente la movilidad y la velocidad de acción.',
    tipoEfecto: 'DEBUFF',
    tags: ['daño_elemental', 'electrico', 'control'],
    mecanicasGameplay: ['Reduce la velocidad de movimiento y ataque en un 50%.', 'Impide esquivar.']
  },
  {
    ...base,
    ...fase5Default,
    id: 'effect_irradiado',
    nombre: 'Irradiado',
    descripcion: 'La exposición a la radiación daña las células, reduciendo la salud máxima y causando un deterioro lento.',
    tipoEfecto: 'DEBUFF',
    tags: ['radiacion', 'dot', 'corrupcion'],
    mecanicasGameplay: ['Reduce la salud máxima en un 10% por acumulación.', 'Inflige daño radioactivo leve y constante.']
  },
  {
    ...base,
    ...fase5Default,
    id: 'effect_confusion',
    nombre: 'Confusión',
    descripcion: 'Un asalto psíquico o una toxina alucinógena que altera la percepción. Afecta la cordura.',
    tipoEfecto: 'DEBUFF',
    tags: ['psiquico', 'control'],
    mecanicasGameplay: ['Invierte los controles de movimiento temporalmente.', 'Puede causar que se vean enemigos falsos.']
  },
  {
    ...base,
    ...fase5Default,
    id: 'effect_ceguera',
    nombre: 'Ceguera',
    descripcion: 'La visión se ve severamente limitada por humo, esporas o un destello de luz.',
    tipoEfecto: 'DEBUFF',
    tags: ['sensorial', 'control'],
    mecanicasGameplay: ['Reduce el radio de visión a unos pocos metros.', 'Oculta la interfaz de usuario.']
  },
  {
    ...base,
    ...fase5Default,
    id: 'effect_congelacion',
    nombre: 'Congelación',
    descripcion: 'El frío intenso ralentiza todas las acciones y consume aguante más rápidamente para mantener el calor corporal.',
    tipoEfecto: 'DEBUFF',
    tags: ['daño_elemental', 'hielo', 'control'],
    mecanicasGameplay: ['Reduce la velocidad de movimiento en un 30%.', 'Aumenta el consumo pasivo de aguante.']
  },

  // --- BUFFS (Efectos Positivos) ---
  {
    ...base,
    ...fase5Default,
    id: 'effect_regeneracion',
    nombre: 'Regeneración',
    descripcion: 'Acelera el proceso de curación natural, restaurando la salud con el tiempo.',
    tipoEfecto: 'BUFF',
    tags: ['curacion', 'supervivencia'],
    mecanicasGameplay: ['Restaura 2-5 de salud por segundo.']
  },
  {
    ...base,
    ...fase5Default,
    id: 'effect_vigorizado',
    nombre: 'Vigorizado',
    descripcion: 'Una oleada de energía que mejora la recuperación de aguante.',
    tipoEfecto: 'BUFF',
    tags: ['aguante', 'mejora'],
    mecanicasGameplay: ['Aumenta la velocidad de regeneración de aguante en un 100%.']
  },
  {
    ...base,
    ...fase5Default,
    id: 'effect_piel_piedra',
    nombre: 'Piel de Piedra',
    descripcion: 'Endurece la piel o la armadura, aumentando la resistencia al daño físico.',
    tipoEfecto: 'BUFF',
    tags: ['defensa', 'mejora'],
    mecanicasGameplay: ['Aumenta la defensa en 20 puntos.', 'Reduce el daño físico recibido en un 15%.']
  },
  {
    ...base,
    ...fase5Default,
    id: 'effect_celeridad',
    nombre: 'Celeridad',
    descripcion: 'Aumenta la velocidad de movimiento y acción, permitiendo actuar con mayor rapidez.',
    tipoEfecto: 'BUFF',
    tags: ['velocidad', 'mejora'],
    mecanicasGameplay: ['Aumenta la velocidad de movimiento y ataque en un 25%.']
  },
];