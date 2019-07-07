import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { CalendarioComponent } from './views/calendario/calendario.component';
import { PacienteComponent } from './views/paciente/paciente.component';
import { CitaComponent } from './views/cita/cita.component';

import { AuthGuard } from './user/auth.guard';
import { LoginGuard } from './user/login.guard';
import { CalendarioGuard } from './calendario/calendario.guard';

export const routerConfig: Routes = [
    { path: '', redirectTo: 'calendario', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'calendario', component: CalendarioComponent, canActivate: [CalendarioGuard] },
    { path: 'calendario/:view', component: CalendarioComponent, canActivate: [CalendarioGuard] },
    { path: 'calendario/:view/:date', component: CalendarioComponent, canActivate: [CalendarioGuard] },
    { path: 'paciente', component: PacienteComponent, canActivate: [AuthGuard] },
    { path: 'paciente/:id', component: PacienteComponent, canActivate: [AuthGuard] },
    { path: 'cita/:id', component: CitaComponent, canActivate: [AuthGuard] }

]

export const routes: ModuleWithProviders = RouterModule.forRoot(routerConfig);
