import { Component, OnDestroy, inject } from '@angular/core';

import { Subscription } from 'rxjs';

import { SharedTimerService } from '../timer.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-ref-count',
    templateUrl: './ref-count.component.html',
    imports: [DatePipe]
})
export class RefCountComponent implements OnDestroy {

  #subscription1?: Subscription;
  protected date1?: Date;

  #subscription2?: Subscription;
  protected date2?: Date;


  #service = inject(SharedTimerService);

  constructor() { }

  protected start1() {
    this.#subscription1 = this.#service.timer.subscribe(date => this.date1 = date);
  }
  protected start2() {
    this.#subscription2 = this.#service.timer.subscribe(date => this.date2 = date);
  }

  protected stop1() {
    this.#subscription1?.unsubscribe();
  }

  protected stop2() {
    this.#subscription2?.unsubscribe();
  }

  ngOnDestroy() {
    this.#subscription2?.unsubscribe();
    this.#subscription1?.unsubscribe();
  }

}
