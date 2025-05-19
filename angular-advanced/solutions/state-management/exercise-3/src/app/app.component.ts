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

  playgrounds = computed(() => {
    const playgrounds = this.#store.playgrounds();
    const location = this.#locationService.location();
    const getDistance = this.#locationService.getDistance;
    return location && playgrounds
      ? playgrounds.sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      : playgrounds ?? [];
  });
  playground = signal<Playground | undefined>(undefined);
  center = computed(() => {
    const playground = this.playground();
    if (playground) return { ...playground.position, zoom: 14 };
    return { lat: 56.360029, lng: 10.746635, zoom: 8, ...this.#locationService.location() };
  });
  markers: Signal<Marker[]> = computed(() => [this.#locationService.location(), this.playground()?.position].filter(isTruthy));
  error = computed<any>(() => this.#store.playgroundsError() ?? this.#store.updateError() ?? this.#store.deleteError());
  loading = this.#store.loading;

  edit(playground: Playground) {
    EditPlaygroundModalComponent.open(this.#modal, playground, this.playgrounds())
      .then(playground => this.#store.update(playground));
  }
  delete(playground: Playground) {
    this.#store.delete(playground.id);
  }

}
