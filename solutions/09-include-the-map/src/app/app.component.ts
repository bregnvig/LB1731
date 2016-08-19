import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Playground, LocationService  } from './shared';
import { Marker, Center } from './leaflet';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {

  public playground: Playground;
  public markers: Observable<Marker>;
  public center: Center = new Center(56.360029, 10.746635);


  constructor(private locationService: LocationService) {
  
  }

  ngOnInit() {
    this.locationService.current.subscribe(location => {
      this.center = new Center(location.lat, location.lng);
      console.log('Obtained location', location)
    });
    this.markers = this.locationService.current.map(coordinate => new Marker('me', coordinate.lat, coordinate.lng, 'Her er jeg'));    
  }

  public playgroundSelected(playground: Playground): void {
    this.playground = playground;
    console.log('Playground selected', playground);
  }

}
