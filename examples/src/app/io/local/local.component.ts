import { Component } from '@angular/core';
import { StopwatchComponent } from '../stopwatch/stopwatch.component';

@Component({
    selector: 'app-local',
    templateUrl: './local.component.html',
    standalone: true,
    imports: [StopwatchComponent],
})
export class LocalComponent {
}
