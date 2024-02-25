import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [SidebarComponent]
})
export class AppComponent {
}
