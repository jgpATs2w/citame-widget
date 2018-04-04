import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { NgRedux, select } from '@angular-redux/store';
import { UserActions } from './user.actions';
import { UsersState } from './users.reducer';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
      private userService: UserService,
      private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

      return this.userService.currentUser$
              .map(currentUser=>currentUser!=null)
              .do((userActivated:boolean)=>{
                if(!userActivated)
                  this.router.navigate(['/login'], {queryParamsHandling: 'preserve'});
              });
  }
}
