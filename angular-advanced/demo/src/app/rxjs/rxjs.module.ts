import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImperativeWayComponent } from './imperative-way/imperative-way.component';
import { DistancePipe } from './pipe/distance.pipe';
import { RxJSWayComponent } from './rxjs-way/rxjs-way.component';
import { RxJSComponent } from './rxjs.component';


@NgModule({
  declarations: [RxJSComponent, ImperativeWayComponent, RxJSWayComponent, DistancePipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forChild([
      {
        path: '',
        component: RxJSComponent,
        children: [
          {
            path: 'imperative',
            component: ImperativeWayComponent
          },
          {
            path: 'rxjs-way',
            component: RxJSWayComponent,
          },
          {
            path: '**',
            redirectTo: 'imperative'
          }
        ]
      }
    ])
  ]
})
export class RxJSModule { }
