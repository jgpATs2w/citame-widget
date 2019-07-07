import {Cita} from '../api/cita.model';

export interface User {
  id?: string | number;
  clinica_id?: number;
  nombre: string;
  apellidos?: string;
  email: string;
  tfno?: string;
  direccion?: string;
  nif?: string;
  envio_sms?: boolean;
  envio_email?: boolean;
  status?: string;
  si_paciente?: boolean;
  si_terapeuta?: boolean;
  rol?: string;
  key?: string;
  password?: string;

  citas?: Cita[];
}

export const fromFirebase = (user) => ({
  nombre: user.displayName,
  email: user.email,
  rol: 'paciente',
  apellidos: '',
  direccion: '',
  clinica_id: 1,
  tfno: ''
});
