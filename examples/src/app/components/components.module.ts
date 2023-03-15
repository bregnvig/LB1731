import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsRoutingModule } from './components.routing';
import { EventComponent, HelloComponent, InnerComponent, InterpolationComponent, NgforComponent, NgifComponent, OuterComponent, PropertyComponent, TwowayComponent } from './index';


@NgModule({
  declarations: [
    EventComponent,
    HelloComponent,
    InnerComponent,
    InterpolationComponent,
    NgforComponent,
    NgifComponent,
    OuterComponent,
    PropertyComponent,
    TwowayComponent
  ],
  imports: [CommonModule, FormsModule, ComponentsRoutingModule],
})
export class ComponentsModule { }