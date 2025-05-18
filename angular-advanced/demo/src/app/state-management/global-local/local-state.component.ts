import { JsonPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { randMotorcycleManufacturer } from "@ngneat/falso";
import { StateListenerComponent } from "./state-listener.component";
import { provideLocalStateListener, StateListenerService } from "./state-listener.service";

@Component({
  selector: 'loop-local-state',
  template: `
    <div>
      <h1>Local State</h1>
      <pre>{{ state() | json }}</pre>
    </div>

    <p>Subscribers: {{ listeners() | json }}</p>
    <button (click)="updateState()">Update State</button>

    @for (name of names; track name) {
      <hr>
      <loop-state-listener [name]="name"/>
    }
  `,
  providers: [provideLocalStateListener()],
  imports: [JsonPipe, StateListenerComponent],
})
export class LocalStateComponent {
  #service = inject(StateListenerService);
  state = this.#service.register();
  listeners = this.#service.listeners;
  names = Array.from(new Array(5)).map((_, i) => `component-${++i}`);

  updateState() {
    this.#service.setState({ key: randMotorcycleManufacturer() });
  }
} 