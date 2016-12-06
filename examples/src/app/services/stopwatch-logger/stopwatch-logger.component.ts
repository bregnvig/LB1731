import { Component, OnInit } from '@angular/core';

import { StopwatchSingletonComponent } from '../singleton';
import { LoggerService } from '../logger.service';
import { StopwatchService } from '../stopwatch.service';
import { StopwatchLoggerService } from '../stopwatch-logger.service';

@Component({
  selector: 'app-stopwatch-logger',
  templateUrl: './stopwatch-logger.component.html',
  styleUrls: ['./stopwatch-logger.component.css'],
  providers: [LoggerService, {
    provide: StopwatchService,
    useClass: StopwatchLoggerService
  }]
})
export class StopwatchLoggerComponent {
}
