import { Component, Optional, Self, SkipSelf } from '@angular/core';
import { RandomService } from '../service/random.service';

@Component({
  selector: 'loop-random',
  template: `
    {{service?.no || "I have no random service 😢"}}<br>
    {{rootService?.no || "I have no random service 😢"}}
  `,
  providers: [RandomService]
})
export class RandomComponent {

  constructor(
    @Optional() @Self() public service: RandomService,
    @SkipSelf() public rootService: RandomService,
  ) { }


}
