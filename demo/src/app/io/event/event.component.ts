import { Component, output } from '@angular/core';

@Component({
  selector: 'app-io-event-child',
  template: `
    <div class="form-check">
      <input class="form-check-input" name="interval" type="radio" (click)="update('weekly')">
      <label class="form-check-label" for="flexCheckDefault">Weekly</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" name="interval" type="radio" (click)="update('monthly')">
      <label class="form-check-label" for="flexCheckDefault">Monthly</label>
    </div>
  `,
})
export class IOEventChildComponent {
  interval = output<string>();

  update(value: string) {
    this.interval.emit(value);
  }
}

@Component({
  selector: 'app-io-event',
  template: `
    <h2>Child -> parent</h2>
    <app-io-event-child (interval)="interval = $event"></app-io-event-child>
    <p>
      Chosen newsletter {{interval}}
    </p>
  `,
  imports: [IOEventChildComponent]
})
export class IOEventComponent {

  interval?: string;

}
