import { JsonPipe } from "@angular/common";
import { Component, Signal, computed, inject, input } from "@angular/core";
import { StateListenerService } from "./state-listener.service";

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
export class StateListenerComponent {
    #service = inject(StateListenerService);

    name = input.required<string>();
    state?: Signal<any>;

    isRegistered = computed(() => this.#service.listeners().includes(this.name()));

    register() {
        this.state = this.#service.register(this.name());
        console.log('Subscribed to state:', this.state());
    }

}
