import { ChangeDetectionStrategy, Component, DestroyRef, NgZone, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

/** Lives for the whole app, like a store or a websocket service. */
export const broadcast$ = new Subject<string>();

let nextId = 1;
export const created = signal(0);
export const collected = signal(0);
// Calls back some time after the garbage collector freed an instance: the browser decides when.
const registry = new FinalizationRegistry(() => collected.update(n => n + 1));

@Component({
  selector: 'loop-leaky',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="alert fs-5 py-2" [class.alert-danger]="!fixed()" [class.alert-success]="fixed()">
      Playground card #{{ id }} ({{ fixed() ? 'cleans up' : 'leaks' }}) · ticks {{ ticks() }} · width {{ width() }}px · last update: {{ last() }}
    </div>
  `,
})
export class LeakyComponent implements OnInit {
  fixed = input(false);

  protected id = nextId++;
  protected ticks = signal(0);
  protected width = signal(window.innerWidth);
  protected last = signal('none');
  // About 1 MB, so each kept instance stands out in a heap snapshot
  protected payload = new Float64Array(128 * 1024);

  #destroyRef = inject(DestroyRef);
  #zone = inject(NgZone);

  constructor() {
    created.update(n => n + 1);
    registry.register(this, undefined);
  }

  ngOnInit() {
    const onResize = () => this.width.set(window.innerWidth);
    window.addEventListener('resize', onResize);
    // Outside the zone, so leaked intervals don't run change detection every second on other pages
    const id = this.#zone.runOutsideAngular(() => setInterval(() => this.ticks.update(t => t + 1), 1000));

    if (this.fixed()) {
      this.#destroyRef.onDestroy(() => {
        window.removeEventListener('resize', onResize);
        clearInterval(id);
      });
      broadcast$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(m => this.last.set(m));
    } else {
      broadcast$.subscribe(m => this.last.set(m));
    }
  }
}
