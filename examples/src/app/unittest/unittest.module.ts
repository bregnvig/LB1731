import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { routing } from './unittest.routing';

@NgModule({
    imports: [CommonModule, routing],
})
export class UnittestModule {}