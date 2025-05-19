import { Component, computed, inject, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, firstValueFrom, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { EditPlaygroundModalComponent } from './edit-playground/edit-playground-modal.component';
import { ErrorComponent } from "./error.component";
import { FooterComponent } from "./footer/footer.component";
import { Center, LeafletModule, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { NetworkErrorsComponent } from './network-errors.component';
import { LocationService, PlaygroundService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { isTruthy } from './utils';
import { withLength } from './utils/rxjs-utils';

@Component({
  selector: 'loop-root',
  templateUrl: './app.component.html',
  imports: [FooterComponent, SidebarComponent, LeafletModule, ErrorComponent, NetworkErrorsComponent],
})
export class AppComponent {

  #service = inject(PlaygroundService);
  #modal = inject(NgbModal);
  #locationService = inject(LocationService);
  #reload = new BehaviorSubject<void>(undefined);

  playgrounds: Signal<Playground[]>;
  playground = signal<Playground | undefined>(undefined);
  center: Signal<Center>;
  markers: Signal<Marker[]> = computed(() => [this.#locationService.location(), this.playground()?.position].filter(isTruthy));
  error = signal<any>(undefined);
  loading = signal(true);

  constructor(
  ) {
    const getDistance = this.#locationService.getDistance;
    const compareLocations = (a: Coordinate, b: Coordinate) => a?.lat === b?.lat && a?.lng === b?.lng;
    this.playgrounds = toSignal(combineLatest([
      this.#reload.pipe(
        switchMap(() => this.#service.list()),
        withLength(),
        catchError(error => {
          this.error.set(error);
          return of([]);
        }),
      ),
      this.#locationService.location$.pipe(distinctUntilChanged(compareLocations)),
    ]).pipe(
      map(([playgrounds, location]) =>
        playgrounds
          .sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      ),
      tap(() => this.loading.set(false)),
    ), { initialValue: [] });
    this.center = computed(() => {
      const playground = this.playground();
      if (playground) return { ...playground.position, zoom: 14 };
      return { lat: 56.360029, lng: 10.746635, zoom: 8, ...this.#locationService.location() };
    });
  }

  async edit(playground: Playground) {
    EditPlaygroundModalComponent.open(this.#modal, playground, this.playgrounds())
      .then(playground => firstValueFrom(this.#service.update(playground.id, playground)))
      .then(() => {
        this.#reload.next();
        this.loading.set(true);
      })
      .catch(error => this.error.set(error));
  }
  async delete(playground: Playground) {
    firstValueFrom(this.#service.delete(playground.id))
      .then(() => {
        this.#reload.next();
        this.loading.set(true);
      })
      .catch(error => this.error.set(error));
  }

}
