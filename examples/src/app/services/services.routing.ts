import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SingletonComponent, NonSingletonComponent, StopwatchErrorComponent, StopwatchLoggerComponent, StopwatchSingletonComponent } from './index';

const routes: Routes = [
    {
        path: 'services/no-provider',
        component: StopwatchErrorComponent
    },
    {
        path: 'services/singleton',
        component: SingletonComponent
    },
    {
        path: 'services/non-singleton',
        component: NonSingletonComponent
    },
    {
        path: 'services/service-with-service',
        component: StopwatchLoggerComponent
    }
]

export const servicesRouting = RouterModule.forChild(routes);