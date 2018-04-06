import { Action } from 'redux';
import { User } from './user.model';
import { UserActions, IUserAction, IUsersAction } from './user.actions';
import { IStringAction } from '../api/api.actions';
import { createSelector } from 'reselect';

export interface UsersState {
  currentUser: User;
  currentPaciente: User;
  currentTerapeuta: User;
  usuarios: User[];
};

export const INITIAL_USERS_STATE: UsersState = {
  currentUser: null,
  currentPaciente: null,
  currentTerapeuta: null,
  usuarios: []
};

export function UsersReducer (state: UsersState = INITIAL_USERS_STATE, action: Action): UsersState {
  switch (action.type) {
    case 'RESET':
        return INITIAL_USERS_STATE;

    case UserActions.SET_CURRENT_USER:
        return {
          ...state,
          currentUser: (<IUserAction>action).payload
        };
    case UserActions.UPDATE_CURRENT_USER:
        return {
          ...state,
          currentUser: {...state.currentUser, ...(<IUserAction>action).payload},
          usuarios: state.usuarios.map(item=>{
            if(item.id != (<IUserAction>action).payload.id)
              return item;
            return (<IUserAction>action).payload;
          })
        };
    case UserActions.SET_CURRENT_PACIENTE:
        return {
          ...state,
          currentPaciente: (<IUserAction>action).payload
        };
    case UserActions.SET_CURRENT_TERAPEUTA:
        return {
          ...state,
          currentTerapeuta: (<IUserAction>action).payload
        };
    case UserActions.SET_USUARIOS:
        const usuarios= (<IUsersAction>action).payload;
        return {
          ...state,
          usuarios: usuarios
        };

    case UserActions.ADD_USUARIOS:
        const newUsuarios= (<IUsersAction>action).payload;
        if(newUsuarios.length==0) return state;

        const rol= newUsuarios[0].rol;
        const rolOldIds= state.usuarios.filter(u=>u.rol==rol).map(u=>u.id).sort();
        let rolNewIds = newUsuarios.map(u=>u.id).sort();
        const userInNew= u=>rolNewIds.indexOf(+u.id)>0;
        let oldUsuarios = state.usuarios.filter(u=>
                                                    u.rol!=rol //preserve usuarios with different rol
                                                    || userInNew(u) // preserve usuarios which come in users to add
                                                );

        if(oldUsuarios.length==0){
          return {
            ...state,
            usuarios: newUsuarios
          };
        }else if(rolOldIds != rolNewIds){
          return {
            ...state,
            usuarios: oldUsuarios.concat(newUsuarios)
          };
        }else
          return state;

    case UserActions.ADD_USER:
          const newUsuario= (<IUserAction>action).payload;
          return {
              ...state,
              usuarios: state.usuarios.concat(newUsuario)
            };

    case UserActions.UPDATE_USER:
        let newState= {
          ...state,
          usuarios: state.usuarios.map(item=>{
            if(item.id != (<IUserAction>action).payload.id)
              return item;
            return Object.assign(item,(<IUserAction>action).payload)
          })
        };
        if(state.currentUser && state.currentUser.id == +(<IUserAction>action).payload.id)
          newState.currentUser= Object.assign(newState.currentUser,(<IUserAction>action).payload);

        return newState;

    case UserActions.DELETE_USER:
        const idUsuario= (<IStringAction>action).payload;
        return {
          ...state,
          usuarios: state.usuarios.filter(item=>item.id!=idUsuario)
        };

    default:
      return state;
  }
};
