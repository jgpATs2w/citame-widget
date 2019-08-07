import {User} from './user/user.model';
import {Cita} from './api/cita.model';
import {Producto} from './api/producto.model';
import {Injectable} from '@angular/core';
import {CalendarEvent} from 'calendar-utils';


@Injectable()
export class AppState {
  key: string;
  authToken: string;
  user: User;
  users: User[] = [];
  paciente: User;
  terapeuta: User;
  citas: Cita[] = [];
  cita: Cita;
  productos: Producto[] = [];
  producto: Producto;
  view = 'day';
  viewDate: Date = new Date();
  events: CalendarEvent < Cita > [] = [];

 reset() {
   this.authToken = null;
   this.user = null;
   this.users = [];
   this.citas = [];
   this.productos = [];
 }

}
