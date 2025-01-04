import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [SidebarComponent]
})
export class AppComponent {
}
