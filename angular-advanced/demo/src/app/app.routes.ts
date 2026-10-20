import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'rxjs',
    loadChildren: () => import('./rxjs/rxjs.module').then(m => m.RxJSModule)
  },
  {
    path: 'di',
    loadChildren: () => import('./di/di.module').then(m => m.DIModule)
  },
  {
    path: 'components',
    loadChildren: () => import('./components/components.routes').then(m => m.ComponentsRoutes)
  },
  {
    path: 'reactive-forms',
    loadChildren: () => import('./reactive-forms/reactive-forms.module').then(m => m.ReactiveFormsModule)
  },
  {
    path: 'routing',
    loadChildren: () => import('./routing/routing.module').then(m => m.RoutingModule)
  },
  {
    path: 'signals',
    loadChildren: () => import('./signals/signals-routes').then(m => m.SignalsRoutes)
  },
  {
    path: 'pipes',
    data: {
      preload: false
    },
    loadChildren: () => import('./pipes/pipes.module').then(m => m.PipesModule)
  },
  {
    path: 'directives',
    children: [
      {
        path: 'attribute',
        loadChildren: () => import('./directives/attribute/attribute.module').then(m => m.AttributeModule)
      },
      {
        path: 'structural',
        loadChildren: () => import('./directives/structural/structural.module').then(m => m.StructuralModule)
      },
    ]
  },
  {
    path: 'state-management',
    loadChildren: () => import('./state-management/state-management.routes').then(m => m.StateManagementRoutes)
  },
  {
    path: '**',
    redirectTo: 'rxjs'
  }
];
