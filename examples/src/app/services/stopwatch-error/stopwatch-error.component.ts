import { Component, OnInit } from '@angular/core';
import { StopwatchService } from '../stopwatch.service';

@Component({
  moduleId: module.id,
  selector: 'app-stopwatch-error',
  templateUrl: 'stopwatch-error.component.html',
  styleUrls: ['stopwatch-error.component.css']
})
export class StopwatchErrorComponent {
  constructor(public stopwatch: StopwatchService) { }
}
