import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BindingAttributeComponent, BindingsAttributeComponent, SimpleAttributeComponent, UserEventAttributeComponent, Rotate180, RotateFlyover, RotateFlyover2, RotateFlyover3 } from './index';

import { attributesRoutes } from './attributes.routing';

@NgModule({
    imports: [CommonModule, FormsModule, attributesRoutes],
    declarations: [BindingAttributeComponent, BindingsAttributeComponent, SimpleAttributeComponent, UserEventAttributeComponent, Rotate180, RotateFlyover, RotateFlyover2, RotateFlyover3]
})
export class AttributesModule {}