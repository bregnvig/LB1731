import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing } from './form.routing';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, routing],
    declarations: []
})
export class FormModule {}