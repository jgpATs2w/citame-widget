
import {combineLatest as observableCombineLatest,  Subject ,  Observable, Subscription } from 'rxjs';

import {map, first } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter
} from 'angular-calendar';
import {
  WeekDay
} from 'calendar-utils';
import {
  addDays,
  isSameDay,
  isSameMonth, isPast,
  subDays,
  addWeeks,
  format
} from 'date-fns';

import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';
import { CustomDateFormatter } from '../../calendario/custom-date-formatter.provider';
import { CalendarioService } from '../../calendario/calendario.service';
import { Cita, CITA_NEW } from '../../api/cita.model';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.model';
import {AppRouter} from '../../app.router';
import {AppState} from '../../app.state';
import {ApiService} from '../../api/api.service';

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

    view = 'week';
    viewDate: Date = new Date();
    locale = 'es';
    weekStartsOn = 1;

    refresh: Subject<any> = new Subject();
    events: CalendarEvent[] = [];
    events$: Observable<Array<CalendarEvent<Cita>>>;

    excludeDays: number[] = [0, 6];
    showWeekends = false;
    dayEndHour = 20;
    dayMaxEvents = 8;

    colors: any;
    salaId = '1';
    user: User;
    productoId: string;
    terapeutaId: string;
    isPaciente = true;
    routeParamsSubscription: Subscription;
    routeQueryParamsSubscription: Subscription;
    subscriptions: Subscription[] = [];

    syncing = false;

    constructor(
      private appRouter: AppRouter,
      private appState: AppState,
      private appService: AppService,
      private apiService: ApiService,
      private calendarioService: CalendarioService,
      private userService: UserService
    ) {
      this.colors = calendarioService.colors;
    }

    ngOnInit() {
      window.scrollTo(0, 0);
      this.loadState();
      this.loadQueryParams();
      this.loadEvents();
    }
    ngOnDestroy() {
      if (this.routeParamsSubscription) {
        this.routeParamsSubscription.unsubscribe();
      }
      if (this.routeQueryParamsSubscription) {
        this.routeQueryParamsSubscription.unsubscribe();
      }
      this.appService.unsubscribeAll(this.subscriptions);
    }
    selectView(view: string) {
      this.appState.view = view;
      this.view = view;
    }
    previous() {
      this.viewDate = this.calendarioService.viewOptions[this.view].previousFn(this.viewDate, 1);
      this.loadEvents();
    }
    today() {
      this.viewDate = new Date();
      this.loadEvents();
    }
    next() {
      this.viewDate = this.calendarioService.viewOptions[this.view].nextFn(this.viewDate, 1);
      this.loadEvents();
    }

    monthDayClicked(day) {
      this.viewDate = day.date;
      this.view = 'day';
    }

    goToDay(date) {
      this.viewDate = date;
      this.view = 'day';
      this.loadEvents();
    }

    eventClicked({ event }: { event: CalendarEvent }): void {
      if (this.user) {
        this.goToDay(event.meta.inicio);
      } else {
        this.authenticate();
      }
    }
    /*
    * Called when event is droped
    */
    eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
      if (
        this.isValidDate(newStart) && this.isValidDate(newEnd)) {
        event.start = newStart;
        event.end = newEnd;
        event.meta.inicio = this.calendarioService.formatDateTime(event.start);
        event.meta.fin = this.calendarioService.formatDateTime(event.end);

        this.apiService.updateCita$(event.meta).subscribe(r => {if (r.success) { this.appService.snack('cita actualizada'); }});
      }
    }

    addEvent(date: Date= new Date()): void {
      if (this.syncing) { return; }

      if (this.isValidDate(date)) {
        this.userService.currentUser$.pipe(first()).subscribe(user => {
          if (user) {
            const cita = Object.assign({}, CITA_NEW);
            cita.paciente_id = +user.id;
            cita.producto_id = +this.productoId;
            cita.terapeuta_id = +this.terapeutaId;

            cita.inicio = this.calendarioService.formatDateTime(date);
            this.syncing = true;
              this.checkAvailability(cita).subscribe(resp => {
                  if (resp.success && resp.data.length === 0) {
                      this.apiService.addCita$(cita).subscribe(r => {if (r.success) { this.appService.snack('cita creada'); }});
                  } else {
                      this.appService.snack('ya existe una cita en esa hora y sala para el paciente ');
                  }
              });

          } else {
            this.authenticate();
          }
        });
      }

    }

    checkAvailability(cita: Cita) {
        const url = '/citas.json?desde=' + cita.inicio + '&hasta=' + cita.fin + '&sala_id=' + cita.sala_id;
        return this.appService.apiGet(url);
    }
    isValidDate(date: Date) {
      if (!this.calendarioService.checkHorario(date)) {
        this.appService.snack('l@s terapeutas deben descansar :/');
        return false;
      }
      if (isPast(date)) {
        this.appService.snack('No se puede reservar en el pasado');
        return false;
      }
      return true;
    }
    ///
    loadQueryParams(){
      const params = this.appRouter.getQueryParams();
      if (params['sala']) {
        this.salaId = params['sala'];
      }
      if (params['producto_id']) {
        this.productoId = params['producto_id'];
      }
      if (params['terapeuta_id']) {
        this.terapeutaId = params['terapeuta_id'];
      }
    }
    loadState() {
      this.excludeDays = this.calendarioService.fines_de_semana ? [] : [0, 6];
      this.user = this.appState.user;
      this.events = this.appState.events;
      this.view = this.appState.view;
      this.viewDate = this.appState.viewDate;
    }
    loadEvents() {
      const url = this.calendarioService.getCitasUrl(
        this.viewDate,
        this.view,
        this.salaId
      );

      const events$ = this.calendarioService.events$( url, this.user );

      events$.pipe(
        first() ).subscribe( events => {
        this.events = events;
      } );
    }
    authenticate(){
      this.appState.viewDate = this.viewDate;
      this.appState.view = this.view;
      this.appRouter.navigateLogin();
    }
    hourClicked(date: Date): void {
      this.addEvent(date);
    }

    insertIntoGoogleCalendar(cita) {
      window.open(`${environment.API_URL}/citas/google?key=${this.appState.key}&cita_id=` + cita.id, '_blank');
    }

    deleteCita(cita) {
        this.apiService.deleteCita$(cita).subscribe(r => {
            if (r.success) {
                this.loadEvents();

                this.appService.snack('cita eliminada', 'deshacer').subscribe(c => {
                    cita.eliminador_id = null;
                    cita.eliminada = null;
                    this.apiService
                        .updateCita$(cita).subscribe(resp => {
                        this.loadEvents();
                    });
                });
            }
        });
    }

    trackByWeekDayHeaderDate = (index: number, day: WeekDay) => day.date.toISOString();

}
