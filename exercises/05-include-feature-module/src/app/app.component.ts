import { Component } from '@angular/core';
import { MOCK_PLAYGROUNDS } from './shared/mock-playgrounds';
import { Playground } from './shared/playground';
import { FooterComponent } from './footer/footer.component';
import { NgIf } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [SidebarComponent, NgIf, FooterComponent]
})
export class AppComponent {

  appPlaygrounds: Playground[] = MOCK_PLAYGROUNDS;
  playground?: Playground;

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.playground = playground;
  }
}
