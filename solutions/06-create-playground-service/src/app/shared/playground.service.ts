import { MOCK_PLAYGROUNDS } from './mock-playgrounds';
import { Playground } from './playground';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  getPlaygrounds(): Playground[] {
    return MOCK_PLAYGROUNDS;
  }
}
