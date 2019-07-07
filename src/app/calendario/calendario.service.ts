
import {Observable } from 'rxjs';

import { map, tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  CalendarEvent
} from 'angular-calendar';
import {
  subDays, subMonths, subWeeks,
  addDays, addMonths, addWeeks,
  format,
  setHours, setMinutes,
  startOfMonth, startOfWeek,
  endOfMonth, endOfWeek,
  getHours
} from 'date-fns';

import { AppService } from '../app.service';
import { User } from '../user/user.model';

import { Cita } from '../api/cita.model';
import {ApiService} from '../api/api.service';

const colors: any = {
  white: {
    primary: 'white',
    secondary: 'white'
  },
  red: {
    primary: '#ef5350',
    secondary: '#ef5350'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#8BC34A',
    secondary: '#8BC34A'
  }
};

@Injectable()
export class CalendarioService {
  currentUser: User;
  horario: any = [[9, 14], [16, 20]];
  fines_de_semana = false;

  constructor(
    private appService: AppService,
    private apiService: ApiService
  ) {}

  checkHorario(date: Date): boolean {
    const h = +getHours(date);
    return h >= +this.horario[0][0] && h <= +this.horario[0][1] || h >= +this.horario[1][0] && h <= +this.horario[1][1];
  }

  getCitasUrl( date: Date, view: string, salaId: string= '-1') {
    let desde, hasta;
    switch (view) {
      case 'month':
        desde = format(startOfMonth(date), 'YYYY-M-D');
        hasta = format(endOfMonth(date), 'YYYY-M-D');
        break;
      case 'week':
        desde = format(startOfWeek(date), 'YYYY-M-D');
        hasta = format(endOfWeek(date), 'YYYY-M-D');
        break;
      case 'day':
        desde = format(date, 'YYYY-M-D');
        hasta = format(date, 'YYYY-M-D');
        break;
      case 'agenda':
        desde = format(startOfMonth(date), 'YYYY-M-D');
        hasta = format(endOfMonth(date), 'YYYY-M-D');
        break;
    }
    let url = '/citas.json?desde='
      + desde
      + '&hasta='
      + hasta;

    if (!!salaId) {
      url += '&sala_id=' + salaId;
    }
    return url;
  }
  events$( url: string, user: User ): Observable<CalendarEvent<Cita>[]> {
    const onDeleteEvent = ({ event }: { event: CalendarEvent }): void => {
      this.apiService.deleteCita$(event.meta).subscribe(r => {});
    };

    return this.appService.apiGet( url ).pipe(
      map(resp => {
        if (resp.success) {
          const citas = resp.data;

          return citas.map((cita: Cita) => {
            cita.inicio = ('' + cita.inicio).replace(/\s/g, 'T');
            cita.fin = ('' + cita.fin).replace(/\s/g, 'T');
            if (cita.inicio.indexOf('+') <= 0) {// FIXME support several timezones??
              cita.inicio += '+02:00';
            }
            if (cita.fin.indexOf('+') <= 0) {
              cita.fin += '+02:00';
            }

            if (!user || user.rol === 'paciente') {
              if (user && user.id === cita.paciente_id) {
                return {
                  id: Math.random(),
                  title: 'Tú',
                  start: typeof cita.inicio === 'string' ? new Date(cita.inicio) : cita.inicio,
                  end: typeof cita.fin === 'string' ? new Date(cita.fin) : cita.fin,
                  color: this.colors.green,
                  draggable: true,
                  meta: cita
                };
              } else {
                return {
                  title: 'Reservado',
                  start: typeof cita.inicio === 'string' ? new Date(cita.inicio) : cita.inicio,
                  end: typeof cita.fin === 'string' ? new Date(cita.fin) : cita.fin,
                  color: this.colors.red,
                  draggable: false,
                  meta: cita
                };
              }
            } else {
              return {
                title: cita.paciente ? cita.paciente.nombre : cita.paciente_id,
                start: typeof cita.inicio === 'string' ? new Date(cita.inicio) : cita.inicio,
                end: typeof cita.fin === 'string' ? new Date(cita.fin) : cita.fin,
                color: this.colors.yellow,
                draggable: true,
                meta: cita
              };
            }
          });
        }
      }));
  }

  public get colors(): any { return colors; }

    public get viewOptions(): any {
        const todayFn = _ => new Date();
        return {
            month: {
                previousFn: subMonths,
                todayFn,
                nextFn: addMonths,
                format: 'YYYY-M'
            },
            week: {
                previousFn: subWeeks,
                todayFn,
                nextFn: addWeeks,
                format: 'YYYY-W'
            },
            day: {
                previousFn: subDays,
                todayFn,
                nextFn: addDays,
                format: 'YYYY-M-D'
            },
            agenda: {
                previousFn: subMonths,
                todayFn,
                nextFn: addMonths,
                format: 'YYYY-M'
            }
        };
    }

  public formatDateTime(date: Date) {
    return format(date, 'YYYY-M-D H:mm');
  }

  public parse(date, time) {
    const t = time.split(':');
    let d = new Date(date);
    d = setHours(d, t[0]);
    d = setMinutes(d, t[1]);
    return this.formatDateTime(d);
  }

  public get times(): string[] {
    return ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
            '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00',
            '19:30', '20:00', '20:30', '21:00'];
  }
}
