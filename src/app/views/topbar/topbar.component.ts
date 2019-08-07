import { Component, OnInit  } from '@angular/core';

import { User } from '../../user/user.model';
import {AppRouter} from '../../app.router';
import {AppState} from '../../app.state';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  user: User;
  clinica: string;

  constructor(
    private appRouter: AppRouter,
    private appState: AppState
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.user = this.appState.user;
  }

  logout() {
    this.user = null;
    this.appState.reset();
    this.appRouter.navigateCalendario();
  }
    login() {
        this.appRouter.navigateLogin();
    }
}
