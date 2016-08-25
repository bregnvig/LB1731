import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { SimpleHttpServiceComponent, BetterAsyncServiceComponent, CachedAsyncServiceComponent, RefCountComponent, WrapApiComponent } from './index';

import { F1SimpleService, F1BetterService, F1CachedService } from './f1.service';
import { TimerService, SharedTimerService } from './timer.service';

import { asyncRouting } from './async.routing';

@NgModule({
    imports: [CommonModule, HttpModule, FormsModule, asyncRouting],
    declarations: [SimpleHttpServiceComponent, BetterAsyncServiceComponent, CachedAsyncServiceComponent, RefCountComponent, WrapApiComponent],
    providers: [F1SimpleService, F1BetterService, F1CachedService]
})
export class AsyncModule { }