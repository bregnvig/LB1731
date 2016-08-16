import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CaseStudyComponent, UnlessComponent, Unless } from './index';

import { structuralRoutes } from './structural.routing';

@NgModule({
    imports: [CommonModule, FormsModule, structuralRoutes],
    declarations: [ CaseStudyComponent, UnlessComponent, Unless]
})
export class StructuralModule { }