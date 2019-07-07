
import {from as observableFrom, of as observableOf,  Observable } from 'rxjs';

import {tap, pluck, mergeMap, map, first} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { ApiResponse } from '../api/apiresponse.model';
import { User, fromFirebase } from './user.model';
import { AppService } from '../app.service';

export const phonePattern = /\d{9}/;
export const passwordPattern = /[\w\d]{8,}/;
export const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Injectable()
export class UserService {
  currentUser$: Observable<User>;
  userFromFirebase: User;

  constructor(
    private afAuth: AngularFireAuth,
    private appService: AppService
  ) {}

    loginGoogle(): Observable<ApiResponse> {
        return this.loginWithFirebase$('Google');
    }

    loginFacebook(): Observable<ApiResponse> {
        return this.loginWithFirebase$('Facebook');
    }

    loginEmail(formData: any): Observable<ApiResponse> {
        return this.appService.apiPost('/login?', formData);
    }

    loginWithFirebase$( providerKey: string ): Observable<ApiResponse> {
        const provider = new firebase.auth[providerKey + 'AuthProvider']();
        const user$ = observableFrom(this.afAuth.auth.signInWithPopup(provider)).pipe(
            pluck('user'),
            map(fromFirebase), );
        return this.processUserFromFirebase$(user$);
    }

    processUserFromFirebase$( user$: Observable<User>): Observable<ApiResponse> {
        return user$.pipe(
            map((user: User) => ({...user, id: user.email, password: 'firebase'})),
            mergeMap((user: User) => this.loginEmail(user)) );
    }
  createUser(user: User): Observable<ApiResponse> {
    return this.appService.apiPost('/usuarios', user);
  }
  sendReminder(email: string): Observable<ApiResponse> {
    return observableOf({success: true});
  }
  addUser(user: User) {

    return this.appService
                    .apiPost('/usuarios', user).pipe(first());
  }
  updateUser(user: User) {
    return this.appService
                    .apiPost('/usuarios/' + user.id, user).pipe(first());
  }
  deleteUser(user: User) {

    return this.appService
                  .apiDelete('/usuarios/' + user.id).pipe(first());
  }
}
