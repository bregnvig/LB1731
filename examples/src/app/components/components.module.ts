import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EventComponent, HelloComponent, InnerComponent, InterpolationComponent, NgforComponent, NgifComponent, OuterComponent, PropertyComponent, TwowayComponent } from './index'
import { componentsRouting } from './components.routing';

@NgModule({
    declarations: [EventComponent, HelloComponent, InnerComponent, InterpolationComponent, NgforComponent, NgifComponent, OuterComponent, PropertyComponent, TwowayComponent],
    imports: [CommonModule, FormsModule, componentsRouting],
})
export class ComponentsModule {}