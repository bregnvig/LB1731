import { Component, computed, inject, linkedSignal, Signal, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { EditPlaygroundModalComponent } from './edit-playground/edit-playground-modal.component';
import { ErrorComponent } from "./error.component";
import { FooterComponent } from "./footer/footer.component";
import { Center, LeafletModule, Marker } from './leaflet';
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
  center: Signal<Center> = computed(() => this.#locationService.location() ?? { lat: 56.360029, lng: 10.746635 });
  markers: Signal<Marker[]> = computed(() => [this.#locationService.location(), this.playground()?.position].filter(isTruthy));
  error = linkedSignal<any>(() => this.#store.error());
  loading = this.#store.loading;

  edit(playground: Playground) {
    EditPlaygroundModalComponent.open(this.#modal, playground, this.playgrounds())
      .then(playground => firstValueFrom(this.#store.update(playground)))
      .catch(error => this.error.set(error));
  }
  delete(playground: Playground) {
    firstValueFrom(this.#store.delete(playground.id))
      .catch(error => this.error.set(error));
  }

}
