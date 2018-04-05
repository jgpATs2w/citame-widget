import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { NgReduxModule, NgRedux, DevToolsExtension }  from '@angular-redux/store';
import { applyMiddleware } from 'redux'
import * as persistState from 'redux-localstorage';
import { createLogger } from 'redux-logger';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';
import { registerLocaleData } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from './app.material.module';
import { DateAdapter } from '@angular/material';
import { CalendarModule } from 'angular-calendar';
import localeEs from '@angular/common/locales/es';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';
import { AppState, INITIAL_STATE, rootReducer } from './app.store';
import { UserActions, CalendarioActions } from './app.actions';
import { UserEpics, CalendarioEpics } from './app.epics';

import { AuthGuard } from './user/auth.guard';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { CalendarioService } from './calendario/calendario.service';
import { CalendarioGuard } from './calendario/calendario.guard';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { TopbarComponent } from './views/topbar/topbar.component';
import { LogoutDialog} from './views/topbar/topbar.component';
import { LoginComponent } from './views/login/login.component';
import { CalendarioComponent } from './views/calendario/calendario.component';
import { PacienteComponent } from './views/paciente/paciente.component';
import { ErrorComponent } from './views/error/error.component';

registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    LogoutDialog,
    LoginComponent,
    CalendarioComponent,
    PacienteComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppMaterialModule,
    routes,
    FlexLayoutModule,
    ReactiveFormsModule,
    CalendarModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, 'citame'),
    AngularFireAuthModule,
    NgReduxModule
  ],
  entryComponents: [
    LogoutDialog
  ],
  providers: [
    AppService,
    {provide: LOCALE_ID, useValue: 'es-ES' },
    UserService,
    AuthGuard, CalendarioGuard,
    CalendarioService,
    UserActions, CalendarioActions,
    UserEpics, CalendarioEpics
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
      ngRedux: NgRedux<AppState>,
      devTools: DevToolsExtension,
      userEpics: UserEpics, calendarioEpics: CalendarioEpics,
      dateAdapter: DateAdapter<Date>
    ){
      const enhancers = [persistState('',{key:'redux-citame-widget'})]
      if(devTools.isEnabled && environment.reduxDevTools)
        enhancers.push(devTools.enhancer());
      const middleware= [
        //createLogger(),
        ...userEpics.getEpics(),
        ...calendarioEpics.getEpics()
      ];

      ngRedux.configureStore(
        rootReducer,
        INITIAL_STATE,
        middleware,
        enhancers
      );

      dateAdapter.setLocale('es');
    }

}
