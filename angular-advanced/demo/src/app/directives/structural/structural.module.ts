import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { CollapseStateComponent } from './ng-for/collapse-state/collapse-state.component';
import { NgForComponent } from './ng-for/ng-for.component';
import { NgIfComponent } from './ng-if/ng-if.component';
import { NgSwitchComponent } from './ng-switch/ng-switch.component';
import { StructuralComponent } from './structural/structural.component';



@NgModule({
  declarations: [
    NgIfComponent,
    NgForComponent,
    StructuralComponent,
    CollapseStateComponent,
    NgSwitchComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    NgbCollapseModule,
    RouterModule.forChild([
      {
        path: '',
        component: StructuralComponent,
        children: [
          {
            path: 'ng-if',
            component: NgIfComponent
          },
          {
            path: 'ng-for',
            component: NgForComponent
          },
          {
            path: 'ng-switch',
            component: NgSwitchComponent
          },
          {
            path: '**',
            redirectTo: 'ng-if'
          }
        ]
      }
    ])
  ]
})
export class StructuralModule { }
