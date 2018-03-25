import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { MatSnackBar, MatSnackBarRef } from '@angular/material';

import { environment } from '../environments/environment';

import { ApiResponse } from './api/apiresponse.model';
import { NgRedux } from '@angular-redux/store';
import { AppState } from './app.store';


@Injectable()
export class AppService {

  clinicaId: string;
  salaId: string;
  productoId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: Http,
    private ngRedux: NgRedux<AppState>,
    private snackBar: MatSnackBar
  ) {}

  readQuery(){
    this.route.queryParams.first().subscribe(params=>{console.info(params);
      if(params.clinica_id)
        this.clinicaId= params.clinica_id;
      else
        this.router.navigate(['/error']);

      if(params.sala_id)
        this.salaId= params.sala_id;
      if(params.producto_id)
        this.productoId= params.producto_id;
    })
  }
  apiGet(url:string): Observable<ApiResponse>{

    url= environment.API_URL + url + '&clinica_id=' + this.clinicaId;
    if(this.salaId)
      url += '&sala_id='+this.salaId;
    if(this.productoId)
      url += '&producto_id='+this.productoId;

    return this.http.get( url ).map(res=>res.json());

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

    return this.http.post( environment.API_URL + url, body , options)
                  .map(res=>res.json());
  }

  apiDelete(url:string): Observable<Response>{
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ 'headers': headers });
    return this
            .http
            .delete( environment.API_URL +url, options)
            .map(res=>res.json());
  }

  public snack( message: string, action: string='Ok', duration: number= 3000): Observable<void>{
    const snackBarRef= this.snackBar.open( message, action, {duration:duration});
    return snackBarRef.onAction();
  }

  private mockSuccessResponse(): Observable<ApiResponse>{
    return Observable.of({success: true});
  }
}
