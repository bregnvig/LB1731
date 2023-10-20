import { AsyncPipe, NgIf } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FooterComponent } from "./footer/footer.component";
import { LeafletModule } from './leaflet';
import { Coordinate, Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'loop-root',
  standalone: true,
  template: `
    <main class="vw-100 vh-100">
      <leaflet [center]="center()" [markers]="markers()"/>
    </main>
    <loop-sidebar [playgrounds]="playgrounds()" (selected)="selectPlayground($event)"/>
    <loop-footer *ngIf="selectedPlayground() as playground" [playground]="playground"/>
  `,
  imports: [FooterComponent, SidebarComponent, AsyncPipe, LeafletModule, NgIf],
})
export class AppComponent {

  location = computed(() => this.locationService.location(), { equal: (a?: Coordinate, b?: Coordinate) => a?.lat === b?.lat && a?.lng === b?.lng });
  playgrounds = computed(() => {
    const location = this.location();
    const playgrounds = this.service.playgrounds();
    if (!location) {
      return playgrounds;
    }
    return playgrounds.sort((a: Playground, b: Playground) => this.locationService.getDistance(a.position, location) - this.locationService.getDistance(b.position, location));
  });
  selectedPlayground = signal<Playground | undefined>(undefined);
  markers = computed(() => {
    const location = this.location();
    const playground = this.selectedPlayground();
    return [location, playground?.position].filter(Boolean);
  });
  center = computed(() => {
    const { lat, lng } = this.location() || { lat: 56.360029, lng: 10.746635 };
    return { lat, lng, zoom: 12 };
  });

  constructor(private service: PlaygroundService, private locationService: LocationService) {
  }

  selectPlayground(playground: Playground): void {
    this.selectedPlayground.update(() => playground);
  }
}
