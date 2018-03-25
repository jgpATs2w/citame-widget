import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { MatSnackBar, MatSnackBarRef } from '@angular/material';

import { environment } from '../environments/environment';

import { ApiResponse } from './api/apiresponse.model';
import { NgRedux } from '@angular-redux/store';
import { AppState } from './app.store';


@Injectable()
export class AppService {

  clinicaId$: Observable<string>;

  constructor(
    private http: Http,
    private ngRedux: NgRedux<AppState>,
    private snackBar: MatSnackBar
  ) {}

  apiGet(url:string): Observable<ApiResponse>{

    const urlBase= environment.API_URL;

    return this.http.get( urlBase + url )
                  .map(res=>res.json());

  }

  apiPost(url:string, body: any): Observable<ApiResponse>{

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });

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
