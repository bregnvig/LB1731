import { Component, OnInit } from '@angular/core';

import { RotateFlyover } from '../rotate.directive';

@Component({
  moduleId: module.id,
  selector: 'app-user-event-attribute',
  templateUrl: 'user-event-attribute.component.html',
  styleUrls: ['user-event-attribute.component.css'],
  directives: [RotateFlyover]
})
export class UserEventAttributeComponent  {

}
