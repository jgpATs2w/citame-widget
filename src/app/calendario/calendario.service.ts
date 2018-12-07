
import {timer as observableTimer,  Observable, Subscription, Subject } from 'rxjs';

import {delay, first, pluck, switchMap, map, filter, tap} from 'rxjs/operators';
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
  endOfMonth, endOfWeek,
  getHours
} from 'date-fns';

import { Http, Response } from '@angular/http';

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
  citas$: Observable<Cita[]>;
  citasFromServer$: Observable<Cita[]>;
  citasSubscription: Subscription;
  currentUser: User;
  horario:any= [[9,14], [16,20]];
  refreshCalendar: Subject<any> = new Subject();
  fines_de_semana:boolean= false;

  constructor(
    private ngRedux: NgRedux<AppState>,
    public actions: CalendarioActions,
    private appService: AppService,
    private userService: UserService
  ) {

    this.citas$= ngRedux
                    .select<CalendarioState>('calendario').pipe(
                    map(state=>state.citas),
                    filter((citas:Cita[])=>typeof citas==="object"),);

    this.citasFromServer$ = appService.apiGet('/citas.json?').pipe(pluck('data'));
  }

  setupRefresh(refresh){this.refreshCalendar=refresh;};

  citasFromServerForPaciente$(paciente_id):Observable<Cita[]>{
    return this.appService.apiGet('/citas.json?paciente_id='+paciente_id).pipe(pluck('data'));
  }
  readServer(date: Date, view: string, salaId: string='-1' ){
    const url= this.getCitasUrl(date, view, salaId);
    this.appService.apiGet( url ).pipe(pluck('data'),first(),).subscribe((citas:Cita[])=>this.actions.setCitas(citas));
    return this.readHorario();
  }
  startCitasLoop( date: Date, view: string, salaId: string ){
    if(this.citasSubscription!=null) return;
    const url= this.getCitasUrl(date, view, salaId);
    this.citasSubscription= observableTimer(500, 10000).pipe(
              switchMap(_=>this.appService.apiGet( url ).pipe(pluck('data'))),
              delay(500),)
              .subscribe((citas:Cita[])=>this.actions.setCitas(citas));
  }
  stopCitasLoop(){
    if(this.citasSubscription)
      this.citasSubscription.unsubscribe();
  }

  readHorario(){
    this.appService.apiGet( '/clinicas/'+this.appService.clinicaId +'.json').pipe(
      pluck('data'),
      first(),)
      .subscribe((clinica:any)=>{
        const h1= clinica.horario.split(',');
        this.horario[0]= h1[0].split('-');
        if(!!h1[1])
          this.horario[1]= h1[1].split('-');
        this.fines_de_semana= clinica.fines_de_semana;
      });
  }
  checkHorario(date: Date): boolean{
    const h= +getHours(date);
    return h>=+this.horario[0][0] && h<=+this.horario[0][1] || h>=+this.horario[1][0]&&h<=+this.horario[1][1];
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


  deleteCita(cita: Cita){
    const eliminador_id= this.appService.current_id;
    return this.appService
                      .apiDelete(`/citas/${cita.id}?eliminador_id=${eliminador_id}&aviso`).pipe(
                      tap(r=>{
                        if(r.success)
                          this.actions.deleteCita(cita);
                        else
                          this.appService.snack(r.message);
                      }))
  }

  updateCita( cita: Cita ){
    return this.appService
                      .apiPost("/citas/"+cita.id, cita).pipe(
                      tap(r=>{
                        if(r.success)
                          console.info('updated');//this.actions.updateCita(cita);
                        else
                          this.appService.snack(r.message);
                      }));
  }

  addCita( cita: Cita ){
    return this.appService
                      .apiPost("/citas?recordatorio", cita).pipe(
                      tap(r=>{
                        if(r.success)
                          this.actions.addCita(r.data);
                        else
                          this.appService.snack(r.message);
                      }));
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
        format: 'YYYY-MM'
      },
      week: {
        previousFn: subWeeks,
        todayFn: _=>{new Date()},
        nextFn: (date, n)=>addDays(date, 8),
        format: 'YYYY-WW'
      },
      day: {
        previousFn: subDays,
        todayFn: _=>{new Date()},
        nextFn: addDays,
        format: 'YYYY-MM-DD'
      }
    }
  }

  public formatDate(date: Date, view: string, previousOrNext: string= null){
    if(!!previousOrNext)
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
