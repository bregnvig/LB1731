import { Component, OnInit } from '@angular/core';

import { Playground, LocationService  } from '../shared';


@Component({
  moduleId: module.id,
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {

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
