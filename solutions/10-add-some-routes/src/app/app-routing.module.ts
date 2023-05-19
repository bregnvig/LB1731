import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {
    path: '',
    component: MapComponent
  },
  {
    path: ':id',
    component: MapComponent
  }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
