import { ChangeDetectionStrategy, Component, DestroyRef, NgZone, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

/** Lives for the whole app, like a store or a websocket service. */
export const broadcast$ = new Subject<string>();

let nextId = 1;
// A few from assets/copenhagen.json; card #n shows the n-th, round robin
const PLAYGROUNDS = [
  { name: 'Havnegades trampolinpromenade', description: 'Hop i trampolin med havnekig.', addressDescription: 'Havnegade' },
  { name: 'Legepladsen i Østre Anlæg ved Malmøgade', description: 'Populært, grønt åndehul med kælkebakke', addressDescription: 'Stockholmsgade 24' },
  { name: 'Legepladsen i Classens Have', description: 'Ligger i et frodigt gårdanlæg med offentlig adgang.', addressDescription: 'adgang fra Classensgade og Arendalsgade' },
  { name: 'Legepladsen i Langelinieanlægget', description: 'Sjov for små pirater.', addressDescription: 'ved Nordre Toldbod' },
];
export const created = signal(0);
export const collected = signal(0);
// Calls back some time after the garbage collector freed an instance: the browser decides when.
const registry = new FinalizationRegistry(() => collected.update(n => n + 1));

@Component({
  selector: 'loop-leaky',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card border-2" [class.border-danger]="!fixed()" [class.border-success]="fixed()">
      <div class="card-body py-2">
        <h5 class="card-title mb-1">{{ playground.name }}</h5>
        <p class="mb-1">{{ playground.description }} <span class="text-muted">· {{ playground.addressDescription }}</span></p>
        <small [class.text-danger]="!fixed()" [class.text-success]="fixed()">
          Card #{{ id }} ({{ fixed() ? 'cleans up' : 'leaks' }}) · ticks {{ ticks() }} · width {{ width() }}px · last update: {{ last() }}
        </small>
      </div>
    </div>
  `,
})
export class LeakyComponent implements OnInit {
  fixed = input(false);

  protected id = nextId++;
  protected playground = PLAYGROUNDS[(this.id - 1) % PLAYGROUNDS.length];
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
