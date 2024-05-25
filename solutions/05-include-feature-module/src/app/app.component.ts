import { Component } from '@angular/core';
import { Center, LeafletModule } from '@loopme/leaflet';
import { FooterComponent } from './footer/footer.component';
import { MOCK_PLAYGROUNDS } from './shared/mock-playgrounds';
import { Playground } from './shared/playground';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [LeafletModule, SidebarComponent, FooterComponent]
})
export class AppComponent {

  appPlaygrounds: Playground[] = MOCK_PLAYGROUNDS;
  playground?: Playground;
  center: Center = {
    lat: 56.360029,
    lng: 10.746635
  };

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.playground = playground;
  }
}
