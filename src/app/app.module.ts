import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { NgReduxModule, NgRedux, DevToolsExtension }  from '@angular-redux/store';
import { applyMiddleware } from 'redux'
import * as persistState from 'redux-localstorage';
import { createLogger } from 'redux-logger';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

import { AuthGuard } from './user/auth.guard';
import { LoginGuard } from './user/login.guard';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { CalendarioService } from './calendario/calendario.service';
import { CalendarioGuard } from './calendario/calendario.guard';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { TopbarComponent } from './views/topbar/topbar.component';
import { LoginComponent } from './views/login/login.component';
import { CalendarioComponent } from './views/calendario/calendario.component';
import { PacienteComponent } from './views/paciente/paciente.component';
import { CitaComponent } from './views/cita/cita.component';
import { ErrorComponent } from './views/error/error.component';
import { EscapeHtmlPipe, EscapeUrlPipe } from './app.pipes';

registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    LoginComponent,
    CalendarioComponent,
    PacienteComponent,
    CitaComponent,
    ErrorComponent,
    EscapeHtmlPipe, EscapeUrlPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppMaterialModule,
    routes,
    FlexLayoutModule,
    ReactiveFormsModule, FormsModule,
    CalendarModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, 'citame'),
    AngularFireAuthModule,
    NgReduxModule
  ],
  providers: [
    AppService,
    {provide: LOCALE_ID, useValue: 'es-ES' },
    UserService,
    AuthGuard, CalendarioGuard, LoginGuard,
    CalendarioService,
    UserActions, CalendarioActions,
    EscapeHtmlPipe, EscapeUrlPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
      ngRedux: NgRedux<AppState>,
      devTools: DevToolsExtension,
      dateAdapter: DateAdapter<Date>
    ){
      const enhancers = [persistState('',{key:'redux-citame-widget'})]
      //if(devTools.isEnabled && !environment.production)
        //enhancers.push(devTools.enhancer());
      const middleware= [
        //createLogger(),
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
