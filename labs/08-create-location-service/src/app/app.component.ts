import { PlaygroundService } from './shared/playground.service';
import { Component, OnInit } from '@angular/core';

import { Playground } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  public title = 'app works!';
  public playgrounds: Playground[];
  public playground: Playground;

  public constructor(private service: PlaygroundService) {

  }

  public ngOnInit() {
    this.service.getPlaygrounds().subscribe(playgrounds => this.playgrounds = playgrounds);
  }

  public playgroundSelected(playground: Playground): void {
    this.playground = playground;
    console.log('Playground selected', playground);
  }
}
