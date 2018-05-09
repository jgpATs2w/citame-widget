import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ActionsObservable, createEpicMiddleware } from 'redux-observable';
import { ICitaAction, ICitasAction, CalendarioActions } from './calendario.actions';
import { ApiActions, IStringAction } from '../api/api.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { AppService } from '../app.service';

@Injectable()
export class CalendarioEpics {
  constructor(private appService: AppService) {}

  public getEpics(){
    return [
      createEpicMiddleware(this.addCita),
      createEpicMiddleware(this.updateCita),
      createEpicMiddleware(this.deleteCita)
    ]
  }

  addCita = (action$: ActionsObservable<ICitaAction>) => {
    return action$
      .ofType(CalendarioActions.ADD_CITA)
      .switchMap((action:ICitaAction)=>
                          this.appService
                                .apiPost("/citas", action.payload)
                                .map(r=>({
                                  type: ApiActions.SERVER_SUCCESS,
                                  payload: r.data}))
                                .catch(error=>Observable.of({
                                  type: ApiActions.SERVER_FAILURE,
                                  payload: action.payload
                                }))
      )

  }
  updateCita = (action$: ActionsObservable<ICitaAction>) => {
    return action$
      .ofType(CalendarioActions.UPDATE_CITA)
      .switchMap((action:ICitaAction)=>
                          this.appService
                                .apiPost("/citas/"+action.payload.id, action.payload)
                                .map(_=>({
                                  type: ApiActions.SERVER_SUCCESS,
                                  payload: action.payload}))
                                .catch(error=>Observable.of({
                                  type: ApiActions.SERVER_FAILURE,
                                  payload: action.payload
                                }))
      )

  }
  deleteCita = (action$: ActionsObservable<ICitaAction>) => {
    return action$
      .ofType(CalendarioActions.DELETE_CITA)
      .switchMap((action:ICitaAction)=>
                          this.appService
                                .apiDelete("/citas/"+action.payload.id)
                                .map(_=>({
                                  type: ApiActions.SERVER_SUCCESS,
                                  payload: action.payload}))
                                .catch(error=>Observable.of({
                                  type: ApiActions.SERVER_FAILURE,
                                  payload: action.payload
                                }))
      )

  }
}
