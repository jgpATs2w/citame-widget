import {
  Action,
  ActionCreator
} from 'redux'
import { CalendarEvent } from 'calendar-utils';
import { AppState } from './app.store';

export interface IStringAction extends Action {
  payload: string;
}

export * from './user/user.actions';
export * from './calendario/calendario.actions';
