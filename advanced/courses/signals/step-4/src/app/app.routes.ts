import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/home/home.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: ':id',
    component: HomeComponent,
  },
];