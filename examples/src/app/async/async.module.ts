import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
    SimpleHttpServiceComponent,
    BetterAsyncServiceComponent,
    CachedAsyncServiceComponent,
    AutoRefreshComponent,
    RefCountComponent,
    WrapApiComponent,
    ErrorComponent
} from './index';

import { F1SimpleService, F1BetterService, F1CachedService, F1AutoRefreshService, F1LocalStorageCache } from './f1.service';
import { TimerService, SharedTimerService } from './timer.service';

import { asyncRouting } from './async.routing';
import { IntervalComponent } from './interval/interval.component';
import { RetryWhenComponent } from './retry-when/retry-when.component';
import { RetryService } from './retry.service';
import { CatchErrorComponent } from './catch-error/catch-error.component';

@NgModule({
    imports: [CommonModule, HttpClientModule, FormsModule, asyncRouting, SimpleHttpServiceComponent,
        BetterAsyncServiceComponent,
        CachedAsyncServiceComponent,
        AutoRefreshComponent,
        RefCountComponent,
        WrapApiComponent,
        ErrorComponent,
        IntervalComponent,
        RetryWhenComponent,
        CatchErrorComponent],
    providers: [
        F1SimpleService,
        F1BetterService,
        F1CachedService,
        F1AutoRefreshService,
        F1LocalStorageCache,
        SharedTimerService,
        RetryService
    ]
})
export class AsyncModule { }
