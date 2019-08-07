import {of as observableOf,  Observable } from 'rxjs';

import {map, tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

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
    state: RouterStateSnapshot): boolean {
      const queryParams = state.root.queryParams;
      if (!queryParams.key) {
          this.appService.snack('falta key en la url, contacte con el servicio de citame.click');
        return false;
      }

      this.appService.readQuery(queryParams);

      return true;
  }
}
