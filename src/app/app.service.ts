
import {Observable, of, Subscription} from 'rxjs';

import {catchError, tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


import { MatSnackBar } from '@angular/material';

import { environment } from '../environments/environment';

import {apiErrorResponse, ApiResponse, noConnectionResponse} from './api/apiresponse.model';
import { AppState } from './app.state';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Accept: 'application/json'
    })
};

@Injectable()
export class AppService {

  public clinicaId = '1';
  salaId: string;
  productoId: string;
  terapeutaId: number;
  current_id: string;
  key: string;

  ERROR_NO_KEY = 1;
  ERROR_NO_CLINICA = 2;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appState: AppState,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  setCurrentId(id) {
    this.current_id = id;
  }
  readQuery(params) {

      if (params.clinica_id || params.clinica ) {
        this.clinicaId = params.clinica_id || params.clinica;
      } else {
        this.clinicaId = '1';
      }

      if (params.sala_id || params.sala ) {
        this.salaId = params.sala_id || params.sala;
      }

      if (params.producto_id || params.producto ) {
        this.productoId = params.producto_id || params.producto ;
      }

      if (params.terapeuta_id || params.terapeuta ) {
        this.terapeutaId = +params.terapeuta_id || +params.terapeuta ;
      }

      if (params.key) {
        this.key = params.key;
        this.appState.key = params.key;
      }
  }
    getApiUrl( url: string) {
        url = environment.API_URL + url;
        url += ( url.indexOf('?') >= 0 ? '&' : '?' );
        if (!!this.appState.authToken) {
            url += 'authToken=' + this.appState.authToken;
        }
        url += `&key=${this.appState.key}`;
        return url;
    }
  apiGet(url: string): Observable<ApiResponse> {

    if (this.salaId) {
      url += '&sala_id=' + this.salaId;
    }
    if (this.productoId) {
      url += '&producto_id=' + this.productoId;
    }

    return this.http.get<ApiResponse>( this.getApiUrl(url) , httpOptions)
        .pipe(
            tap(resp => {
                if (!resp.success) {
                    this.snack( resp.message );
                }
            }),
            catchError( (error: HttpErrorResponse) => {
                this.snack(error.message);
                return of(apiErrorResponse(error.message));
            }));

  }

  apiPost(url: string, body: any): Observable<ApiResponse> {
      return this.http.post<ApiResponse>( this.getApiUrl(url) , body , httpOptions)
          .pipe(
              tap(resp => {
                  if (!resp.success) {
                      this.snack( resp.message );
                  }
              }),
              catchError( (error: HttpErrorResponse) => {
                  this.snack(error.message);
                  return of(noConnectionResponse);
              }));
  }

  apiDelete(url: string): Observable<ApiResponse> {
      return this.http.delete<ApiResponse>( this.getApiUrl(url)  , httpOptions)
          .pipe(
              tap(resp => {
                  if (!resp.success) {
                      this.snack( resp.message );
                  }
              }),
              catchError( (error: HttpErrorResponse) => {
                  this.snack(error.message);
                  return of(noConnectionResponse);
              }));
  }

  public snack( message: string, action: string= 'Ok', duration: number= 3000): Observable<void> {
    const snackBarRef = this.snackBar.open( message, action, {duration: duration});
    return snackBarRef.onAction();
  }

  public unsubscribeAll( subscriptions: Subscription[] ) {
    if (!!subscriptions) {
      subscriptions.forEach( subs => subs.unsubscribe() );
    }
  }
}
