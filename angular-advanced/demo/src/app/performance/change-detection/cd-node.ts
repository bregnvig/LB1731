import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Directive, ElementRef,
  InjectionToken, Injectable, Injector, NgZone, WritableSignal, afterNextRender, forwardRef, inject, input, signal, viewChild,
} from '@angular/core';

export type Strategy = 'Eager' | 'OnPush';
export interface TreeNode { id: string; children: TreeNode[] }

const node = (id: string, ...children: TreeNode[]): TreeNode => ({ id, children });
export const TREE = node('A', node('B', node('D'), node('E')), node('C', node('F'), node('G')));
const ALL_IDS = 'ABCDEFG'.split('');

/** Whoever renders a node: a parent node, or the page for the root. */
export interface CdParent { bumpChild(index: number): void }
export const CD_PARENT = new InjectionToken<CdParent>('CD_PARENT');

/** Page-scoped state that survives rebuilding a node when its strategy changes. */
@Injectable()
export class CdTreeStore {
  #injector = inject(Injector);
  #strategies = new Map(ALL_IDS.map(id => [id, signal<Strategy>('Eager')] as [string, WritableSignal<Strategy>]));
  #counts = new Map<string, number>();
  #nodes = new Set<CdNode>();

  strategy(id: string) { return this.#strategies.get(id)!; }

  toggle(id: string) {
    this.strategy(id).update(s => s === 'Eager' ? 'OnPush' : 'Eager');
    this.#resetAfterRender();
  }

  setAll(strategy: Strategy) {
    const changed = [...this.#strategies.values()].filter(s => s() !== strategy);
    changed.forEach(s => s.set(strategy));
    if (changed.length) this.#resetAfterRender();
  }

  count(id: string) { return this.#counts.get(id) ?? 0; }
  increment(id: string) { this.#counts.set(id, this.count(id) + 1); }
  register(n: CdNode) { this.#nodes.add(n); }
  unregister(n: CdNode) { this.#nodes.delete(n); }

  reset() {
    this.#counts.clear();
    this.#nodes.forEach(n => n.showCount());
  }

  // Rebuilding a subtree checks it, so start the counters from 0 once it has rendered.
  #resetAfterRender() {
    afterNextRender(() => this.reset(), { injector: this.#injector });
  }
}

const template = `
  <div #card class="card border-3" [class.border-primary]="strategy === 'Eager'" [class.border-warning]="strategy === 'OnPush'">
    <div class="card-body p-2">
      <div class="d-flex align-items-center gap-2 mb-1">
        <span class="fs-3 fw-bold lh-1">{{ node().id }}</span>
        <button type="button" data-trigger="toggle" class="btn btn-sm fw-bold"
          [class.btn-primary]="strategy === 'Eager'" [class.btn-warning]="strategy === 'OnPush'">{{ strategy }}</button>
        <span class="ms-auto fs-5">checks <span #counter class="fw-bold">0</span></span>
      </div>
      <div class="small mb-1">input <b>{{ value() }}</b> · signal <b>{{ count() }}</b> · field <b>{{ field }}</b>{{ checked() }}</div>
      <div class="d-flex flex-wrap gap-1 triggers">
        <button type="button" class="btn btn-success" (click)="onClick()">click</button>
        <button type="button" data-trigger="input" class="btn btn-outline-dark">input</button>
        <button type="button" data-trigger="markForCheck" class="btn btn-outline-dark">markForCheck</button>
        <button type="button" data-trigger="signal" class="btn btn-outline-dark">signal</button>
        <button type="button" data-trigger="field" class="btn btn-outline-dark">field</button>
        <button type="button" data-trigger="setTimeout" class="btn btn-outline-dark">setTimeout</button>
        <button type="button" data-trigger="outside" class="btn btn-outline-dark">outside zone</button>
      </div>
    </div>
  </div>
  @if (node().children.length) {
    <div class="kids">
      @for (child of node().children; track child.id) {
        <div class="kid">
          @if (store.strategy(child.id)() === 'OnPush') {
            <loop-cd-onpush-node [node]="child" [value]="childValues()[$index]" [index]="$index" />
          } @else {
            <loop-cd-eager-node [node]="child" [value]="childValues()[$index]" [index]="$index" />
          }
        </div>
      }
    </div>
  }
`;

const styles = `
  :host { display: block; }
  .triggers .btn { font-size: .8rem; padding: .1rem .4rem; }
  .kids { display: flex; gap: 1rem; position: relative; padding-top: 1.5rem; }
  .kids::before { content: ''; position: absolute; top: 0; left: 50%; height: .75rem; border-left: 3px solid #adb5bd; }
  .kid { flex: 1 1 0; position: relative; }
  .kid::before { content: ''; position: absolute; top: -.75rem; left: 50%; height: .75rem; border-left: 3px solid #adb5bd; }
  .kid::after { content: ''; position: absolute; top: -.75rem; left: 0; right: 0; border-top: 3px solid #adb5bd; }
  .kid:first-child::after { left: 50%; }
  .kid:last-child::after { right: 50%; }
`;

@Directive()
export abstract class CdNode implements CdParent, AfterViewInit {
  node = input.required<TreeNode>();
  value = input(0);
  index = input(0);

  abstract readonly strategy: Strategy;
  protected store = inject(CdTreeStore);
  protected childValues = signal([0, 0]); // a signal, so bumping it re-renders this node and passes the new input down
  protected count = signal(0);
  protected field = 0;

  #zone = inject(NgZone);
  #cdr = inject(ChangeDetectorRef);
  #parent = inject(CD_PARENT, { skipSelf: true });
  private card = viewChild.required<ElementRef<HTMLElement>>('card');
  private counter = viewChild.required<ElementRef<HTMLElement>>('counter');
  #pending = false;

  constructor() {
    this.store.register(this);
    inject(DestroyRef).onDestroy(() => this.store.unregister(this));
  }

  ngAfterViewInit() {
    // Every trigger button except "click" is wired outside Angular,
    // so pressing it is not itself a reason for change detection.
    this.#zone.runOutsideAngular(() => {
      this.card().nativeElement.querySelectorAll<HTMLButtonElement>('[data-trigger]').forEach(button =>
        button.addEventListener('click', () => this.#run(button.dataset['trigger']!)));
    });
  }

  bumpChild(index: number) {
    this.childValues.update(values => values.map((v, i) => i === index ? v + 1 : v));
  }

  protected onClick() {
    // Nothing to do: a listener bound in the template is the trigger.
  }

  /**
   * Called by a template binding, so it runs exactly when Angular checks this view.
   * Counts once per cycle (dev mode re-reads bindings in its checkNoChanges pass) and
   * flashes from a microtask outside Angular: direct DOM writes, no bindings, no new cycle.
   */
  protected checked() {
    if (!this.#pending) {
      this.#pending = true;
      this.store.increment(this.node().id);
      this.#zone.runOutsideAngular(() => queueMicrotask(() => {
        this.#pending = false;
        this.showCount();
        this.card().nativeElement.animate({ backgroundColor: ['#ffd43b', '#ffffff'] }, { duration: 900, easing: 'ease-out' });
      }));
    }
    return '';
  }

  showCount() {
    this.counter().nativeElement.textContent = String(this.store.count(this.node().id));
  }

  #run(trigger: string) {
    switch (trigger) {
      case 'toggle': return this.store.toggle(this.node().id);
      case 'input': return this.#parent.bumpChild(this.index());
      case 'markForCheck': return this.#cdr.markForCheck();
      case 'signal': return this.count.update(c => c + 1);
      case 'field': return void this.field++;
      case 'setTimeout': return this.#zone.run(() => setTimeout(() => this.field++, 1000));
      case 'outside': return void setTimeout(() => this.field++, 1000); // we are already outside the zone here
    }
  }
}

@Component({
  selector: 'loop-cd-eager-node',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [forwardRef(() => CdOnPushNodeComponent)],
  providers: [{ provide: CD_PARENT, useExisting: forwardRef(() => CdEagerNodeComponent) }],
  template, styles,
})
export class CdEagerNodeComponent extends CdNode {
  readonly strategy: Strategy = 'Eager';
}

@Component({
  selector: 'loop-cd-onpush-node',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdEagerNodeComponent],
  providers: [{ provide: CD_PARENT, useExisting: forwardRef(() => CdOnPushNodeComponent) }],
  template, styles,
})
export class CdOnPushNodeComponent extends CdNode {
  readonly strategy: Strategy = 'OnPush';
}
