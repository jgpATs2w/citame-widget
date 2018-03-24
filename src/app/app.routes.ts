import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';

//import { AuthGuard } from './user/auth.guard';

export const routerConfig: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }
]

export const routes: ModuleWithProviders = RouterModule.forRoot(routerConfig);
