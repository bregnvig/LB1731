import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BuildInComponent, ChainingComponent, PhoneComponent, PureComponent, TodayComponent, PurePipe, ImpurePipe, PhonePipe } from './index';

import { routing } from './pipes.routing';

@NgModule({
    imports: [CommonModule, FormsModule, routing],
    declarations: [BuildInComponent, ChainingComponent, PhoneComponent, PureComponent, TodayComponent, PurePipe, ImpurePipe, PhonePipe]
})
export class PipesModule { }