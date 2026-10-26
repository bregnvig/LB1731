import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'present', loadComponent: () => import('./player/present.component').then(m => m.PresentComponent) },
  { path: 'presenter', loadComponent: () => import('./presenter/presenter.component').then(m => m.PresenterComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'present' },
];
