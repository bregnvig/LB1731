import { Component } from '@angular/core';

import { SidebarComponent } from './sidebar';
import { FooterComponent } from './footer';
import { Playground, PlaygroundService } from './shared';


@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [SidebarComponent, FooterComponent],
  providers: [PlaygroundService]
})
export class AppComponent {
  title = 'app works!';

  public playground: Playground;

  public playgroundSelected(playground: Playground): void {
    this.playground = playground;
    console.log('Playground selected', playground);
    
  }
}
