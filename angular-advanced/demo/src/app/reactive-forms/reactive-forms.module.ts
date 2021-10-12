import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule as RFM } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddressControlComponent } from './custom-controls/address-control/address-control.component';
import { CustomControlsComponent } from './custom-controls/custom-controls.component';
import { FormArrayComponent } from './form-array/form-array.component';
import { ReactiveFormsComponent } from './reactive-forms.component';
import { TopFiveComponent } from './top-five/top-five.component';
import { ErrorMessageComponent } from './validators/error-message/error-message.component';
import { ValidatorsComponent } from './validators/validators.component';

const routes: Routes = [
  {
    path: '',
    component: ReactiveFormsComponent,
    children: [
      {
        path: 'top-5',
        component: TopFiveComponent
      },
      {
        path: 'form-array',
        component: FormArrayComponent
      },
      {
        path: 'validators',
        component: ValidatorsComponent
      },
      {
        path: 'custom-controls',
        component: CustomControlsComponent
      },
    ]
  }
];

@NgModule({
  declarations: [
    ReactiveFormsComponent,
    TopFiveComponent,
    FormArrayComponent,
    ValidatorsComponent,
    ErrorMessageComponent,
    CustomControlsComponent,
    AddressControlComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgbAlertModule,
    RFM,
    RouterModule.forChild(routes),
  ]
})
export class ReactiveFormsModule { }
