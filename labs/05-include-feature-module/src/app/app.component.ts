import { Component } from '@angular/core';
import { MOCK_PLAYGROUNDS } from './shared/mock-playgrounds';
import { Playground } from './shared/playground';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  appPlaygrounds: Playground[] = MOCK_PLAYGROUNDS;
  playground?: Playground;

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.playground = playground;
  }
}
