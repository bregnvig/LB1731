import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'present', loadComponent: () => import('./player/present.component').then(m => m.PresentComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'present' },
];
