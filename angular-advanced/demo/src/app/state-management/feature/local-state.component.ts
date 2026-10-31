import { JsonPipe } from "@angular/common";
import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { randMotorcycleManufacturer } from "@ngneat/falso";
import { StateListenerComponent } from "../shared/state-listener/state-listener.component";
import { LocalStateListenerService, StateListenerService } from "../shared/state-listener/state-listener.service";

@Component({
  selector: 'loop-local-state',
  template: `
    <section class="store">
      <div>
        <h1>Local State</h1>
        <pre>{{ state() | json }}</pre>
      </div>

      <div class="store-meta">
        <p>Subscribers: {{ listeners() | json }}</p>
        <button class="btn btn-primary" (click)="updateState()">Update State</button>
      </div>
    </section>

    <div class="bus">
      @for (name of names; track name) {
        <loop-state-listener [name]="name"/>
      }
    </div>
  `,
  styleUrl: './state-page.scss',
  providers: [
    {
      provide: StateListenerService,
      useClass: LocalStateListenerService,
    }
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
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