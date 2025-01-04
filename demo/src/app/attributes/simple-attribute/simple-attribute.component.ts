import { Component, OnInit } from '@angular/core';

import { Rotate180 } from '../rotate.directive';

@Component({
    selector: 'app-simple-attribute',
    templateUrl: './simple-attribute.component.html',
    styleUrls: ['./simple-attribute.component.css'],
    standalone: true,
    imports: [Rotate180]
})
export class SimpleAttributeComponent {
}
