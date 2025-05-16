import { Component, computed, inject, linkedSignal, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, firstValueFrom } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { EditPlaygroundModalComponent } from './edit-playground/edit-playground-modal.component';
import { ErrorComponent } from "./error.component";
import { FooterComponent } from "./footer/footer.component";
import { Center, LeafletModule, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
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

  playgrounds: Signal<Playground[]>;
  playground = signal<Playground | undefined>(undefined);
  center: Signal<Center>;
  markers: Signal<Marker[]> = computed(() => [this.#locationService.location(), this.playground()?.position].filter(isTruthy));
  #storeError = toSignal(this.#store.error);
  error = linkedSignal<any>(() => this.#storeError());
  loading = toSignal(this.#store.loading, { requireSync: true });

  constructor(
  ) {
    const getDistance = this.#locationService.getDistance;
    const compareLocations = (a: Coordinate, b: Coordinate) => a?.lat === b?.lat && a?.lng === b?.lng;
    this.playgrounds = toSignal(combineLatest([
      this.#store.playgrounds,
      this.#locationService.location$.pipe(distinctUntilChanged(compareLocations)),
    ]).pipe(
      map(([playgrounds, location]) =>
        playgrounds
          .sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      ),
    ), { initialValue: [] });
    this.center = computed(() => this.#locationService.location() ?? { lat: 56.360029, lng: 10.746635 });
  }

  async edit(playground: Playground) {
    EditPlaygroundModalComponent.open(this.#modal, playground, this.playgrounds())
      .then(playground => firstValueFrom(this.#store.update(playground)))
      .catch(error => this.error.set(error));
  }
  async delete(playground: Playground) {
    firstValueFrom(this.#store.delete(playground.id))
      .catch(error => this.error.set(error));
  }

}
