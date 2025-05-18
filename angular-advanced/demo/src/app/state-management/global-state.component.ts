import { JsonPipe } from "@angular/common";
import { Component, inject, OnDestroy } from "@angular/core";
import { randMotorcycleManufacturer } from "@ngneat/falso";
import { StateListenerComponent } from "./state-listener/state-listener.component";
import { StateListenerService } from "./state-listener/state-listener.service";


@Component({
  selector: 'loop-global-state',
  template: `
    <div>
      <h1>Global State</h1>
      <pre>{{ state() | json }}</pre>
    </div>

    <p>Subscribers: {{ listeners() | json }}</p>
    <button (click)="updateState()">Update State</button>

    @for (name of names; track name) {
      <hr>
      <loop-state-listener [name]="name"/>
    }
  `,
  imports: [JsonPipe, StateListenerComponent],
})
export class GlobalStateComponent implements OnDestroy {
  #service = inject(StateListenerService);
  state = this.#service.register();
  listeners = this.#service.listeners;
  names = Array.from(new Array(5)).map((_, i) => `component-${++i}`);

  updateState() {
    this.#service.setState({ key: randMotorcycleManufacturer() });
  }

  // We need cleanup every time like this if we insist on using global state.
  ngOnDestroy() {
    // Uncomment line below and navigate away and back to global-state route to see listeners cleared. 
    // this.#service.clear();
  }
} 