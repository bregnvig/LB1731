import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FooterComponent } from './footer/footer.component';
import { Center, LeafletModule, Marker } from './leaflet';
import { LocationService } from './shared';
import { Playground } from './shared/playground';
import { PlaygroundService } from './shared/playground.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [LeafletModule, SidebarComponent, FooterComponent, AsyncPipe]
})
export class AppComponent {

  appPlaygrounds?: Playground[];
  playground?: Playground;
  center: Center = { lat: 56.360029, lng: 10.746635 };
  markers$: Observable<Marker[]>;

  constructor(service: PlaygroundService, locationService: LocationService) {
    service.getPlaygrounds().subscribe(playgrounds => this.appPlaygrounds = playgrounds);
    locationService.current.subscribe(location => console.log(location));
    this.markers$ = locationService.current.pipe(
      map(location => [location])
    );
  }

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.playground = playground;
  }
}
