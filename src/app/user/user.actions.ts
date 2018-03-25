import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Action } from 'redux';
import { User } from './user.model';
import { UsersState } from './users.reducer';

export interface IUserAction extends Action {
  payload: User;
}
export interface IUsersAction extends Action {
  payload: User[];
}

@Injectable()
export class UserActions {
  static SET_CURRENT_USER = '[Users] Set Current User';
  static UPDATE_CURRENT_USER = '[Users] Update Current User';
  static SET_CURRENT_PACIENTE = '[Users] Set Current Paciente';
  static SET_CURRENT_TERAPEUTA = '[Users] Set Current Terapeuta';

  static SET_USUARIOS= '[Users] Set Usuarios';
  static ADD_USUARIOS= '[Users] Add Usuarios';

  static ADD_USER= '[Users] Add User';
  static UPDATE_USER= '[Users] Update User';
  static DELETE_USER= '[Users] Delete User';

  constructor(private ngRedux: NgRedux<UsersState>) {}

  setCurrentUser(currentUser: User ) {
    this.ngRedux.dispatch({ type: UserActions.SET_CURRENT_USER, payload: currentUser });
  }
  updateCurrentUser(currentUser: User ) {
    this.ngRedux.dispatch({ type: UserActions.UPDATE_CURRENT_USER, payload: currentUser });
  }
  setCurrentPaciente(current: User ) {
    this.ngRedux.dispatch({ type: UserActions.SET_CURRENT_TERAPEUTA, payload: current });
  }
  setCurrentTerapeuta(current: User ) {
    this.ngRedux.dispatch({ type: UserActions.SET_CURRENT_USER, payload: current });
  }

  setUsuarios(payload: User[] ) {
    this.ngRedux.dispatch({ type: UserActions.SET_USUARIOS, payload: payload });
  }
  addUsuarios(payload: User[] ) {
    this.ngRedux.dispatch({ type: UserActions.ADD_USUARIOS, payload: payload });
  }

  addUser(payload: User ) {
    this.ngRedux.dispatch({ type: UserActions.ADD_USER, payload: payload });
  }
  updateUsuario(payload: User) {
    this.ngRedux.dispatch({ type: UserActions.UPDATE_USER, payload: payload });
  }
  deleteUsuario(payload: User) {
    this.ngRedux.dispatch({ type: UserActions.DELETE_USER, payload: payload });
  }

}
