import { Component } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { MOCK_PLAYGROUNDS } from './shared/mock-playgrounds';
import { Playground } from './shared/playground';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [SidebarComponent, FooterComponent]
})
export class AppComponent {

  appPlaygrounds: Playground[] = MOCK_PLAYGROUNDS;
  playground?: Playground;

  playgroundSelected(playground: Playground) {
    console.log(playground.name, playground);
    this.playground = playground;
  }
}
