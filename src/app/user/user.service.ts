import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/defaultIfEmpty';

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
export class UserService {
  usersStore$: Observable<UsersState>;
  currentUser$: Observable<User>;
  pacientesFromServer$: Observable<User[]>= Observable.of([]);
  pacientes$: Observable<User[]>;
  terapeutas$: Observable<User[]>;
  userFromFirebase: User;

  pacientesSubscription: Subscription;
  terapeutasSubscription: Subscription;

  constructor(
    private ngRedux: NgRedux<AppState>,
    public actions: UserActions,
    private afAuth: AngularFireAuth,
    private appService: AppService
  ) {
    this.usersStore$= ngRedux.select('users');
    this.currentUser$= this.usersStore$.pluck('currentUser');

    this.pacientes$= this.usersStore$.pluck('usuarios').map((users:User[])=>users.filter((user:User)=>user.rol=="paciente"));
    this.terapeutas$= this.usersStore$.pluck('usuarios').map((users:User[])=>users.filter((user:User)=>user.rol=="terapeuta"));
    this.pacientesFromServer$= this.appService.apiGet("/usuarios.json?rol=paciente").pluck('data');
  }

  startPacientesLoop(){
    if(this.pacientesSubscription!=null) return;
    this.pacientesSubscription= Observable.timer(100, 10000)
              .switchMap(_=>this.appService.apiGet("/usuarios.json?rol=paciente"))
              .pluck('data')
              .subscribe((pacientes:User[])=>this.actions.addUsuarios(pacientes));
  }
  stopPacientesLoop(){
    this.pacientesSubscription.unsubscribe();
  }
  startTerapeutasLoop(){
    if(this.terapeutasSubscription!=null) return;
    this.terapeutasSubscription= Observable.timer(100, 10000)
              .switchMap(_=>this.appService.apiGet("/usuarios.json?rol=terapeuta"))
              .pluck('data')
              .subscribe((terapeutas:User[])=>this.actions.addUsuarios(terapeutas));
  }

  stopTerapeutasLoop(){
    this.terapeutasSubscription.unsubscribe();
  }

  loginGooglePromise(): Promise<User>{
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }
  loginGoogle(): Observable<User>{
    return this.loginWithFirebase$('Google');
  }

  loginFacebook(){

    return this.loginWithFirebase$('Facebook');

  }

  loginEmail(formData: any){

    return this.appService.apiPost("/login", formData);
  }

  loginWithFirebase$( providerKey: string ): Observable<User>{
    const provider= new firebase.auth[providerKey+'AuthProvider']();
    const user$= Observable
                    .fromPromise(this.afAuth.auth.signInWithPopup(provider))
                    .pluck('user')
                    .map(fromFirebase);
    return this.processUserFromFirebase$(user$);
  }

  processUserFromFirebase$( user$: Observable<User>): Observable<User>{
    return user$
              .map((user:User)=>({...user, id: user.email, password: 'firebase'}))
              .do(user=>this.userFromFirebase=user)
              .mergeMap((user:User)=>this.loginEmail(user).map(apiResponse=>apiResponse.data))
  }
  createUser(user: User): Observable<ApiResponse>{
    return this.appService.apiPost("/usuarios", user);
  }
  logout(){
    this.ngRedux.dispatch({type:'RESET'});
    return Observable.fromPromise(this.afAuth.auth.signOut());
  }
  sendReminder(email:string): Observable<ApiResponse>{
    return Observable.of({success: true});
  }
}
