import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter
} from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,isPast,
  addHours,
  subHours,
  subDays, subMonths, subWeeks,
  addMinutes,
  addWeeks,
  addMonths,
  setMinutes,getMinutes,
  format
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { Observable,Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';
import { CustomDateFormatter } from '../../calendario/custom-date-formatter.provider';
import { CalendarioService } from '../../calendario/calendario.service';
import { Cita, CITA_NEW } from '../../cita/cita.model';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.model';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
  providers: [{
    provide: CalendarDateFormatter,
    useClass: CustomDateFormatter
  }]
})
export class CalendarioComponent implements OnInit, OnDestroy {

    view: string = 'week';
    viewDate: Date = new Date();
    locale: string = 'es';
    weekStartsOn: number = 1;

    refresh: Subject<any> = new Subject();
    events: CalendarEvent[] = [];
    events$: Observable<Array<CalendarEvent<Cita>>>;

    activeDayIsOpen: boolean = true;

    excludeDays: number[] = [];//0,6
    dayEndHour: number= 20;
    dayMaxEvents:number= 8;

    msgVal: string = '';

    colors: any;
    salaId: string='1';
    isPaciente: boolean= true;
    currentUser: User=null;
    routeParamsSubscription: Subscription;
    routeQueryParamsSubscription: Subscription;

    syncing: boolean= false;

    constructor(
      private router: Router,
      private appService: AppService,
      private route: ActivatedRoute,
      private calendarioService: CalendarioService,
      private userService: UserService
    ) {
      this.colors= calendarioService.colors;

      this.events$= this.calendarEvents$;

      this.routeParamsSubscription= route.params.subscribe(params=>{
        if(params['view'])
          this.view= params['view'];
        if(params['date']){
          if(this.view=='week'){
            const pieces= params['date'].split('-');
            let d= new Date(pieces[0]);
            if(pieces.length>1)
              d= addWeeks(d, pieces[1]-1);
            this.viewDate= d;
          }else
            this.viewDate= new Date(params['date']);
        }

        this.updateState();
        this.calendarioService.setupRefresh(this.refresh);
      });

      this.routeQueryParamsSubscription= route.queryParams.subscribe(params=>{
        if(params['sala'])
          this.salaId= params['sala'];
        this.updateState();
      });
    }

    updateEventos(eventos: CalendarEvent<Cita>[]){

      eventos.map(event=>{
        event.start= new Date(event.start);
        event.end= new Date(event.end);
        event.color= this.colors.white;
        event.draggable= true;
        return event;
      });
      this.refresh.next();
    }

    ngOnInit(){
      window.scrollTo(0,0);
      this.userService.currentUser$.first().subscribe(user=>{
        this.currentUser= user;
        this.isPaciente=( !user || user.rol=='paciente' );
      });
    }
    ngOnDestroy(){
      this.calendarioService.stopCitasLoop();
      if(this.routeParamsSubscription)
        this.routeParamsSubscription.unsubscribe();
      if(this.routeQueryParamsSubscription)
        this.routeQueryParamsSubscription.unsubscribe();
    }
    updateState(){
      this.calendarioService.readServer(this.viewDate, this.view, this.salaId);
    }
    selectView(view:string){
      const viewOptions= this.calendarioService.viewOptions;
      this.router.navigate(['calendario', view, format(this.viewDate, viewOptions[this.view].format)], {queryParamsHandling: 'preserve'});
    }
    previous(){
      this.router.navigate(['calendario', this.view, this.calendarioService.formatDate(this.viewDate, this.view, 'previous')], {queryParamsHandling: 'preserve'});
    }

    today(){
      const viewOptions= this.calendarioService.viewOptions;

      this.router.navigate(['calendario', this.view, format(new Date(), viewOptions[this.view].format ), {sala: this.salaId}], {queryParamsHandling: 'preserve'});
    }

    next(){

      this.router.navigate(['calendario', this.view, this.calendarioService.formatDate(this.viewDate, this.view, 'next')], {queryParamsHandling: 'preserve'});
    }

    monthDayClicked(day){
      this.viewDate = day.date;
      this.view = 'day';
    }

    goToDay(date){
      const viewOptions= this.calendarioService.viewOptions;

      this.router.navigate(['calendario', 'day', format(date, viewOptions['day'].format )], {queryParamsHandling: 'preserve'});
    }

    dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {

      if (isSameMonth(date, this.viewDate)) {
        if (
          (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
          events.length === 0
        ) {
          this.activeDayIsOpen = false;
        } else {
          this.activeDayIsOpen = true;
          this.viewDate = date;
        }
      }
    }

    eventClicked({ event }: { event: CalendarEvent }): void {
      if(this.currentUser)
        this.goToDay(event.meta.inicio);
      else
        this.router.navigate(['login'], {queryParamsHandling:'preserve'});
    }
    /*
    * Called when event is droped
    */
    eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
      if(
        this.isValidDate(newStart) && this.isValidDate(newEnd)){
        const previousCita= {...event.meta};
        event.start= newStart;
        event.end= newEnd;
        event.meta.inicio= this.calendarioService.formatDateTime(event.start);
        event.meta.fin= this.calendarioService.formatDateTime(event.end);

        this.calendarioService.updateCita( event.meta ).subscribe(r=>{
          if(!r.success){
            this.calendarioService.actions.updateCita(previousCita);
            this.refresh.next();
          }

        });
        this.refresh.next();
      }
    }

    formatDate(date: Date): string{
      return format(date, 'HH:mm');
    }

    addEvent(date: Date=new Date()): void {
      if(this.syncing) return;

      if(this.isValidDate(date)){
        this.userService.currentUser$.first().subscribe(user=>{
          if(user){
            let cita= Object.assign({}, CITA_NEW);
            cita.paciente_id= +user.id;
            cita.inicio= this.calendarioService.formatDateTime(date);
            cita.fin= this.calendarioService.formatDateTime(addMinutes(date, 60));
            this.syncing= true;
            this.calendarioService.addCita(cita).subscribe(r=>{
              this.syncing= false;
              this.refresh.next();
            });

          }else{
            this.router.navigate(['/login'], {queryParams: {from: window.location.pathname}, queryParamsHandling:'merge'});
          }
        });
      }

    }

    isValidDate(date: Date){
      if(!this.calendarioService.checkHorario(date)){
        this.appService.snack('l@s terapeutas deben descansar :/');
        return false;
      }
      if(isPast(date)){
        this.appService.snack('No se puede reservar en el pasado');
        return false;
      }
      return true;
    }

    skipWeekends(direction: 'back' | 'forward'): void {
      if (this.view === 'day') {
        if (direction === 'back') {
          while (this.excludeDays.indexOf(this.viewDate.getDay()) > -1) {
            this.viewDate = subDays(this.viewDate, 1);
          }
        } else if (direction === 'forward') {
          while (this.excludeDays.indexOf(this.viewDate.getDay()) > -1) {
            this.viewDate = addDays(this.viewDate, 1);
          }
        }
      }
    }

    hourClicked(date: Date): void {
      this.addEvent(date);
    }

    insertIntoGoogleCalendar(cita){
      const key= this.route.snapshot.queryParams.key;
      window.open(`${environment.API_URL}/citas/google?key=${key}&cita_id=`+cita.id, "_blank");
    }

    deleteCita(cita){
      this.calendarioService.deleteCita(cita).subscribe(r=>{
        if(r.success){
          this.appService.snack("cita eliminada", "deshacer").subscribe(c=>{
            cita.eliminador_id=null;
            cita.eliminada=null;
            this.calendarioService
                  .updateCita(cita).subscribe(r=>{
                    this.calendarioService.actions.addCita(r.data);
                    this.refresh.next();
                  });
          });
        }
      });
    }
    get calendarEvents$(): Observable<any> {
        return Observable.combineLatest(this.calendarioService.citas$,this.userService.currentUser$)
                      .map(([citas, user]) => {
                        return citas.map((cita: Cita) => {

                          if(!user || user.rol == 'paciente'){
                            if(user && user.id == cita.paciente_id){
                              return {
                                id: Math.random(),
                                title: 'Tú',
                                start: typeof cita.inicio == "string"? new Date(cita.inicio) : cita.inicio,
                                end: typeof cita.fin == "string"? new Date(cita.fin) : cita.fin,
                                color: this.calendarioService.colors.green,
                                draggable: true,
                                meta: cita
                              };
                            }else{
                              return {
                                title: 'Reservado',
                                start: typeof cita.inicio == "string"? new Date(cita.inicio) : cita.inicio,
                                end: typeof cita.fin == "string"? new Date(cita.fin) : cita.fin,
                                color: this.calendarioService.colors.red,
                                draggable: false,
                                meta: cita
                              };
                            }
                          }else{
                            return {
                              title: cita.paciente? cita.paciente.nombre: cita.paciente_id,
                              start: typeof cita.inicio == "string"? new Date(cita.inicio) : cita.inicio,
                              end: typeof cita.fin == "string"? new Date(cita.fin) : cita.fin,
                              color: this.calendarioService.colors.yellow,
                              draggable: true,
                              meta: cita
                            };
                          }

                        });
                      });
      };

}
