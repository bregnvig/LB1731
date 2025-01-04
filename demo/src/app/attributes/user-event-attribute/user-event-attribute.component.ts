import { Component, OnInit } from '@angular/core';

import { RotateFlyover } from '../rotate.directive';

@Component({
    selector: 'app-user-event-attribute',
    templateUrl: './user-event-attribute.component.html',
    styleUrls: ['./user-event-attribute.component.css'],
    standalone: true,
    imports: [RotateFlyover]
})
export class UserEventAttributeComponent  {

}
