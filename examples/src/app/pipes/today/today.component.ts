import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-today',
  templateUrl: 'today.component.html',
  styleUrls: ['today.component.css']
})
export class TodayComponent implements OnInit {

  public today = new Date();

  constructor() { }

  ngOnInit() {
  }

}
