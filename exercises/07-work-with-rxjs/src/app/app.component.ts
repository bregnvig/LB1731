import { Component } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { Center, LeafletModule } from './leaflet';
import { Playground } from './shared/playground';
import { PlaygroundService } from './shared/playground.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [LeafletModule, SidebarComponent, FooterComponent]
})
export class AppComponent {

  appPlaygrounds: Playground[];
  playground?: Playground;
  center: Center = {
    lat: 56.360029,
    lng: 10.746635
  };

  constructor(service: PlaygroundService) {
    this.appPlaygrounds = service.getPlaygrounds();
  }


  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.playground = playground;
  }
}
