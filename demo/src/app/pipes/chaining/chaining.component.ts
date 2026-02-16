import { Component, OnInit } from '@angular/core';
import { UpperCasePipe, LowerCasePipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-chaining',
    templateUrl: './chaining.component.html',
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
