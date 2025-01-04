import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { SharedTimerService } from '../timer.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-ref-count',
    templateUrl: './ref-count.component.html',
    imports: [DatePipe]
})
export class RefCountComponent implements OnDestroy {

  subscription1?: Subscription;
  date1?: Date;

  subscription2?: Subscription;
  date2?: Date;


  constructor(private service: SharedTimerService) { }

  start1() {
    this.subscription1 = this.service.timer.subscribe(date => this.date1 = date);
  }
  start2() {
    this.subscription2 = this.service.timer.subscribe(date => this.date2 = date);
  }

  stop1() {
    this.subscription1?.unsubscribe();
  }

  stop2() {
    this.subscription2?.unsubscribe();
  }

  ngOnDestroy() {
    this.subscription2?.unsubscribe();
    this.subscription1?.unsubscribe();
  }

}
