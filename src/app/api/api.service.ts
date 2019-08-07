import { Injectable } from '@angular/core';
import {AppState} from '../app.state';
import {AppService} from '../app.service';
import {Observable} from 'rxjs';
import {ApiResponse} from './apiresponse.model';
import {User} from '../user/user.model';
import {filter, first, map, pluck, tap} from 'rxjs/operators';
import {Cita} from './cita.model';

@Injectable()
export class ApiService {

  constructor(
    private appState: AppState,
    private appService: AppService
  ) { }

  deleteCita$(cita: Cita, permanente: boolean= false) {
    const eliminador_id = this.appService.current_id;
    let url = `/citas/${cita.id}?eliminador_id=${eliminador_id}`;
    if (permanente) {
      url += '&permanent';
    }

    return this.appService.apiDelete(url).pipe(first());
  }

  updateCita$( cita: Cita ) {
    return this.appService.apiPost('/citas/' + cita.id, cita).pipe(first());
  }

  addCita$( cita: Cita ) {
    return this.appService.apiPost('/citas', cita).pipe(first());
  }

  get salas$(): Observable<ApiResponse> {
    return this.appService.apiGet('/salas.json' );
  }

  get productos$(): Observable<ApiResponse> {
    return this.appService.apiGet('/productos.json' );
  }

}
