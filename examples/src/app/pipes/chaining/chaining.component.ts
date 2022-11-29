import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chaining',
  templateUrl: './chaining.component.html',
})
export class ChainingComponent implements OnInit {

  today = new Date();

  constructor() { }

  ngOnInit() {
  }

}
