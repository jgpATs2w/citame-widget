import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from './app.material.module';
import { DateAdapter } from '@angular/material';
import { CalendarModule } from 'angular-calendar';
import localeEs from '@angular/common/locales/es';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';

import { AuthGuard } from './user/auth.guard';
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
import { EscapeHtmlPipe, EscapeUrlPipe } from './app.pipes';
import {AppRouter} from './app.router';
import {AppState} from './app.state';
import {ApiService} from './api/api.service';

registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    LoginComponent,
    CalendarioComponent,
    PacienteComponent,
    CitaComponent,
    EscapeHtmlPipe, EscapeUrlPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppMaterialModule,
    routes,
    FlexLayoutModule,
    ReactiveFormsModule, FormsModule,
    CalendarModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, 'citame'),
    AngularFireAuthModule
  ],
  providers: [
    AppService,
    ApiService,
    AppState,
    AppRouter,
    {provide: LOCALE_ID, useValue: 'es-ES' },
    UserService,
    AuthGuard, CalendarioGuard,
    CalendarioService,
    EscapeHtmlPipe, EscapeUrlPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
      dateAdapter: DateAdapter<Date>
    ){
      dateAdapter.setLocale('es');
    }

}
