import { Component } from '@angular/core';

import { SidebarComponent } from './sidebar';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [SidebarComponent]
})
export class AppComponent {
  title = 'app works!';
}
