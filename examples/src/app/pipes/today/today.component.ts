import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
})
export class TodayComponent implements OnInit {

  today = new Date();

  constructor() { }

  ngOnInit() {
  }

}
