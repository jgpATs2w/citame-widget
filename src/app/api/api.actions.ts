import { Injectable } from '@angular/core';
import { Action } from 'redux';

export interface IStringAction extends Action {
  payload: string;
}

@Injectable()
export class ApiActions {
  static SERVER_SUCCESS= '[Api] Server Success';
  static SERVER_FAILURE= '[Api] Server Failure';
}
