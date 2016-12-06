import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  public counter = 0;
  public isDown = false;
  constructor() { }

  ngOnInit() {
  }

  public count() {
    this.counter +=1;
  }

  public up() {
    this.isDown = false;
  }

  public down() {
    this.isDown = true;
  }

}
