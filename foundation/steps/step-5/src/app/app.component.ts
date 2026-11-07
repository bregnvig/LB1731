import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  template: `
    <main class="vh-100 d-flex justify-content-center align-items-center">
      <div class="d-relative">
        <img src="angular.png" height="400">
        <h1 class="position-absolute font-monospace start-50 translate-middle fw-bolder">Foundation </h1>
      </div>
    </main>
    <app-sidebar/>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SidebarComponent]
})
export class AppComponent {
}
