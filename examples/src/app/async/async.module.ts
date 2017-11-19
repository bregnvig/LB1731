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

import { F1SimpleService, F1BetterService, F1CachedService, F1AutoRefreshService } from './f1.service';
import { TimerService, SharedTimerService } from './timer.service';

import { asyncRouting } from './async.routing';
import { IntervalComponent } from './interval/interval.component';
import { RetryWhenComponent } from './retry-when/retry-when.component';
import { RetryService } from './retry.service';

@NgModule({
    imports: [CommonModule, HttpClientModule, FormsModule, asyncRouting],
    declarations: [
        SimpleHttpServiceComponent,
        BetterAsyncServiceComponent,
        CachedAsyncServiceComponent,
        AutoRefreshComponent,
        RefCountComponent,
        WrapApiComponent,
        ErrorComponent,
        IntervalComponent,
        RetryWhenComponent],
    providers: [F1SimpleService, F1BetterService, F1CachedService, F1AutoRefreshService, SharedTimerService, RetryService]
})
export class AsyncModule { }
