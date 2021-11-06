import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'playground',
  },
  {
    path: 'playground',
    component: MapComponent,
  },
  {
    path: 'playground/:id',
    component: MapComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
