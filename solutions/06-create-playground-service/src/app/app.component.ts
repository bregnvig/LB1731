import { Component } from '@angular/core';
import { Center } from './leaflet';
import { MOCK_PLAYGROUNDS } from './shared/mock-playgrounds';
import { Playground } from './shared/playground';
import { PlaygroundService } from './shared/playground.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  appPlaygrounds: Playground[];
  playground?: Playground;
  center: Center = {
    lat: 56.360029,
    lng: 10.746635
  };

  constructor(service: PlaygroundService) {
    this.appPlaygrounds = service.getPlaygrounds();
  }


  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.playground = playground;
  }
}
