import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RandomService } from '../service/random.service';

@Component({
  selector: 'loop-random',
  template: `
    <dl class="readout">
      <dt>self</dt>
      <dd>{{service.no || "I have no random service 😢"}}</dd>
      <dt>skipSelf</dt>
      <dd>{{rootService.no || "I have no random service 😢"}}</dd>
      <dt>host, skipSelf</dt>
      <dd>{{hostService?.no || "I have no random host service 😢"}}</dd>
    </dl>
  `,
  styles: `
    dt { font-family: var(--bs-font-monospace); font-size: .8125rem; }
    dd { font-size: 1rem; font-weight: 600; }
  `,
  providers: [RandomService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class RandomComponent {

  service = inject(RandomService, { self: true });
  rootService = inject(RandomService, { skipSelf: true });
  hostService = inject(RandomService, { host: true, skipSelf: true, optional: true });

}
