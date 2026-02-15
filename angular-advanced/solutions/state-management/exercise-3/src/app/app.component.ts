import { Component, computed, inject, Signal, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditPlaygroundModalComponent } from './edit-playground/edit-playground-modal.component';
import { ErrorComponent } from "./error.component";
import { FooterComponent } from "./footer/footer.component";
import { LeafletModule, Marker } from './leaflet';
import { Playground } from './model';
import { NetworkErrorsComponent } from './network-errors.component';
import { LocationService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PlaygroundStore } from './state/playground.store';
import { isTruthy } from './utils';

@Component({
  selector: 'loop-root',
  templateUrl: './app.component.html',
  imports: [FooterComponent, SidebarComponent, LeafletModule, ErrorComponent, NetworkErrorsComponent],
  providers: [PlaygroundStore]
})
export class AppComponent {

  #store = inject(PlaygroundStore);
  #modal = inject(NgbModal);
  #locationService = inject(LocationService);

  playground = signal<Playground | undefined>(undefined);
  playgrounds = computed(() => {
    const playgrounds = this.#store.playgroundsResource.value();
    const location = this.#locationService.location();
    const getDistance = this.#locationService.getDistance;
    return location && playgrounds
      ? playgrounds.sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      : playgrounds ?? [];
  });
  center = computed(() => {
    const playground = this.playground();
    return playground
      ? { ...playground.position, zoom: 14 }
      : { lat: 56.360029, lng: 10.746635, zoom: 8, ...this.#locationService.location() };
  });

  markers: Signal<Marker[]> = computed(() => [this.#locationService.location(), this.playground()?.position].filter(isTruthy));
  error = this.#store.errors;
  loading = this.#store.playgroundsResource.isLoading;

  edit(playground: Playground) {
    EditPlaygroundModalComponent.open(this.#modal, playground, this.playgrounds())
      .then(playground => this.#store.update(playground));
  }
  delete(playground: Playground) {
    this.#store.delete(playground.id);
  }

}
