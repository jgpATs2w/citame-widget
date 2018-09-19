
import {map, tap} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';




import { NgRedux, select } from '@angular-redux/store';
import { UserActions } from './user.actions';
import { UsersState } from './users.reducer';
import { AppService } from '../app.service';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
      private appService: AppService,
      private userService: UserService,
      private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      const queryParams= state.root.queryParams;
      if(!queryParams.key){
        this.router.navigate(['/error'], {queryParams: {error:this.appService.ERROR_NO_KEY}, queryParamsHandling: 'merge'});
        return false;
      }

      this.appService.readQuery(queryParams);

      return this.userService.currentUser$.pipe(
              tap(u=>{if(u) this.appService.setCurrentId(u.id)}),
              map(currentUser=>currentUser!=null),
              tap((userActivated:boolean)=>{
                if(!userActivated)
                  this.router.navigate(['/login'], {queryParamsHandling: 'preserve'});
              }),);
  }
}
