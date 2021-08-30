import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { DIComponent } from './di.component';
import { DaLocaleComponent } from './locale/da-locale.component';
import { DefaultLocaleComponent } from './locale/default-locale.component';
import { LocaleComponent } from './locale/locale.component';
import { RandomListComponent } from './random-list/random-list.component';
import { RandomWrapperComponent } from './random-list/random-wrapper.component';
import { RandomComponent } from './random/random.component';
import { WithDIComponent } from './with-di/with-di.component';
import { WithoutDIComponent } from './without-di/without-di.component';



@NgModule({
  declarations: [
    WithoutDIComponent,
    DIComponent,
    WithDIComponent,
    RandomComponent,
    RandomListComponent,
    RandomWrapperComponent,
    LocaleComponent,
    DefaultLocaleComponent,
    DaLocaleComponent,
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
            path: 'locale',
            component: LocaleComponent,
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
