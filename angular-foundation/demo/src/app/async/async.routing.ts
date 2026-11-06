import { Routes } from '@angular/router';

import { CatchErrorComponent } from './catch-error/catch-error.component';
import { AutoRefreshComponent, BetterAsyncServiceComponent, CachedAsyncServiceComponent, ErrorComponent, IntervalComponent, RefCountComponent, RetryWhenComponent, SimpleHttpServiceComponent } from './index';

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
    path: 'localStorage',
    component: CatchErrorComponent
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
    path: 'refCount',
    component: RefCountComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  }
];

export const AsyncRouting = routes;
