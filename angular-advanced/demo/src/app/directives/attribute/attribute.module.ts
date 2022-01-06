import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { AttributeComponent } from './attribute/attribute.component';
import { FocusEmptyComponent } from './focus-empty/focus-empty.component';
import { SelectAllComponent } from './select-all/select-all.component';



@NgModule({
  declarations: [
    AttributeComponent,
    SelectAllComponent,
    FocusEmptyComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgbModule,
    NgbToastModule,
    RouterModule.forChild([
      {
        path: '',
        component: AttributeComponent,
        children: [
          {
            path: 'select-all',
            component: SelectAllComponent
          },
          {
            path: 'focus-empty',
            component: FocusEmptyComponent
          },
          {
            path: '**',
            redirectTo: 'select-all'
          }
        ]
      }
    ])
  ]
})
export class AttributeModule { }
