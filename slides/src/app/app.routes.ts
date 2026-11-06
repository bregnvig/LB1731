import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'present', loadComponent: () => import('./player/present.component').then(m => m.PresentComponent) },
  { path: 'presenter', loadComponent: () => import('./presenter/presenter.component').then(m => m.PresenterComponent) },
  { path: 'edit', loadComponent: () => import('./editor/editor.component').then(m => m.EditorComponent) },
  { path: 'edit/:course/:file', loadComponent: () => import('./editor/editor.component').then(m => m.EditorComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'present' },
];
