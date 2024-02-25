import { Routes } from '@angular/router';
import { MenuPageComponent } from './menu-page';
import { CounterComponent } from './shared/counter/counter.component';

export const AppRouting: Routes = [
  {
    path: 'menu',
    component: MenuPageComponent
  },
  {
    path: 'counter',
    component: CounterComponent
  },
  {
    path: 'components',
    loadChildren: () => import('../app/components/components.routing').then(m => m.ComponentsRouting)
  },
  {
    path: 'io',
    loadChildren: () => import('../app/io/io.routing').then(m => m.IORouting)
  },
  {
    path: 'services',
    loadChildren: () => import('../app/services/services.routing').then(m => m.ServicesRouting)
  },
  {
    path: 'async',
    loadChildren: () => import('../app/async/async.module').then(m => m.AsyncModule)
  },
  {
    path: 'pipes',
    loadChildren: () => import('../app/pipes/pipes.routing').then(m => m.PipesRouting)
  },
  {
    path: 'orders',
    loadChildren: () => import('../app/route/routes-routing').then(m => m.RoutesRouting)
  },
  {
    path: 'form',
    loadChildren: () => import('../app/form/forms-routing').then(m => m.FormsRouting)
  },
  {
    path: '**',
    redirectTo: 'menu',
    pathMatch: 'full'
  }
];

