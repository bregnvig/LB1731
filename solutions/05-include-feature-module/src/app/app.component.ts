import { Component } from '@angular/core';
import { Center } from './leaflet';
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
  center: Center = {
    lat: 56.360029,
    lng: 10.746635
  };

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.playground = playground;
  }
}
