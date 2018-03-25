import {Action, Reducer,combineReducers } from 'redux';
import {UsersState,UsersReducer,INITIAL_USERS_STATE} from './user/users.reducer';
import {CalendarioState,CalendarioReducer,INITIAL_CALENDARIO_STATE} from './calendario/calendario.reducer';

export * from './user/users.reducer';
export * from './calendario/calendario.reducer';

export interface AppState {
 users: UsersState;
 calendario: CalendarioState;
}

export const INITIAL_STATE: AppState = {
  users: INITIAL_USERS_STATE,
  calendario: INITIAL_CALENDARIO_STATE
};

export const rootReducer: Reducer<AppState> = combineReducers<AppState>({
 users: UsersReducer,
 calendario: CalendarioReducer
});
