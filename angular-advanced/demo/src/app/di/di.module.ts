import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { DIComponent } from './di.component';
import { WithDIComponent } from './with-di/with-di.component';
import { WithoutDIComponent } from './without-di/without-di.component';



@NgModule({
  declarations: [
    WithoutDIComponent,
    DIComponent,
    WithDIComponent
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
            path: '**',
            redirectTo: 'without-di'
          }
        ]
      }
    ])
  ]
})
export class DIModule { }
