import { MOCK_PLAYGROUNDS } from './shared/mock-playgrounds';
import { Component } from '@angular/core';

import { Playground } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app works!';

  public playgrounds: Playground[] = MOCK_PLAYGROUNDS;
  public playground: Playground;

  public playgroundSelected(playground: Playground): void {
    this.playground = playground;
    console.log('Playground selected', playground);
  }
}
