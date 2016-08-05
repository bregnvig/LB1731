import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TimerService } from '../timer.service';

@Component({
  moduleId: module.id,
  selector: 'app-wrap-api',
  templateUrl: 'wrap-api.component.html',
  styleUrls: ['wrap-api.component.css'],
  providers: [TimerService]
})
export class WrapApiComponent {

  public subscription:Subscription;
  public date: Date;

  constructor(service: TimerService) {
     this.subscription = service.timer.subscribe(date => this.date = date);
  }

  public stop() {
    this.subscription.unsubscribe();
  }

}
