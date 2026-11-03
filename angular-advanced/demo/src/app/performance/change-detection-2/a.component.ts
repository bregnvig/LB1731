import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CdBranchComponent, CdBranchOnPushComponent } from './branch.component';
import { checkCounter } from './check-counter';
import { Strategies, Strategy } from './strategies';

// Shared by both versions of A: they only differ in their change detection strategy
const template = `
  <div class="node {{ strategy }}">
    <div class="head">
      <span class="name">A</span>
      <button type="button" class="btn btn-sm fw-bold strategy" title="Toggle Eager / OnPush" (click)="strategies.toggle('A')">{{ strategy }} ⇄</button>
      <span class="ms-auto fs-5">checks <b class="checks">0</b></span>{{ checked() }}
    </div>
    <div class="small">in: no inputs</div>
    <div class="small">out: primitive <b>{{ childPrimitive }}</b> · signal <b>{{ childSignal() }}</b></div>
    <div class="buttons">
      <button type="button" class="btn btn-success" (click)="onClick()">click</button>
      <button type="button" class="btn btn-outline-primary" (click)="childPrimitive = childPrimitive + 1">primitive +1</button>
      <button type="button" class="btn btn-outline-primary" (click)="childSignal.set(childSignal() + 1)">signal +1</button>
    </div>
  </div>
  <div class="kids">
    <div class="kid">
      @if (strategies.of('B') === 'OnPush') {
        <loop-cd-branch-onpush name="B" [primitive]="childPrimitive" [signal]="childSignal()" />
      } @else {
        <loop-cd-branch name="B" [primitive]="childPrimitive" [signal]="childSignal()" />
      }
    </div>
    <div class="kid">
      @if (strategies.of('C') === 'OnPush') {
        <loop-cd-branch-onpush name="C" [primitive]="childPrimitive" [signal]="childSignal()" />
      } @else {
        <loop-cd-branch name="C" [primitive]="childPrimitive" [signal]="childSignal()" />
      }
    </div>
  </div>
`;

/** The top of the tree: it has no inputs, it only passes values down. */
@Component({
  selector: 'loop-cd-a',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CdBranchComponent, CdBranchOnPushComponent],
  template,
  styles: `@import "src/app/performance/change-detection-2/node";`,
})
export class CdAComponent {
  readonly strategy: Strategy = 'Eager';
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
  selector: 'loop-cd-a-onpush',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdBranchComponent, CdBranchOnPushComponent],
  template,
  styles: `@import "src/app/performance/change-detection-2/node";`,
})
export class CdAOnPushComponent extends CdAComponent {
  override readonly strategy = 'OnPush';
}
