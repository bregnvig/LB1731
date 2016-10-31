import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DirectlyComponent, IOEventComponent, InterceptComponent, LocalComponent, StopwatchComponent, ViewchildComponent, ViewChildrenComponent } from './index';

const routes: Routes = [
    {
        path: 'io/directly',
        component: DirectlyComponent
    },
    {
        path: 'io/intercept',
        component: InterceptComponent
    },
    {
        path: 'io/event',
        component: IOEventComponent
    },
    {
        path: 'io/local',
        component: LocalComponent
    },
    {
        path: 'io/viewchild',
        component: ViewchildComponent
    },
    {
        path: 'io/viewchildren',
        component: ViewChildrenComponent
    }
]

export const ioRouting = RouterModule.forChild(routes);