import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { SharedTimerService } from '../timer.service';

@Component({
  selector: 'app-ref-count',
  templateUrl: './ref-count.component.html',
  styleUrls: ['./ref-count.component.css'],
})
export class RefCountComponent implements OnDestroy {

  public subscription1: Subscription;
  public date1: Date;

  public subscription2: Subscription;
  public date2: Date;


  constructor(private service: SharedTimerService) { }

  start1() {
    this.subscription1 = this.service.timer.subscribe(date => this.date1 = date);
  }
  start2() {
    this.subscription2 = this.service.timer.subscribe(date => this.date2 = date);
  }

  stop1() {
    this.subscription1.unsubscribe();
  }

  stop2() {
    this.subscription2.unsubscribe();
  }

  public ngOnDestroy() {
  // if (this.subscription2) {
  //     this.subscription2.unsubscribe();
  //   }
  //   if (this.subscription1) {
  //     this.subscription1.unsubscribe();
  //   }
  }

}
