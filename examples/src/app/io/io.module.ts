import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DirectlyComponent, DirectlyChildComponent, IOEventComponent, IOEventChildComponent, InterceptComponent, InterceptChildComponent, LocalComponent, StopwatchComponent, ViewchildComponent, ViewChildrenComponent } from './index';

import { ioRouting } from './io.routing';

@NgModule({
    imports: [CommonModule, FormsModule, ioRouting],
    declarations: [DirectlyComponent, DirectlyChildComponent, IOEventComponent, IOEventChildComponent, InterceptComponent, InterceptChildComponent, LocalComponent, StopwatchComponent, ViewchildComponent, ViewChildrenComponent]
})
export class IOModule {}