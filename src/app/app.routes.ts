import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { CalendarioComponent } from './views/calendario/calendario.component';
import { PacienteComponent } from './views/paciente/paciente.component';
import { CitaComponent } from './views/cita/cita.component';

export const routerConfig: Routes = [
    { path: '', redirectTo: 'calendario', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'calendario', component: CalendarioComponent },
    { path: 'calendario/:view', component: CalendarioComponent },
    { path: 'calendario/:view/:date', component: CalendarioComponent },
    { path: 'paciente', component: PacienteComponent },
    { path: 'paciente/:id', component: PacienteComponent },
    { path: 'cita/:id', component: CitaComponent }

]

export const routes: ModuleWithProviders = RouterModule.forRoot(routerConfig);
