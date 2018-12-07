
import {from as observableFrom, timer as observableTimer, of as observableOf,  Observable, Subscription } from 'rxjs';

import {tap, switchMap, pluck, mergeMap, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { NgRedux, select, ObservableStore } from '@angular-redux/store';
import { UserActions } from '../app.actions';
import { AppState, UsersState, UsersReducer } from '../app.store';

import { environment } from '../../environments/environment';

import { ApiResponse } from '../api/apiresponse.model';
import { User, fromFirebase } from './user.model';
import { AppService } from '../app.service';

export const phonePattern= /\d{9}/;
export const passwordPattern= /[\w\d]{8,}/;
export const emailPattern= /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Injectable()
export class UserServiceMock {
  usersStore$: Observable<UsersState>;
  currentUser$: Observable<User>;
  pacientesFromServer$: Observable<User[]>= observableOf([]);
  pacientes$: Observable<User[]>;
  terapeutas$: Observable<User[]>;
  userFromFirebase: User;

  pacientesSubscription: Subscription;
  terapeutasSubscription: Subscription;

  constructor(
  ) {
  }

  startPacientesLoop(){
  }
  stopPacientesLoop(){
  }
  startTerapeutasLoop(){
  }

  stopTerapeutasLoop(){
  }

  /*loginGooglePromise(): Promise<User>{
    return  observableOf(this.afAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider()))
        ;
  }*/

  loginGoogle(): Observable<User>{
    return observableOf(null);
  }

  loginFacebook(){

    return observableOf(null);

  }

  loginEmail(formData: any){

    return observableOf(null);
  }

  loginWithFirebase$( providerKey: string ): Observable<User>{
    return observableOf(null);
  }

  processUserFromFirebase$( user$: Observable<User>): Observable<User>{
    return observableOf(null);
  }
  createUser(user: User): Observable<ApiResponse>{
    return observableOf(null);;
  }
  logout(){
    return observableOf(null);;
  }
  sendReminder(email:string): Observable<ApiResponse>{
    return observableOf({success: true});
  }
  addUser(user:User){

    return observableOf(null);;
  }
  updateUser(user:User){
    return observableOf(null);
  }
  deleteUser(user:User){

    return observableOf(null);;
  }
}
