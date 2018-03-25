import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Action } from 'redux';
import { Cita } from '../cita/cita.model';
import { CalendarEvent } from 'calendar-utils';
import { CalendarioState } from './calendario.reducer';

export interface ICitasAction extends Action {
  payload: Cita[];
}
export interface ICitaAction extends Action {
  payload: Cita;
}

@Injectable()
export class CalendarioActions {
  static SET_CITAS= '[Calendario] Set Citas';
  static ADD_CITA= '[Calendario] Add Cita';
  static DELETE_CITA= '[Calendario] Delete Cita';
  static UPDATE_CITA= '[Calendario] Update Cita';
  static SET_CURRENT_CITA= '[Calendario] Set Current';

  constructor(private ngRedux: NgRedux<CalendarioState>) {}

  setCitas(citas: Cita[] ) {
    this.ngRedux.dispatch({ type: CalendarioActions.SET_CITAS, payload: citas });
  }
  addCita(cita: Cita ) {
    this.ngRedux.dispatch({ type: CalendarioActions.ADD_CITA, payload: cita });
  }
  updateCita(cita: Cita ) {
    this.ngRedux.dispatch({ type: CalendarioActions.UPDATE_CITA, payload: cita });
  }
  deleteCita(cita: Cita ) {
    this.ngRedux.dispatch({ type: CalendarioActions.DELETE_CITA, payload: cita });
  }
  setCurrentCita(cita: Cita ) {
    this.ngRedux.dispatch({ type: CalendarioActions.SET_CURRENT_CITA, payload: cita });
  }

}
