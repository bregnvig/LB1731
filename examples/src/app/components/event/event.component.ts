import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

   counter = 0;
   isDown = false;
  constructor() { }

  ngOnInit() {
  }

   count() {
    this.counter += 1;
  }

   up() {
    this.isDown = false;
  }

   down() {
    this.isDown = true;
  }

}
