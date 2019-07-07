import { Component, OnInit, OnDestroy } from '@angular/core';
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';

import { AppService } from '../../app.service';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user.model';
import { CalendarioService } from '../../calendario/calendario.service';
import { Cita } from '../../api/cita.model';
import { AppRouter } from '../../app.router';
import {ApiService} from '../../api/api.service';
import {AppState} from '../../app.state';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent implements OnInit, OnDestroy {
  id: string;
  cita: Cita;
  times: string[];

  currentUser: User;
  deleted = false;

  routeSubscription: Subscription = null;
  formSubscription: Subscription = null;
  timeEndSubscription: Subscription = null;

  constructor(
    private appRouter: AppRouter,
    private appService: AppService,
    private apiService: ApiService,
    private appState: AppState,
    private calendarioService: CalendarioService,
    private userService: UserService,
    private location: Location
    ) {

      this.times = calendarioService.times;
    }

    ngOnInit() {
      window.scrollTo(0, 0);
      const params = this.appRouter.getParams();

        if (params.id) {
            this.id = params.id;
            this.appService
                .apiGet(`/citas/${this.id}.json`)
                .subscribe(r => {
                    if (r.success) {
                        this.cita = r.data;
                    } else {
                        this.appService.snack(r.message);
                    }
                });
        } else {
            this.appRouter.navigateCalendario();
        }
      this.currentUser = this.appState.user;
    }

    ngOnDestroy() {
      if (this.routeSubscription) {
        this.routeSubscription.unsubscribe();
      }
      if (this.formSubscription) {
        this.formSubscription.unsubscribe();
      }
      if (this.timeEndSubscription) {
        this.timeEndSubscription.unsubscribe();
      }
    }

    close() {
      this.location.back();
    }
    delete() {
        this.apiService.deleteCita$(this.cita).subscribe(r => {
            if (r.success) {
                this.appService.snack('cita eliminada');
            }
        });
        this.close();

    }

    ///

}
