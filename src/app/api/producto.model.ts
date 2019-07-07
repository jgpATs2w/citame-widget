import {Cita} from './cita.model';
export interface Producto{
  id: number;
  nombre: string;
  descripcion: string;
  duracion_min?: number;
  coste_hora: number;

  citas?: Cita[];
}
