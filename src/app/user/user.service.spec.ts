
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject, fakeAsync, getTestBed, tick } from '@angular/core/testing';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';


import { UserActions } from '../app.actions';

import { environment } from '../../environments/environment';

import { AppService } from '../app.service';
import { UserService } from './user.service';
import { User } from './user.model';

import { UsersReducer, UsersState, INITIAL_USERS_STATE } from './users.reducer';

class AngularFireAuthMock{}
class AppServiceMock{
  apiGet( url ){
    return observableOf({
      success: true,
      data: []
    })
  }
  apiPost( url, body ){
    return observableOf({
      success: true,
      data: {}
    })
  }
}

describe('UserService', () => {
  beforeEach(() => {

    MockNgRedux.reset();

    TestBed.configureTestingModule({
      imports: [
        AngularFireAuthModule,
        NgReduxTestingModule],
      providers: [
        { provide: AngularFireAuth, useClass: AngularFireAuthMock },
        {provide: AppService, useClass: AppServiceMock},
        UserService,
        UserActions]
    });
  });

  describe('get service using inject', () => {
    it('should create an injected instance', inject([UserService, AngularFireAuth], (injectedService: UserService, afAuth) => {
      expect(injectedService).toBeDefined();
    }));
  });

  describe('Firebase user register', () => {
    it('should create users if dont exists', inject([UserService], (userService: UserService)=>{
      userService.loginWithFirebase$('Google').subscribe(user=>{
        console.info(user);
        expect(user.nombre).toEqual('Pepito');
      })
    }));
  });
});
