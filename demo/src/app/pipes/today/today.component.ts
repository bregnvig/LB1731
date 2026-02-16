import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-today',
    templateUrl: './today.component.html',
    imports: [DatePipe]
})
export class TodayComponent implements OnInit {

  protected today = new Date();

  constructor() { }

  ngOnInit() {
  }

}
