import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { JsonComponent } from './json/json.component';
import { PipesComponent } from './pipes/pipes.component';



@NgModule({
  declarations: [
    PipesComponent,
    JsonComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: PipesComponent,
        children: [
          {
            path: 'json',
            component: JsonComponent,
          },
          {
            path: '**',
            redirectTo: 'json'
          }
        ]
      }
    ])
  ]
})
export class PipesModule { }
