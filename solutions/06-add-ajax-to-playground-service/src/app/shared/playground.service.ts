import { Injectable } from '@angular/core';

import { Playground } from './playground';
import { MOCK_PLAYGROUNDS } from './mock-playgrounds';

@Injectable()
export class PlaygroundService {

  public getPlaygrounds(): Playground[] {
    return MOCK_PLAYGROUNDS;
  }
}
