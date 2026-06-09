import { Component, OnInit } from '@angular/core';

import { Rotate180 } from '../rotate.directive';

@Component({
    selector: 'app-simple-attribute',
    templateUrl: './simple-attribute.component.html',
    imports: [Rotate180]
})
export class SimpleAttributeComponent {
}
