import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { TimerService } from '../timer.service';

@Component({
  selector: 'app-wrap-api',
  templateUrl: './wrap-api.component.html',
  providers: [TimerService]
})
export class WrapApiComponent implements OnDestroy, OnInit {

  subscription?: Subscription;
  date?: Date;

  constructor(private service: TimerService) {
  }

  ngOnInit() {
    this.subscription = this.service.timer.subscribe(date => this.date = date);
  }

  ngOnDestroy() {
    this.stop();
  }

  stop() {
    this.subscription?.unsubscribe();
  }

}
