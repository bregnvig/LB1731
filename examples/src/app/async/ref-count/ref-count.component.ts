import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { SharedTimerService } from '../timer.service';

@Component({
  selector: 'app-ref-count',
  templateUrl: './ref-count.component.html',
  styleUrls: ['./ref-count.component.css'],
})
export class RefCountComponent {

  public subscription1:Subscription;
  public date1: Date;

  public subscription2:Subscription;
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

}
