import { Injectable } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter
} from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays, subMonths, subWeeks,
  addDays,addMonths,addWeeks,
  isSameDay,
  isSameMonth,
  addHours,
  subHours,
  addMinutes,
  format,
  setHours, setMinutes,
  startOfMonth, startOfWeek,
  endOfMonth, endOfWeek
} from 'date-fns';

import { Http, Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';

import { NgRedux, select } from '@angular-redux/store';
import { CalendarioActions } from './calendario.actions';
import { AppState, CalendarioState } from '../app.store';
import { AppService } from '../app.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

import { Cita, CITA_NEW } from '../cita/cita.model';
import { environment } from '../../environments/environment';

const colors: any = {
  white: {
    primary: 'white',
    secondary: 'white'
  },
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
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
    primary: '#0f0',
    secondary: '#0f0'
  }
};

@Injectable()
export class CalendarioService {
  citas$: Observable<Cita[]>;
  citasFromServer$: Observable<Cita[]>;
  citasSubscription: Subscription;
  currentUser: User;

  constructor(
    private ngRedux: NgRedux<AppState>,
    public actions: CalendarioActions,
    private appService: AppService,
    private userService: UserService
  ) {

    this.citas$= ngRedux
                    .select<CalendarioState>('calendario')
                    .map(state=>state.citas)
                    .filter((citas:Cita[])=>typeof citas==="object");

    this.citasFromServer$ = appService.apiGet('/citas.json?').pluck('data');
  }

  citasFromServerForPaciente$(paciente_id):Observable<Cita[]>{
    return this.appService.apiGet('/citas.json?paciente_id='+paciente_id).pluck('data');
  }
  readServer(date: Date, view: string, salaId: string='-1' ){
    const url= this.getCitasUrl(date, view, salaId);
    this.appService.apiGet( url ).pluck('data').first().subscribe((citas:Cita[])=>this.actions.setCitas(citas));
  }
  startCitasLoop( date: Date, view: string, salaId: string ){
    if(this.citasSubscription!=null) return;
    const url= this.getCitasUrl(date, view, salaId);
    this.citasSubscription= Observable.timer(500, 10000)
              .switchMap(_=>this.appService.apiGet( url ).pluck('data'))
              .delay(500)
              .subscribe((citas:Cita[])=>this.actions.setCitas(citas));
  }

  stopCitasLoop(){
    if(this.citasSubscription)
      this.citasSubscription.unsubscribe();
  }

  private getCitasUrl( date: Date, view: string, salaId: string){
    let desde, hasta;
    switch(view){
      case 'month':
        desde= format(startOfMonth(date), 'YYYY-M-D');
        hasta= format(endOfMonth(date), 'YYYY-M-D');
        break;
      case 'week':
        desde= format(startOfMonth(date), 'YYYY-M-D');
        hasta= format(endOfMonth(date), 'YYYY-M-D');
        break;
      case 'day':
        desde= format(date, 'YYYY-M-D');
        hasta= format(date, 'YYYY-M-D');
        break;
    }
    return "/citas.json?desde="
            + desde
            + "&hasta="
            + hasta;
  }

  public get events$(): Observable<any> {
    const onDeleteEvent= ({ event }: { event: CalendarEvent }): void => {
                            this.deleteCita(event.meta);
                          };

    return Observable.combineLatest(this.citas$,this.userService.currentUser$)
                  .map(([citas, user]) => {
                    return citas.map((cita: Cita) => {
                      if(!user || user.rol == 'paciente'){
                        if(user && user.id == cita.paciente_id){
                          return {
                            id: Math.random(),
                            title: 'Tú',
                            start: typeof cita.inicio == "string"? new Date(cita.inicio) : cita.inicio,
                            end: typeof cita.fin == "string"? new Date(cita.fin) : cita.fin,
                            color: colors.yellow,
                            draggable: true,
                            meta: cita,
                            actions: [
                              {},
                              {
                                label: '<i class="fa fa-fw fa-times"></i>',
                                onClick: onDeleteEvent
                              }
                            ]
                          };
                        }else{
                          return {
                            title: 'Reservado',
                            start: typeof cita.inicio == "string"? new Date(cita.inicio) : cita.inicio,
                            end: typeof cita.fin == "string"? new Date(cita.fin) : cita.fin,
                            color: colors.blue,
                            draggable: false,
                            meta: cita
                          };
                        }
                      }else{
                        return {
                          title: cita.paciente? cita.paciente.nombre: cita.paciente_id,
                          start: typeof cita.inicio == "string"? new Date(cita.inicio) : cita.inicio,
                          end: typeof cita.fin == "string"? new Date(cita.fin) : cita.fin,
                          color: colors.yellow,
                          draggable: true,
                          meta: cita,
                          actions: [
                            {},
                            {
                              label: '<i class="fa fa-fw fa-times"></i>',
                              onClick: onDeleteEvent
                            }
                          ]
                        };
                      }

                    });
                  });
  };

  deleteCita(cita: Cita){
    this.actions.deleteCita(cita);
  }

  updateCita( cita: Cita ){

    this.actions.updateCita(cita);
  }

  setCurrentCita( cita: Cita ){
    this.actions.setCurrentCita(cita);
  }

  public get colors(): any { return colors };

  public get viewOptions(): any{
    return {
      month: {
        previousFn: subMonths,
        todayFn: _=>{new Date()},
        nextFn: addMonths,
        format: 'YYYY-M'
      },
      week: {
        previousFn: subWeeks,
        todayFn: _=>{new Date()},
        nextFn: addWeeks,
        format: 'YYYY-W'
      },
      day: {
        previousFn: subDays,
        todayFn: _=>{new Date()},
        nextFn: addDays,
        format: 'YYYY-M-D'
      }
    }
  }

  public formatDate(date: Date, view: string, previousOrNext: string= null){
    if(previousOrNext)
      date= this.viewOptions[view][previousOrNext+'Fn'](date,1);
    return format(date, this.viewOptions[view].format )
  }
  public formatDateTime(date: Date){
    return format(date, 'YYYY-M-D H:mm');
  }

  public getTime(date: string): string{
    return format(date, 'HH:mm');
  }

  public parse(date, time){
    const t= time.split(':');
    let d= new Date(date);
    d= setHours(d, t[0]);
    d= setMinutes(d, t[1]);
    return this.formatDateTime(d);
  }

  public get times(): string[]{
    return ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
            '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00',
            '19:30', '20:00', '20:30', '21:00'];
  }
}
