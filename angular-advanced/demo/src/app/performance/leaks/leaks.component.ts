import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { broadcast$, collected, created, LeakyComponent } from './leaky.component';

interface Playground { name: string; data: number[] }

@Component({
  selector: 'loop-leaks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LeakyComponent],
  styles: `.leaky-slot { min-height: 3.75rem; }`,
  template: `
    <h2>Leaks</h2>
    <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
      <label class="form-check form-switch fs-5 mb-0">
        <input type="checkbox" class="form-check-input" [checked]="fixed()" [disabled]="mounted()" (change)="fixed.set(!fixed())">
        Use the fix
      </label>
      <button type="button" class="btn btn-primary" (click)="mounted.set(!mounted())">{{ mounted() ? 'Unmount' : 'Mount' }} a playground card</button>
      <button type="button" class="btn btn-outline-primary" [disabled]="mounted()" (click)="mountTenTimes()">Mount + unmount 10 times</button>
      <button type="button" class="btn btn-outline-secondary" (click)="broadcast()">Send an update</button>
    </div>

    <div class="leaky-slot">
      @if (mounted()) {
        <loop-leaky [fixed]="fixed()" />
      }
    </div>

    <div class="d-flex gap-5 fs-3 mb-1">
      <div>Created <b>{{ created() }}</b></div>
      <div>Collected <b>{{ collected() }}</b></div>
      <div>Still alive <b class="text-danger">{{ created() - collected() }}</b></div>
    </div>
    <p class="text-muted">Collected moves only after a GC: DevTools, Memory, <b>Collect garbage</b> (bin icon).</p>

    <h3 class="mt-4">Map vs WeakMap cache</h3>
    <div class="d-flex gap-2 mb-3">
      <button type="button" class="btn btn-primary" (click)="createPlaygrounds()">Cache 1000 playgrounds in each</button>
      <button type="button" class="btn btn-outline-danger" (click)="dropPlaygrounds()">Drop the playgrounds</button>
      <button type="button" class="btn btn-outline-secondary" (click)="clearMap()">map.clear()</button>
    </div>
    <table class="table table-bordered fs-5 w-auto">
      <thead><tr><th></th><th>Map</th><th>WeakMap</th></tr></thead>
      <tbody>
        <tr><td>Playgrounds cached</td><td>{{ made() }}</td><td>{{ made() }}</td></tr>
        <tr><td>Entries (<code>size</code>)</td><td>{{ mapSize() }}</td><td>n/a</td></tr>
        <tr><td>Playgrounds collected</td><td>{{ mapCollected() }}</td><td>{{ weakCollected() }}</td></tr>
      </tbody>
    </table>
  `,
})
export class LeaksComponent {
  protected fixed = signal(false);
  protected mounted = signal(false);
  protected created = created;
  protected collected = collected;

  protected made = signal(0);
  protected mapSize = signal(0);
  protected mapCollected = signal(0);
  protected weakCollected = signal(0);

  #cdr = inject(ChangeDetectorRef);
  #map = new Map<Playground, string>();
  #weakMap = new WeakMap<Playground, string>();
  #mapRegistry = new FinalizationRegistry(() => this.mapCollected.update(n => n + 1));
  #weakRegistry = new FinalizationRegistry(() => this.weakCollected.update(n => n + 1));
  #playgrounds: Playground[] = [];
  #messages = 0;

  protected mountTenTimes() {
    for (let i = 0; i < 10; i++) {
      this.mounted.set(true);
      this.#cdr.detectChanges();
      this.mounted.set(false);
      this.#cdr.detectChanges();
    }
  }

  protected broadcast() {
    broadcast$.next(UPDATES[this.#messages++ % UPDATES.length]);
  }

  protected createPlaygrounds() {
    for (let i = 0; i < 1000; i++) {
      const forMap = playground(i);
      const forWeakMap = playground(i);
      this.#map.set(forMap, label(forMap));
      this.#weakMap.set(forWeakMap, label(forWeakMap));
      this.#mapRegistry.register(forMap, undefined);
      this.#weakRegistry.register(forWeakMap, undefined);
      this.#playgrounds.push(forMap, forWeakMap);
    }
    this.made.update(n => n + 1000);
    this.mapSize.set(this.#map.size);
  }

  protected dropPlaygrounds() {
    this.#playgrounds = [];
  }

  protected clearMap() {
    this.#map.clear();
    this.mapSize.set(0);
  }
}

const UPDATES = ['Havrebakkens Legeplads', 'Lisbjerg Legeplads', 'Legepladsen: Indelukket', 'Kirkedammens legeplads'];

const playground = (i: number): Playground => ({ name: `Legeplads ${i}`, data: new Array(1000).fill(i) });
const label = (p: Playground) => `${p.name} (${p.data.length} points)`;
