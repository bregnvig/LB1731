import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { DIComponent } from './di.component';
import { RandomListComponent } from './random-list/random-list.component';
import { RandomComponent } from './random/random.component';
import { WithDIComponent } from './with-di/with-di.component';
import { WithoutDIComponent } from './without-di/without-di.component';



@NgModule({
  declarations: [
    WithoutDIComponent,
    DIComponent,
    WithDIComponent,
    RandomComponent,
    RandomListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    RouterModule.forChild([
      {
        path: '',
        component: DIComponent,
        children: [
          {
            path: 'without-di',
            component: WithoutDIComponent,
          },
          {
            path: 'with-di',
            component: WithDIComponent,
          },
          {
            path: 'levels',
            component: RandomListComponent,
          },
          {
            path: '**',
            redirectTo: 'without-di'
          }
        ]
      }
    ])
  ]
})
export class DIModule { }
