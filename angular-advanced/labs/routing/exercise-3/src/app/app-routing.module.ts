import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { map } from 'rxjs';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { AuthService } from './service';

const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  return inject(AuthService).isLoggedIn$.pipe(
    map(isLoggedIn => isLoggedIn || router.createUrlTree(['/login', { returnUrl: state.url }])),
  );
};


const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: ':id',
    component: MapComponent,
    canActivate: [authGuard],
  },
];

export const AppRoutingModule = RouterModule.forRoot(routes);

