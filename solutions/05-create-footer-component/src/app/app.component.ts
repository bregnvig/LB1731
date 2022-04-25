import { Component, OnInit } from '@angular/core';
import { Playground } from './shared';
import { MOCK_PLAYGROUNDS } from './shared/mock-playgrounds';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  appPlaygrounds: Playground[];
  playground: Playground;

  ngOnInit(): void {
    this.appPlaygrounds = MOCK_PLAYGROUNDS;
  }

  playgroundSelected(playground: Playground): void {
    this.playground = playground;
    console.log('Playground selected', playground);
  }
}
