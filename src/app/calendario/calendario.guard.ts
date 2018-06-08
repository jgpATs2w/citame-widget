
import {of as observableOf,  Observable } from 'rxjs';

import {map, tap} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';




import { NgRedux, select } from '@angular-redux/store';
import { AppService } from '../app.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CalendarioGuard implements CanActivate {

  constructor(
      private appService: AppService,
      private userService: UserService,
      private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      const queryParams= state.root.queryParams;
      if(!queryParams.key){
        this.router.navigate(['/error'], {queryParams: {error:this.appService.ERROR_NO_KEY}, queryParamsHandling: 'merge'});
        return observableOf(false);
      }

      this.appService.readQuery(queryParams);

      return this.userService.currentUser$.pipe(
              tap(u=>{if(u) this.appService.setCurrentId(u.id)}),
              map(_=>true),);
  }
}
