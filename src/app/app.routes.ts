import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { CalendarioComponent } from './views/calendario/calendario.component';
import { PacienteComponent } from './views/paciente/paciente.component';
import { ErrorComponent } from './views/error/error.component';

import { AuthGuard } from './user/auth.guard';
import { CalendarioGuard } from './calendario/calendario.guard';

export const routerConfig: Routes = [
    { path: '', redirectTo: 'calendario', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'calendario', component: CalendarioComponent, canActivate: [CalendarioGuard] },
    { path: 'calendario/:view', component: CalendarioComponent, canActivate: [CalendarioGuard] },
    { path: 'calendario/:view/:date', component: CalendarioComponent, canActivate: [CalendarioGuard] },
    { path: 'paciente', component: PacienteComponent, canActivate: [AuthGuard] },
    { path: 'paciente/:id', component: PacienteComponent, canActivate: [AuthGuard] },
    { path: 'error', component: ErrorComponent }

]

export const routes: ModuleWithProviders = RouterModule.forRoot(routerConfig);
