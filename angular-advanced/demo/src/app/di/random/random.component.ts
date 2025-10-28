import { Component, inject } from '@angular/core';
import { RandomService } from '../service/random.service';

@Component({
  selector: 'loop-random',
  template: `
    {{service.no || "I have no random service 😢"}}<br>
    {{rootService.no || "I have no random service 😢"}}<br>
    {{hostService?.no || "I have no random host service 😢"}}
  `,
  providers: [RandomService],
  standalone: false
})
export class RandomComponent {

  service = inject(RandomService, { self: true });
  rootService = inject(RandomService, { skipSelf: true });
  hostService = inject(RandomService, { host: true, skipSelf: true, optional: true });

}
