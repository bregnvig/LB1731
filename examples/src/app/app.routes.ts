import { provideRouter, RouterConfig }  from '@angular/router';

import { MenuComponent } from './menu';
import { HelloComponent, OuterComponent, NgifComponent, NgforComponent, InterpolationComponent, PropertyComponent, EventComponent, TwowayComponent } from './components';

import { DirectlyComponent, InterceptComponent, IOEventComponent, LocalComponent,ViewchildComponent } from './io';

const routes: RouterConfig = [
    {
        path: 'menu',
        component: MenuComponent
    },
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
    },
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
        path: '',
        redirectTo: '/menu',
        pathMatch: 'full'
    }
];

export const appRouterProviders = [
    provideRouter(routes)
];