import { Component } from '@angular/core';
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

  constructor(service: PlaygroundService) {
    this.appPlaygrounds = service.getPlaygrounds();
  }

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.playground = playground;
  }
}
