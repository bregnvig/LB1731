import { PlaygroundService } from './shared/playground.service';
import { Component, OnInit } from '@angular/core';

import { Playground } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  title = 'app works!';
  playgrounds: Playground[];
  playground: Playground;

  constructor(private service: PlaygroundService) {

  }

  ngOnInit() {
    this.playgrounds = this.service.getPlaygrounds();
  }

  playgroundSelected(playground: Playground): void {
    this.playground = playground;
    console.log('Playground selected', playground);
  }
}
