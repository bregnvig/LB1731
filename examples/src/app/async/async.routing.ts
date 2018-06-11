import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SimpleHttpServiceComponent, BetterAsyncServiceComponent, CachedAsyncServiceComponent, AutoRefreshComponent, RefCountComponent, WrapApiComponent, ErrorComponent, IntervalComponent, RetryWhenComponent } from './index';

const routes: Routes = [
    {
        path: 'simple',
        component: SimpleHttpServiceComponent
    },
    {
        path: 'better',
        component: BetterAsyncServiceComponent
    },
    {
        path: 'cached',
        component: CachedAsyncServiceComponent
    },
    {
        path: 'retry',
        component: RetryWhenComponent
    },
    {
        path: 'autoRefresh',
        component: AutoRefreshComponent
    },
    {
        path: 'interval',
        component: IntervalComponent
    },
    {
        path: 'wrap',
        component: WrapApiComponent
    },
    {
        path: 'refCount',
        component: RefCountComponent
    },
    {
        path: 'error',
        component: ErrorComponent
    }
]

export const asyncRouting = RouterModule.forChild(routes);
