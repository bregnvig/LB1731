import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Injector, Signal, computed } from '@angular/core';
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
  imports: [FooterComponent, SidebarComponent, AsyncPipe, LeafletModule, NgIf],
  providers: [PlaygroundStore],
})
export class AppComponent {

  playgrounds: Signal<Playground[]>;
  playground = this.store.playground;
  center: Signal<Center>;
  markers: Signal<Marker[] | undefined>;

  constructor(
    private store: PlaygroundStore,
    private modal: NgbModal,
    private injector: Injector,
    private locationService: LocationService,
  ) {
    this.store.loadPlaygrounds();

    this.markers = computed(() => {
      const playground = this.store.playground();
      return [
        this.locationService.location(),
        playground ? ({ ...playground.position, message: playground.name }) : undefined
      ];
    });

    const getDistance = locationService.getDistance;
    this.playgrounds = computed(() => {
      const location = this.locationService.location();
      return location
        ? this.store.playgrounds().sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
        : this.store.playgrounds();
    });
    this.center = computed(() => locationService.location() ?? { lat: 56.360029, lng: 10.746635 });
  }

  edit(playground: Playground) {
    this.setPlayground(playground);
    this.modal.open(EditPlaygroundModalComponent, { injector: this.injector });
  }

  setPlayground({ id }: Playground) {
    this.store.selectedId(id);
  }

}
