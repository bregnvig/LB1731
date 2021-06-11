import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { ImperativeWayComponent } from './imperative-way/imperative-way.component';
import { MemoryLeakComponent } from './memory-leak/memory-leak.component';
import { RxJSWayComponent } from './rxjs-way/rxjs-way.component';
import { RxJSComponent } from './rxjs.component';


@NgModule({
  declarations: [RxJSComponent, ImperativeWayComponent, RxJSWayComponent, MemoryLeakComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
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
            path: 'memory-leak',
            component: MemoryLeakComponent,
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
