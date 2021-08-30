import { Component, Host, Optional } from '@angular/core';
import { RandomService } from '../service/random.service';

@Component({
  selector: 'loop-random',
  template: '{{service?.no || "I have no random service 😢"}}',
  // providers: [RandomService]
})
export class RandomComponent {

  constructor(@Optional() @Host() public service: RandomService) { }


}
