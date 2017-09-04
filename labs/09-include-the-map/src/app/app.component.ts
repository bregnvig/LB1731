import { Component, OnInit } from '@angular/core';

import { Playground, LocationService  } from './shared';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  public playground: Playground;

  constructor(private locationService: LocationService) {
  }

  ngOnInit() {
    this.locationService.current.subscribe(location => {
      console.log('Obtained location', location)
    });
  }

  public playgroundSelected(playground: Playground): void {
    this.playground = playground;
    console.log('Playground selected', playground);
  }

}
