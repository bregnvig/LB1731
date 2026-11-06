import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/home/home.component';
import { PlaygroundDetailComponent } from 'src/app/playground-detail/playground-detail.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'legeplads/:id',
    component: PlaygroundDetailComponent,
  },
  {
    path: ':id',
    component: HomeComponent,
  },
];
