import { Component, OnInit } from '@angular/core';
import { UpperCasePipe, LowerCasePipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-chaining',
    template: `
      <h2>Chaining</h2>
      <p>
        date & uppercase {{today | date:'mediumDate' | uppercase}}
      </p>
      <p>
        date & lowercase {{today | date | lowercase}}
      </p>
    `,
    imports: [
        UpperCasePipe,
        LowerCasePipe,
        DatePipe,
    ]
})
export class ChainingComponent implements OnInit {

  protected today = new Date();

  constructor() { }

  ngOnInit() {
  }

}
