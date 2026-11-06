import { JsonPipe } from "@angular/common";
import { Component, Signal, computed, inject, input, ChangeDetectionStrategy } from "@angular/core";
import { StateListenerService } from "./state-listener.service";

@Component({
    selector: 'loop-state-listener',
    template: `
      <div class="listener">
        <p class="name">Subscriber: <strong>{{ name() }}</strong></p>
        <p class="state">State: <code>{{ $safeNavigationMigration(state?.()) | json }}</code></p>
        <button class="btn btn-primary btn-sm" [disabled]="isRegistered()" (click)="register()">Register</button>
      </div>
    `,
    styleUrl: './state-listener.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
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
