import { RouterModule, Routes } from '@angular/router';

import { EventComponent, HelloComponent, InnerComponent, InterpolationComponent, NgforComponent, NgifComponent, OuterComponent, PropertyComponent, TwowayComponent } from './index'

const routes: Routes = [
    {
        path: 'components/hello',
        component: HelloComponent
    },
    {
        path: 'components/outer',
        component: OuterComponent
    },
    {
        path: 'components/interpolation',
        component: InterpolationComponent
    },
    {
        path: 'components/property',
        component: PropertyComponent
    },
    {
        path: 'components/event',
        component: EventComponent
    },
    {
        path: 'components/twoway',
        component: TwowayComponent
    },
    {
        path: 'components/ng-if',
        component: NgifComponent
    },
    {
        path: 'components/ng-for',
        component: NgforComponent
    }
];

export const componentsRouting = RouterModule.forChild(routes);