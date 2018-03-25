import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ActionsObservable, createEpicMiddleware } from 'redux-observable';
import { UserActions, IUserAction } from './user.actions';
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
export class UserEpics {
  constructor(private appService: AppService) {}

  public getEpics(){
    return [
      createEpicMiddleware(this.addUser),
      createEpicMiddleware(this.updateUser),
      createEpicMiddleware(this.deleteUser)
    ]
  }

  addUser = (action$: ActionsObservable<IUserAction>) => {
    return action$
      .ofType(UserActions.ADD_USER)
      .switchMap((action:IUserAction)=>
                          this.appService
                                .apiPost("/usuarios", action.payload)
                                .map(_=>({
                                  type: ApiActions.SERVER_SUCCESS,
                                  payload: action.payload}))
                                .catch(error=>Observable.of({
                                  type: ApiActions.SERVER_FAILURE,
                                  payload: action.payload
                                }))
      )
  }
  updateUser = (action$: ActionsObservable<IUserAction>) => {
    return action$
      .ofType(UserActions.UPDATE_USER)
      .switchMap((action:IUserAction)=>
                          this.appService
                                .apiPost("/usuarios/"+action.payload.id, action.payload)
                                .map(_=>({
                                  type: ApiActions.SERVER_SUCCESS,
                                  payload: action.payload}))
                                .catch(error=>Observable.of({
                                  type: ApiActions.SERVER_FAILURE,
                                  payload: action.payload
                                }))
      )
  }
  deleteUser = (action$: ActionsObservable<IStringAction>) => {
    return action$
      .ofType(UserActions.DELETE_USER)
      .switchMap((action:IStringAction)=>
                          this.appService
                                .apiDelete("/usuarios/"+action.payload)
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
