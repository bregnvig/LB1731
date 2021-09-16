import { Component } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html'
})
export class EventComponent {

  counter = 0;
  isDown = false;

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
