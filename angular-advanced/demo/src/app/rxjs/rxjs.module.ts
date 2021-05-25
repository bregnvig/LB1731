import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImperativeWayComponent } from './imperative-way/imperative-way.component';


@NgModule({
  declarations: [ImperativeWayComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: 'imperative',
        component: ImperativeWayComponent
      },
      {
        path: '**',
        redirectTo: 'imprrative'
      }
    ])
  ]
})
export class RxJSModule { }
