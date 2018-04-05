import {User} from '../user/user.model';

import {setMinutes, addMinutes} from 'date-fns';

export interface Cita{
  id: string | number;
  paciente_id: number;
  terapeuta_id?: number;
  producto_id?: number;
  sala_id?: number;
  factura_id?: number;
  inicio: Date | string;
  fin: Date | string;

  duracion?: number;
  paciente?: User;
  terapeuta?: User;
}

const inicio= setMinutes(new Date(), 0);
export const CITA_NEW:Cita={
  id: null,
  paciente_id: null,
  terapeuta_id: null,
  inicio: inicio,
  fin: addMinutes(inicio, 90),
  paciente:{
    id: null,
    clinica_id: null,
    nombre: "Tú",
    apellidos: null,
    email: null,
    tfno: null
  }
}

//TODO adapter from server
