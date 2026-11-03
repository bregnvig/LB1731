import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, forwardRef, inject, signal, viewChild } from '@angular/core';
import { CD_PARENT, CdEagerNodeComponent, CdOnPushNodeComponent, CdParent, CdTreeStore, TREE } from './cd-node';

@Component({
  selector: 'loop-cd-tree',
  // Eager like the rest of this demo app: an OnPush page would stop zone.js cycles from reaching the tree at all.
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CdEagerNodeComponent, CdOnPushNodeComponent],
  providers: [CdTreeStore, { provide: CD_PARENT, useExisting: forwardRef(() => CdTreeComponent) }],
  // Inspired by Matthieu Riegler's Angular change detection demo: https://jeanmeche.github.io/angular-change-detection/
  template: `
    <div #toolbar class="d-flex align-items-center gap-2 mb-1">
      <h2 class="mb-0 me-3">Change detection</h2>
      <button type="button" data-action="eager" class="btn btn-primary">All Eager</button>
      <button type="button" data-action="onpush" class="btn btn-warning">All OnPush</button>
      <button type="button" data-action="reset" class="btn btn-outline-secondary">Reset counters</button>
    </div>
    <p class="text-muted mb-3">Yellow flash = Angular checked that node. Only <b>click</b> runs inside the zone.</p>

    @if (store.strategy(tree.id)() === 'OnPush') {
      <loop-cd-onpush-node [node]="tree" [value]="rootValues()[0]" [index]="0" />
    } @else {
      <loop-cd-eager-node [node]="tree" [value]="rootValues()[0]" [index]="0" />
    }
  `,
})
export class CdTreeComponent implements CdParent, AfterViewInit {
  protected store = inject(CdTreeStore);
  protected tree = TREE;
  protected rootValues = signal([0]);
  #zone = inject(NgZone);
  private toolbar = viewChild.required<ElementRef<HTMLElement>>('toolbar');

  ngAfterViewInit() {
    // Outside the zone, so "Reset counters" does not itself check the Eager nodes.
    this.#zone.runOutsideAngular(() => {
      this.toolbar().nativeElement.addEventListener('click', event => {
        const action = (event.target as HTMLElement).dataset['action'];
        if (action === 'eager') this.store.setAll('Eager');
        if (action === 'onpush') this.store.setAll('OnPush');
        if (action === 'reset') this.store.reset();
      });
    });
  }

  bumpChild() {
    this.rootValues.update(([v]) => [v + 1]);
  }
}
