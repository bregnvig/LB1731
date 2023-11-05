import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Injector, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditPlaygroundModalComponent } from './edit-playground/edit-playground-modal.component';
import { FooterComponent } from "./footer/footer.component";
import { Center, LeafletModule, Marker } from './leaflet';
import { Playground } from './model';
import { PlaygroundStore } from './playground-store.service';
import { LocationService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'loop-root',
  standalone: true,
  templateUrl: './app.component.html',
  providers: [PlaygroundStore],
  imports: [FooterComponent, SidebarComponent, AsyncPipe, LeafletModule, NgIf],
})
export class AppComponent {

  location = this.locationService.location;
  playgrounds = computed(() => {
    const location = this.location();
    return !location ? this.store.playgrounds() : this.store.playgrounds().sort((a: Playground, b: Playground) => this.locationService.getDistance(a.position, location) - this.locationService.getDistance(b.position, location));
  });
  playground = this.store.playground;

  center: Signal<Center>;
  markers: Signal<Marker[]>;

  constructor(
    private store: PlaygroundStore,
    private modal: NgbModal,
    private injector: Injector,
    private locationService: LocationService,
  ) {
    this.markers = computed(() => {
      const playground = this.playground();
      return [this.location(), !playground ? undefined : { ...playground.position, message: playground.name }].filter(Boolean);
    });

    this.center = computed(() => this.location() || { lat: 56.360029, lng: 10.746635 });
  }

  selectPlayground(playground: Playground): void {
    this.store.setId(playground.id);
  }

  async edit(playground: Playground) {
    EditPlaygroundModalComponent.open(this.modal, playground, this.injector);
  }

}
