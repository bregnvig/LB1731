import { ChangeDetectionStrategy, Component, DestroyRef, Input, inject, input, signal } from '@angular/core';
import { checkCounter } from './check-counter';
import { Strategies, Strategy } from './strategies';

// Shared by both leaves: they only differ in their change detection strategy
const template = `
  <div class="node {{ strategy }}">
    <div class="head">
      <span class="name">{{ name() }}</span>
      <button type="button" class="btn btn-sm fw-bold strategy" title="Toggle Eager / OnPush" (click)="strategies.toggle(name())">{{ strategy }} ⇄</button>
      <span class="ms-auto fs-5">checks <b class="checks">0</b></span>{{ checked() }}
    </div>
    <div class="small">in: primitive <b>{{ primitive }}</b> · signal <b>{{ signal() }}</b></div>
    <div class="small">ticks: primitive <b>{{ primitiveTicks }}</b> · signal <b>{{ signalTicks() }}</b></div>
    <div class="buttons">
      <button type="button" class="btn btn-success" (click)="onClick()">click</button>
      <button type="button" class="btn btn-outline-primary" (click)="togglePrimitiveInterval()">{{ primitiveRunning() ? 'stop' : 'start' }} primitive interval</button>
      <button type="button" class="btn btn-outline-primary" (click)="toggleSignalInterval()">{{ signalRunning() ? 'stop' : 'start' }} signal interval</button>
    </div>
  </div>
`;

@Component({
  selector: 'loop-cd-leaf',
  changeDetection: ChangeDetectionStrategy.Eager,
  template,
  styles: `@import "src/app/performance/change-detection-2/node";`,
})
export class CdLeafComponent {
  readonly strategy: Strategy = 'Eager';
  name = input.required<string>();
  @Input() primitive = 0;
  signal = input(0);
  protected strategies = inject(Strategies);
  protected checked = checkCounter();

  // Changed by an interval, not by an event in a template.
  // A plain field tells Angular nothing; only zone.js notices that the interval ran.
  protected primitiveTicks = 0;
  protected primitiveRunning = signal(false);
  #primitiveInterval?: ReturnType<typeof setInterval>;

  // A signal marks this node for refresh and schedules a check, with or without zone.js
  protected signalTicks = signal(0);
  protected signalRunning = signal(false);
  #signalInterval?: ReturnType<typeof setInterval>;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearInterval(this.#primitiveInterval);
      clearInterval(this.#signalInterval);
    });
  }

  protected onClick() {
    // Nothing to do: an event bound in the template is enough to trigger change detection
  }

  protected togglePrimitiveInterval() {
    if (this.primitiveRunning()) {
      clearInterval(this.#primitiveInterval);
    } else {
      this.#primitiveInterval = setInterval(() => this.primitiveTicks++, 1000);
    }
    this.primitiveRunning.update(running => !running);
  }

  protected toggleSignalInterval() {
    if (this.signalRunning()) {
      clearInterval(this.#signalInterval);
    } else {
      this.#signalInterval = setInterval(() => this.signalTicks.update(ticks => ticks + 1), 1000);
    }
    this.signalRunning.update(running => !running);
  }
}

@Component({
  selector: 'loop-cd-leaf-onpush',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles: `@import "src/app/performance/change-detection-2/node";`,
})
export class CdLeafOnPushComponent extends CdLeafComponent {
  override readonly strategy = 'OnPush';
}
