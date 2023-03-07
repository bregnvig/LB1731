import { RouterModule, Routes } from '@angular/router';
import { MenuComponent, MenuPageComponent } from './menu-page';
import { CounterComponent } from './shared/counter/counter.component';

const routes: Routes = [
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
    loadChildren: () => import('../app/components/components.module').then(m => m.ComponentsModule)
  },
  {
    path: 'io',
    loadChildren: () => import('../app/io/io.module').then(m => m.IOModule)
  },
  {
    path: 'services',
    loadChildren: () => import('../app/services/services.module').then(m => m.ServicesModule)
  },
  {
    path: 'async',
    loadChildren: () => import('../app/async/async.module').then(m => m.AsyncModule)
  },
  {
    path: 'pipes',
    loadChildren: () => import('../app/pipes/pipes.module').then(m => m.PipesModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('../app/route/route.module').then(m => m.RouteModule)
  },
  {
    path: 'form',
    loadChildren: () => import('../app/form/form.module').then(m => m.FormModule)
  },
  {
    path: '**',
    redirectTo: 'menu',
    pathMatch: 'full'
  }
];

export const AppRoutingModule = RouterModule.forRoot(routes, {});
