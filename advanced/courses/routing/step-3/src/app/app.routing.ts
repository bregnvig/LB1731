import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, Routes } from '@angular/router';
import { first, map } from 'rxjs';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { AuthService } from './service';

const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const service = inject(AuthService);
  const router = inject(Router);
  return service.isLoggedIn$.pipe(
    first(),
    map(isLoggedIn => isLoggedIn || router.createUrlTree(['/login', { returnUrl: route.url }])),
  );
};

export const AppRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    canActivate: [authGuard],
    component: MapComponent,
  },
  {
    path: ':id',
    canActivate: [authGuard],
    component: MapComponent,
  },
];
