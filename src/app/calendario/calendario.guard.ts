import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { NgRedux, select } from '@angular-redux/store';
import { AppService } from '../app.service';

@Injectable()
export class CalendarioGuard implements CanActivate {

  constructor(
      private appService: AppService,
      private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      const queryParams= state.root.queryParams;
      if(!queryParams.key){
        this.router.navigate(['/error'], {queryParams: {error:this.appService.ERROR_NO_KEY}, queryParamsHandling: 'merge'});
        return Observable.of(false);
      }

      this.appService.readQuery(queryParams);

      return Observable.of(true);
  }
}
