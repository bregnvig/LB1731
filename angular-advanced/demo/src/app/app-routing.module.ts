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
    path: '**',
    redirectTo: 'rxjs'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
