import { Component, Host, Optional, Self, SkipSelf } from '@angular/core';
import { RandomService } from '../service/random.service';

@Component({
  selector: 'loop-random',
  template: `
    {{service.no || "I have no random service 😢"}}<br>
    {{rootService.no || "I have no random service 😢"}}<br>
    {{hostService?.no || "I have no random host service 😢"}}
  `,
  providers: [RandomService]
})
export class RandomComponent {

  constructor(
    @Self() public service: RandomService,
    @SkipSelf() public rootService: RandomService,
    @Host() @SkipSelf() @Optional() public hostService?: RandomService,
  ) { }


}
