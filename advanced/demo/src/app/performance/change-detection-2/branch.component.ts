import { ChangeDetectionStrategy, Component, Input, inject, input, signal } from '@angular/core';
import { checkCounter } from './check-counter';
import { CdLeafComponent, CdLeafOnPushComponent } from './leaf.component';
import { Strategies, Strategy } from './strategies';

// Shared by both branches: they only differ in their change detection strategy
const template = `
  <div class="node {{ strategy }}">
    <div class="head">
      <span class="name">{{ name() }}</span>
      <button type="button" class="btn btn-sm fw-bold strategy" title="Toggle Eager / OnPush" (click)="strategies.toggle(name())">{{ strategy }} ⇄</button>
      <span class="ms-auto fs-5">checks <b class="checks">0</b></span>{{ checked() }}
    </div>
    <div class="small">in: primitive <b>{{ primitive }}</b> · signal <b>{{ signal() }}</b></div>
    <div class="small">out: primitive <b>{{ childPrimitive }}</b> · signal <b>{{ childSignal() }}</b></div>
    <div class="buttons">
      <button type="button" class="btn btn-success" (click)="onClick()">click</button>
      <button type="button" class="btn btn-outline-primary" (click)="childPrimitive = childPrimitive + 1">primitive +1</button>
      <button type="button" class="btn btn-outline-primary" (click)="childSignal.set(childSignal() + 1)">signal +1</button>
    </div>
  </div>
  <div class="kids">
    <div class="kid">
      @if (strategies.of(name() + '1') === 'OnPush') {
        <loop-cd-leaf-onpush [name]="name() + '1'" [primitive]="childPrimitive" [signal]="childSignal()" />
      } @else {
        <loop-cd-leaf [name]="name() + '1'" [primitive]="childPrimitive" [signal]="childSignal()" />
      }
    </div>
    <div class="kid">
      @if (strategies.of(name() + '2') === 'OnPush') {
        <loop-cd-leaf-onpush [name]="name() + '2'" [primitive]="childPrimitive" [signal]="childSignal()" />
      } @else {
        <loop-cd-leaf [name]="name() + '2'" [primitive]="childPrimitive" [signal]="childSignal()" />
      }
    </div>
  </div>
`;

@Component({
  selector: 'loop-cd-branch',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CdLeafComponent, CdLeafOnPushComponent],
  template,
  styles: `@import "src/app/performance/change-detection-2/node";`,
})
export class CdBranchComponent {
  readonly strategy: Strategy = 'Eager';
  name = input.required<string>();
  @Input() primitive = 0;
  signal = input(0);
  protected strategies = inject(Strategies);
  protected checked = checkCounter();

  // What this node passes down to both its children
  protected childPrimitive = 0;
  protected childSignal = signal(0);

  protected onClick() {
    // Nothing to do: an event bound in the template is enough to trigger change detection
  }
}

@Component({
  selector: 'loop-cd-branch-onpush',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdLeafComponent, CdLeafOnPushComponent],
  template,
  styles: `@import "src/app/performance/change-detection-2/node";`,
})
export class CdBranchOnPushComponent extends CdBranchComponent {
  override readonly strategy = 'OnPush';
}
