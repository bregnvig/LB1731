import { provideRouter, RouterConfig }  from '@angular/router';

import { MenuComponent } from './menu';
import { HelloComponent, NgifComponent, NgforComponent, InterpolationComponent, PropertyComponent, EventComponent, TwowayComponent } from './components';

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
        path: '',
        redirectTo: '/menu',
        pathMatch: 'full'
    }
];

export const appRouterProviders = [
    provideRouter(routes)
];