import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/home/home.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'legeplads/:id',
    loadComponent: () => import('src/app/playground-detail/playground-detail.component').then(m => m.PlaygroundDetailComponent),
  },
  {
    path: ':id',
    component: HomeComponent,
  },
];
