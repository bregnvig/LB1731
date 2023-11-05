import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Signal, computed } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EditPlaygroundModalComponent } from './edit-playground/edit-playground-modal.component';
import { FooterComponent } from "./footer/footer.component";
import { Center, LeafletModule, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { PlaygroundStore } from './playground-store.service';
import { LocationService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'loop-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [FooterComponent, SidebarComponent, AsyncPipe, LeafletModule, NgIf],
})
export class AppComponent {

  playgrounds: Signal<Playground[]>;
  playground = this.store.playground;
  location$: Observable<Coordinate> = this.locationService.location$;
  center$: Observable<Center>;
  markers: Signal<Marker[] | undefined>;

  constructor(
    private store: PlaygroundStore,
    private modal: NgbModal,
    private locationService: LocationService,
  ) {
    this.markers = computed(() => {
      const playground = this.store.playground();
      return [
        this.locationService.location(),
        playground ? ({ ...playground.position, message: playground.name }) : undefined
      ];
    });

    const getDistance = locationService.getDistance;
    this.store.getPlaygrounds();
    this.playgrounds = computed(() => {
      const location = this.locationService.location();
      return location
        ? this.store.playgrounds().sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
        : this.store.playgrounds();
    });
    this.center$ = locationService.location$.pipe(
      startWith({ lat: 56.360029, lng: 10.746635 }),
      map(location => ({ ...location, zoom: 12 }))
    );
  }

  async edit(playground: Playground) {
    this.setPlayground(playground);
    this.modal.open(EditPlaygroundModalComponent);
  }

  setPlayground({ id }: Playground) {
    this.store.selectedId(id);
  }

}
