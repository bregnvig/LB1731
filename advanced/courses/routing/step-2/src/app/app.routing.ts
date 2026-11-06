import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: MapComponent,
  },
  {
    path: ':id',
    component: MapComponent,
  },
];
