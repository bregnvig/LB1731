import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SimpleHttpServiceComponent, BetterAsyncServiceComponent, CachedAsyncServiceComponent, AutoRefreshComponent, RefCountComponent, WrapApiComponent, ErrorComponent, IntervalComponent, RetryWhenComponent } from './index';

const routes: Routes = [
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
        path: 'async/retry',
        component: RetryWhenComponent
    },
    {
        path: 'async/autoRefresh',
        component: AutoRefreshComponent
    },
    {
        path: 'async/interval',
        component: IntervalComponent
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
        path: 'async/error',
        component: ErrorComponent
    }
]

export const asyncRouting = RouterModule.forChild(routes);