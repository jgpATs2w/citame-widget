import {User} from '../user/user.model';

export interface Cita{
  id: string | number;
  paciente_id: number;
  terapeuta_id?: number;
  producto_id?: number;
  sala_id?: number;
  factura_id?: number;
  inicio: Date | string;
  fin: Date | string;

  notas?: string;
  duracion?: number;
  paciente?: User;
  terapeuta?: User;
  autor_id?: number;
  eliminador_id?: number;
  modificador_id?: number
  eliminada?: string;
  creada?: string;
  modificada?: string;
  googleUrl?: string;
}

export const CITA_NEW:Cita={
  id: null,
  paciente_id: null,
  terapeuta_id: null,
  inicio: null,
  fin: null,
  paciente:{
    id: null,
    clinica_id: null,
    nombre: "Tú",
    apellidos: null,
    email: null,
    tfno: null
  }
}
