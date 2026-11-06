import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guard/auth.guard';

export const AppRoutes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      component: HomeComponent,
      canActivate: [authGuard],
    },
    {
      path: 'login',
      component: LoginComponent,
    }
];
