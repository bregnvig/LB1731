import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
    loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule)
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
    path: 'pipes',
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
    path: '**',
    redirectTo: 'rxjs'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
