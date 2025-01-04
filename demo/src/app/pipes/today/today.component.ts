import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-today',
    templateUrl: './today.component.html',
    standalone: true,
    imports: [DatePipe],
})
export class TodayComponent implements OnInit {

  today = new Date();

  constructor() { }

  ngOnInit() {
  }

}
