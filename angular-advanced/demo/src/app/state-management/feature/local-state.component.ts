import { JsonPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { randMotorcycleManufacturer } from "@ngneat/falso";
import { StateListenerComponent } from "../shared/state-listener/state-listener.component";
import { LocalStateListenerService, StateListenerService } from "../shared/state-listener/state-listener.service";

@Component({
  selector: 'loop-local-state',
  template: `
    <div>
      <h1>Local State</h1>
      <pre>{{ state() | json }}</pre>
    </div>

    <p>Subscribers: {{ listeners() | json }}</p>
    <button class="btn btn-primary" (click)="updateState()">Update State</button>

    @for (name of names; track name) {
      <hr>
      <loop-state-listener [name]="name"/>
    }
  `,
  providers: [
    {
      provide: StateListenerService,
      useClass: LocalStateListenerService,
    }
  ],
  imports: [JsonPipe, StateListenerComponent],
})
export class LocalStateComponent {
  #service = inject(StateListenerService);
  state = this.#service.register();
  listeners = this.#service.listeners;
  names = Array.from(new Array(5)).map((_, i) => `component-${++i}`);

  constructor() {
    console.log('LocalStateComponent constructor');
  }

  updateState() {
    this.#service.setState({ key: randMotorcycleManufacturer() });
  }
} 