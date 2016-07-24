import { Component, OnInit } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';

@Component({
  moduleId: module.id,
  selector: 'app-local',
  templateUrl: 'local.component.html',
  styleUrls: ['local.component.css'],
  directives: [StopwatchComponent]
})
export class LocalComponent {
}
