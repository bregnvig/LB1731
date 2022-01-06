import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { NgForComponent } from './ng-for/ng-for.component';
import { NgIfComponent } from './ng-if/ng-if.component';
import { StructuralComponent } from './structural/structural.component';



@NgModule({
  declarations: [
    NgIfComponent,
    NgForComponent,
    StructuralComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
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
            path: '**',
            redirectTo: 'ng-if'
          }
        ]
      }
    ])
  ]
})
export class StructuralModule { }
