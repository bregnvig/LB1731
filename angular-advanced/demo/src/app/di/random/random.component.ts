import { Component, Host } from '@angular/core';
import { RandomService } from '../service/random.service';

@Component({
  selector: 'loop-random',
  template: '{{service.no}}',
  // providers: [RandomService]
})
export class RandomComponent {

  constructor(@Host() public service: RandomService) { }


}
