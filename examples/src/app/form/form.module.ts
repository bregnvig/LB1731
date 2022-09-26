import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing } from './form.routing';

import { OnewayComponent, PersonForm1Component, PersonForm2Component, PersonForm3Component, PersonForm4Component, PersonForm5Component, PersonForm6Component, PersonForm7Component, SearchFormComponent, TypedFormComponent } from './index';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, routing],
  declarations: [
    PersonForm1Component,
    PersonForm2Component,
    PersonForm3Component,
    PersonForm4Component,
    PersonForm5Component,
    PersonForm6Component,
    PersonForm7Component,
    SearchFormComponent,
    OnewayComponent,
    TypedFormComponent,
  ]
})
export class FormModule { }
