import { Component } from '@angular/core';
import { LocationService } from './shared';
import { Playground } from './shared/playground';
import { PlaygroundService } from './shared/playground.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  appPlaygrounds?: Playground[];
  playground?: Playground;

  constructor(service: PlaygroundService, locationService: LocationService) {
    service.getPlaygrounds().subscribe(playgrounds => this.appPlaygrounds = playgrounds);
    locationService.current.subscribe(location => console.log(location));
  }

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.playground = playground;
  }
}
