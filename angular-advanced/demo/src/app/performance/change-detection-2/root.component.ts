import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CdAComponent, CdAOnPushComponent } from './a.component';
import { Strategies } from './strategies';

@Component({
  selector: 'loop-cd-root',
  // Eager like the rest of this demo app, so every click reaches node A
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CdAComponent, CdAOnPushComponent],
  providers: [Strategies],
  template: `
    <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
      <h2 class="mb-0 me-3">Change detection</h2>
      <button type="button" class="btn btn-primary" (click)="strategies.setAll('Eager')">All Eager</button>
      <button type="button" class="btn btn-warning" (click)="strategies.setAll('OnPush')">All OnPush</button>
      <button type="button" class="btn btn-dark" title="Reloads the page" (click)="toggleZone()">{{ zone ? 'zone.js' : 'Zoneless' }} ⇄</button>
    </div>
    <p class="text-muted mb-3">Yellow flash = Angular checked that node. Running <b>{{ zone ? 'with zone.js' : 'zoneless' }}</b>.
      Click a node's <b>Eager ⇄</b> / <b>OnPush ⇄</b> button to switch its strategy.</p>

    @if (strategies.of('A') === 'OnPush') {
      <loop-cd-a-onpush />
    } @else {
      <loop-cd-a />
    }
  `,
})
export class CdRootComponent {
  protected strategies = inject(Strategies);
  // main.ts only loads zone.js when the URL has ?zone
  protected zone = 'Zone' in globalThis;

  protected toggleZone() {
    // Zone or zoneless is chosen when the app boots, so switching means reloading the page
    location.search = this.zone ? '' : '?zone';
  }
}
