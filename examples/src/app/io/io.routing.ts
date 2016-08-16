import { RouterModule, Routes } from '@angular/router';

import { DirectlyComponent, IOEventComponent, InterceptComponent, LocalComponent, StopwatchComponent, ViewchildComponent } from './index';

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
    }
]

export const ioRouting = RouterModule.forChild(routes);