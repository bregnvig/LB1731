import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { routing } from './unittest.routing';

import { HelloWorldComponent } from './index';

@NgModule({
    declarations: [HelloWorldComponent],
    imports: [CommonModule, routing],
})
export class UnittestModule { }