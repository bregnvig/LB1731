import { Component, OnDestroy, inject } from '@angular/core';

import { Subscription } from 'rxjs';

import { SharedTimerService } from '../timer.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-ref-count',
    template: `
      <h2>Ref count</h2>
      <div class="row g-3">
        <span class="col">{{date1 | date:'HH:mm:ss'}}</span>
        <button class="col-auto btn btn-primary me-3" (click)="start1()">Start timer</button>
        <button class="col-auto btn btn-primary" (click)="stop1()">Stop timer</button>
      </div>
      <div class="row g-3 mt-3">
        <span class="col">{{date2 | date:'HH:mm:ss'}}</span>
        <button class="col-auto btn btn-primary me-3" (click)="start2()">Start timer</button>
        <button class="col-auto btn btn-primary" (click)="stop2()">Stop timer</button>
      </div>
    `,
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
