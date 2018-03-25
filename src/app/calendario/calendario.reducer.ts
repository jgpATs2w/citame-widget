import { Action } from 'redux';
import { Cita } from '../cita/cita.model';
import { CalendarioActions, ICitasAction, ICitaAction } from './calendario.actions';
import { createSelector } from 'reselect';

export interface CalendarioState {
  currentCita: Cita,
  citas: Cita[];
};

export const INITIAL_CALENDARIO_STATE: CalendarioState = {
  currentCita: null,
  citas: []
};

export function CalendarioReducer (state: CalendarioState = INITIAL_CALENDARIO_STATE, action: Action): CalendarioState {
  switch (action.type) {

    case CalendarioActions.SET_CITAS:
        return {
          ...state,
          citas: (<ICitasAction>action).payload
        };
    case CalendarioActions.ADD_CITA:
        return {
          ...state,
          citas: state.citas.concat((<ICitaAction>action).payload)
        };
    case CalendarioActions.UPDATE_CITA:

        return {
          ...state,
          citas: state.citas.map(cita=>{
                                  if(cita.id != (<ICitaAction>action).payload.id)
                                    return cita;
                                  return Object.assign(cita,(<ICitaAction>action).payload);
                                })
        };
    case CalendarioActions.DELETE_CITA:
        return {
          ...state,
          citas: state.citas.filter(cita=>cita.id!=(<ICitaAction>action).payload.id)
        };
    case CalendarioActions.SET_CURRENT_CITA:
      return {
        ...state,
        currentCita: (<ICitaAction>action).payload
      };

    default:
      return state;
  }
};
