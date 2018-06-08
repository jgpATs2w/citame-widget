
import {of as observableOf,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';


import { MatSnackBar, MatSnackBarRef } from '@angular/material';

import { environment } from '../environments/environment';

import { ApiResponse } from './api/apiresponse.model';
import { NgRedux } from '@angular-redux/store';
import { AppState } from './app.store';


@Injectable()
export class AppService {

  public clinicaId: string = '1';
  salaId: string;
  productoId: string;
  current_id: string;
  key: string;

  ERROR_NO_KEY: number= 1;
  ERROR_NO_CLINICA: number= 2;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: Http,
    private ngRedux: NgRedux<AppState>,
    private snackBar: MatSnackBar
  ) {}

  setCurrentId(id){
    this.current_id=id;
  }
  readQuery(params){
      if(params.clinica_id)
        this.clinicaId= params.clinica_id;

      if(params.sala_id)
        this.salaId= params.sala_id;
      if(params.producto_id)
        this.productoId= params.producto_id;
      if(params.key){
        this.key= params.key;
      }
  }
  apiGet(url:string): Observable<ApiResponse>{

    if(url.indexOf('?')<0) url+='?';
    url= environment.API_URL + url + '&clinica_id=' + this.clinicaId + '&key=' + this.key;
    if(this.salaId)
      url += '&sala_id='+this.salaId;
    if(this.productoId)
      url += '&producto_id='+this.productoId;

    return this.http.get( url ).pipe(map(res=>res.json()));

  }

  apiPost(url:string, body: any): Observable<ApiResponse>{

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });

    body.clinica_id= this.clinicaId;
    if(this.salaId)
      body.sala_id= this.salaId;
    if(this.productoId)
      body.producto_id= this.productoId;

    if(url.indexOf('?')<0) url+='?';
    return this.http.post( environment.API_URL + url + '&key=' + this.key, body , options).pipe(
                  map(res=>res.json()));
  }

  apiDelete(url:string): Observable<ApiResponse>{
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ 'headers': headers });
    return this
            .http
            .delete( environment.API_URL +url+ '&clinica_id=' + this.clinicaId + '&key=' + this.key, options).pipe(
            map(res=>res.json()));
  }

  public snack( message: string, action: string='Ok', duration: number= 3000): Observable<void>{
    const snackBarRef= this.snackBar.open( message, action, {duration:duration});
    return snackBarRef.onAction();
  }

  private mockSuccessResponse(): Observable<ApiResponse>{
    return observableOf({success: true});
  }
}
