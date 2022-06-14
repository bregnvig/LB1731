import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: ':id',
    component: MapComponent,
    canActivate: [AuthGuard],
  },
];

export const AppRoutingModule = RouterModule.forRoot(routes);

