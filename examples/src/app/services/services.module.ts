import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SingletonComponent, NonSingletonComponent, StopwatchErrorComponent, StopwatchLoggerComponent, StopwatchSingletonComponent } from './index';
import { servicesRouting } from './services.routing';

@NgModule({
    imports: [CommonModule, FormsModule, servicesRouting]
})
export class ServicesModule {}