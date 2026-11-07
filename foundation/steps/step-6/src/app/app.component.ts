import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { MOCK_PLAYGROUNDS } from './shared/mock-playgrounds';
import { Playground } from './shared/playground';
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
    <app-sidebar [playgrounds]="appPlaygrounds" (selected)="playgroundSelected($event)" />
    <app-footer [playground]="playground" />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SidebarComponent, FooterComponent]
})
export class AppComponent {

  appPlaygrounds: Playground[] = MOCK_PLAYGROUNDS;
  playground?: Playground;

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.playground = playground;
  }
}
