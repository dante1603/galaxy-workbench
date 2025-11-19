
export type EstadoEntidad = 'borrador' | 'aprobado' | 'obsoleto';
export type NivelRelativo = "low" | "medium" | "high";

/**
 * La estructura más fundamental.
 */
export interface EntidadBase {
  id: string;
  estado: EstadoEntidad;
  version: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface EntidadJuego extends EntidadBase {
  nombre: string;
  descripcion: string;
  tags: string[];
}
