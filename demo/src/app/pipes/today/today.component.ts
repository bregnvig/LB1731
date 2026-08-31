import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-today',
    template: `
      <h2>Today</h2>
      <p>
        Today is {{today}}
      </p>
      <p>
        Today is {{today | date}}
      </p>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [DatePipe]
})
export class TodayComponent implements OnInit {

  protected today = new Date();

  constructor() { }

  ngOnInit() {
  }

}
