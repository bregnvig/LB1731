import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';

import { SidebarComponent } from './sidebar';
import { FooterComponent } from './footer';
import { Playground, PlaygroundService } from './shared';


@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [SidebarComponent, FooterComponent],
  providers: [HTTP_PROVIDERS, PlaygroundService]
})
export class AppComponent {
  title = 'app works!';

  public playground: Playground;

  public playgroundSelected(playground: Playground): void {
    this.playground = playground;
    console.log('Playground selected', playground);
    
  }
}
