import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SingletonComponent, NonSingletonComponent, StopwatchErrorComponent, StopwatchLoggerComponent, StopwatchSingletonComponent, StopwatchNonSingletonComponent } from './index';
import { StopwatchService } from './stopwatch.service';
import { servicesRouting } from './services.routing';

@NgModule({
    declarations: [StopwatchSingletonComponent, StopwatchNonSingletonComponent],
    imports: [CommonModule, FormsModule, servicesRouting],
    providers: [StopwatchService]
})
export class ServicesModule {}