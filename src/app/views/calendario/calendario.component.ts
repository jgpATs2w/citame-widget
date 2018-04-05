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
  isSameMonth,
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
    routeParamsSubscription: Subscription;
    routeQueryParamsSubscription: Subscription;

    constructor(
      private router: Router,
      private appService: AppService,
      private route: ActivatedRoute,
      private calendarioService: CalendarioService,
      private userService: UserService
    ) {
      this.colors= calendarioService.colors;

      this.events$= calendarioService.events$;

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
      //this.calendarioService.startCitasLoop(this.viewDate, this.view, this.salaId);
      this.userService.currentUser$.first().subscribe(user=>this.isPaciente=( !user || user.rol=='paciente' ));
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
      this.router.navigate(['login'], {queryParamsHandling:'preserve'});
    }
    /*
    * Called when event is droped
    */
    eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
      if(this.calendarioService.checkHorario(newStart) && this.calendarioService.checkHorario(newEnd)){

        event.start= newStart;
        event.end= newEnd;
        event.meta.inicio= this.calendarioService.formatDateTime(event.start);
        event.meta.fin= this.calendarioService.formatDateTime(event.end);

        this.calendarioService.updateCita( event.meta );
        this.refresh.next();
      }else{
        this.appService.snack('l@s terapeutas deben descansar :/');
      }
    }

    formatDate(date: Date): string{
      return format(date, 'HH:mm');
    }

    addEvent(date: Date=new Date()): void {
      if(this.calendarioService.checkHorario(date)){
        this.userService.currentUser$.first().subscribe(user=>{
          if(user){
            let cita= Object.assign({}, CITA_NEW);
            cita.paciente_id= +user.id;
            cita.inicio= this.calendarioService.formatDateTime(date);
            cita.fin= this.calendarioService.formatDateTime(addMinutes(date, 60));

            this.calendarioService.actions.addCita( cita );
            this.refresh.next();
          }else{
            this.router.navigate(['login'], {queryParamsHandling:'preserve'});
          }

        });
      }else{
        this.appService.snack('l@s terapeutas deben descansar :/');
      }

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

}
