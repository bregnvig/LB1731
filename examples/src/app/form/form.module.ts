import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing } from './form.routing';

import { PersonForm1Component, PersonForm2Component, PersonForm3Component, PersonForm4Component, PersonForm5Component, PersonForm6Component, PersonForm7Component, SearchFormComponent, OnewayComponent } from './index';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, routing],
    declarations: [PersonForm1Component, PersonForm2Component, PersonForm3Component, PersonForm4Component, PersonForm5Component, PersonForm6Component, PersonForm7Component, SearchFormComponent, OnewayComponent]
})
export class FormModule {}
