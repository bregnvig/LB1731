import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SidebarComponent]
})
export class AppComponent {
}
