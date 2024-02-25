import { Component } from '@angular/core';

@Component({
    selector: 'app-event',
    template: `
    <h2>(event)</h2>
    <ul class="list-group">
      <li class="list-group-item"><button class="btn btn-primary"(click)="count()">Clicked {{counter}} times</button></li>
      <li class="list-group-item">
        <input class="form-control" (keydown.enter)="down()" (keyup)="up()">
        <p>{{isDown ? 'Key is down' : 'Key is up!'}}</p>
      </li>
    </ul>
  `,
    standalone: true
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
