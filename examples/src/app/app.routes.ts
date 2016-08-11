import { provideRouter, RouterConfig }  from '@angular/router';

import { MenuComponent } from './menu';
import { HelloComponent, OuterComponent, NgifComponent, NgforComponent, InterpolationComponent, PropertyComponent, EventComponent, TwowayComponent } from './components';

import { DirectlyComponent, InterceptComponent, IOEventComponent, LocalComponent,ViewchildComponent } from './io';

import { StopwatchErrorComponent, SingletonComponent, NonSingletonComponent, StopwatchLoggerComponent } from './services';

import { SimpleHttpServiceComponent, BetterAsyncServiceComponent, CachedAsyncServiceComponent, WrapApiComponent, RefCountComponent } from './async';

import { TodayComponent, BuildInComponent, ChainingComponent, PhoneComponent, PureComponent } from './pipes';

import { SimpleAttributeComponent, UserEventAttributeComponent, BindingAttributeComponent, BindingsAttributeComponent } from './attributes';

import { CaseStudyComponent, UnlessComponent } from './structural';

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
    },
    {
        path: 'async/simple',
        component: SimpleHttpServiceComponent
    },
    {
        path: 'async/better',
        component: BetterAsyncServiceComponent
    },
    {
        path: 'async/cached',
        component: CachedAsyncServiceComponent
    },
    {
        path: 'async/wrap',
        component: WrapApiComponent
    },
    {
        path: 'async/refCount',
        component: RefCountComponent
    },
    {
        path: 'pipes/today',
        component: TodayComponent
    },
    {
        path: 'pipes/buildin',
        component: BuildInComponent
    },
    {
        path: 'pipes/chaining',
        component: ChainingComponent
    },
    {
        path: 'pipes/phone',
        component: PhoneComponent
    },
    {
        path: 'pipes/pure',
        component: PureComponent
    },
    {
        path: 'attributes/simple',
        component: SimpleAttributeComponent
    },
    {
        path: 'attributes/user-event',
        component: UserEventAttributeComponent
    },
    {
        path: 'attributes/binding',
        component: BindingAttributeComponent
    },
    {
        path: 'attributes/bindings',
        component: BindingsAttributeComponent
    },
    {
        path: 'structural/case-study',
        component: CaseStudyComponent
    },
    {
        path: 'structural/unless',
        component: UnlessComponent
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