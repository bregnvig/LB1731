import { JsonPipe } from "@angular/common";
import { Component, computed, inject, Injectable, input, OnDestroy, Signal, signal } from "@angular/core";
import { randDomainName, randMotorcycleManufacturer } from "@ngneat/falso";

// This file is an example of how global state is shared across the application.

// This is a service provided in the root injector, making it accessible application-wide.
// It exposes a state and also keeps a list of who is using it so that they can be displayed in the UI.
@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {

  #state = signal<any>({});
  #listeners = signal<string[]>([]);
  constructor() {
    // Initialize the state with a random motorcycle manufacturer
    this.#state.set({ key: 'init' });
  }

  get listeners() {
    return this.#listeners.asReadonly();
  }

  register(listener?: string) {
    listener && this.#listeners.update(prev => [...new Set([...prev, listener]).values()]);
    return this.#state.asReadonly();
  }

  unregister(listener: string) {
    this.#listeners.update(prev => prev.filter(l => l !== listener));
  }

  setState(newState: any) {
    this.#state.set(newState);
  }

}

@Component({
  selector: 'loop-state-listener',
  template: `
    <div>
      <p>Subscriber: {{ name() }}</p>
      <p>State: {{ state?.() | json }}</p>
      <button [disabled]="isRegistered()" (click)="register()">Register</button>

    </div>
  `,
  imports: [JsonPipe],
})
export class StateListenerComponent implements OnDestroy {
  #globalStateService = inject(GlobalStateService);

  name = input.required<string>();
  state?: Signal<any>;

  isRegistered = computed(() => this.#globalStateService.listeners().includes(this.name()));

  register() {
    this.state = this.#globalStateService.register(this.name());
    console.log('Subscribed to state:', this.state());
  }

  // We need cleanup every time like this if we insist on using global state.
  ngOnDestroy() {
    // Uncomment line below and navigate away and back to global-state route to see listeners cleared. 
    // this.#globalStateService.unregister(this.name());
  }

}

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
export class GlobalStateComponent {
  #globalStateService = inject(GlobalStateService);
  state = this.#globalStateService.register();
  listeners = this.#globalStateService.listeners;
  names = Array.from(new Array(5)).map((_, i) => `component-${++i}`);

  updateState() {
    this.#globalStateService.setState({ key: randMotorcycleManufacturer() });
  }
} 