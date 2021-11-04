import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ParamsComponent } from './params/params.component';
import { RecapComponent } from './recap/recap.component';
import { RoutingComponent } from './routing.component';

@NgModule({
  declarations: [RoutingComponent, ParamsComponent, RecapComponent],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule.forChild([
      {
        path: '',
        component: RoutingComponent,
        children: [
          {
            path: 'recap/:transform',
            component: RecapComponent,
          },
          {
            path: 'params',
            component: ParamsComponent,
          }
        ]
      }
    ])
  ]
})
export class RoutingModule { }
