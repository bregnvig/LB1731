import { Component, OnInit } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';

import { SidebarComponent } from './sidebar';
import { FooterComponent } from './footer';
import { Playground, PlaygroundService, LocationService } from './shared';


@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [SidebarComponent, FooterComponent],
  providers: [HTTP_PROVIDERS, PlaygroundService, LocationService]
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