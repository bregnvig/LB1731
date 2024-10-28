import { Component, effect, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { combineLatest, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';
import { FooterComponent } from 'src/app/footer/footer.component';
import { Center, LeafletModule, Marker } from 'src/app/leaflet';
import { Coordinate, Playground } from 'src/app/model';
import { LocationService, PlaygroundService } from 'src/app/service';
import { SidebarComponent } from 'src/app/sidebar/sidebar.component';
import { shareLatest, withLength } from 'src/app/utils/rxjs-utils';

@Component({
  selector: 'loop-home',
  template: `
    <main class="vw-100 vh-100">
      @if (!playgrounds()) {
        <fa-icon class="position-absolute top-50 start-50 translate-middle text-muted" [style.z-index]="1000" [icon]="['fas', 'spinner']" animation="spin-pulse" [size]="'3x'"/>
      }
      <leaflet [center]="center()" [markers]="markers()"/>
    </main>
    <loop-sidebar
      [playgrounds]="playgrounds()"
      [(selectedPlayground)]="playground"
      [location]="location()"/>
    @if (playground()) {
      <loop-footer [playground]="playground()"/>
    }
  `,
  standalone: true,
  imports: [
    LeafletModule,
    SidebarComponent,
    FooterComponent,
    FaIconComponent,
  ],
})

export class HomeComponent {

  playgrounds = signal<Playground[] | undefined>(localStorage.getItem('playground') ? JSON.parse(localStorage.getItem('playground') ?? '[]') : undefined);
  playground = signal<Playground | undefined>(undefined);
  center = signal<Center | undefined>(undefined);
  markers = signal<Marker[]>([]);
  location = signal<Coordinate | undefined>(undefined);

  constructor(
    router: Router,
    route: ActivatedRoute,
    service: PlaygroundService,
    locationService: LocationService,
  ) {

    const playground$ = route.params.pipe(
      map(params => params.id),
      switchMap(id => service.getById(id)),
      shareLatest(),
    );

    playground$.pipe(
      takeUntilDestroyed(),
    ).subscribe(playground => this.playground.set(playground));
    locationService.location$.pipe(
      takeUntilDestroyed(),
    ).subscribe(location => this.location.set(location));

    playground$.pipe(
      map(playground => playground?.position ?? { lat: 56.360029, lng: 10.746635, zoom: 9 }),
      takeUntilDestroyed(),
    ).subscribe(position => this.center.set({ zoom: 16, ...position }));

    const compareLocations = (a: Coordinate, b: Coordinate) => a?.lat === b?.lat && a?.lng === b?.lng;
    const getDistance = locationService.getDistance;
    combineLatest([
      service.playgrounds$.pipe(withLength()),
      locationService.location$.pipe(distinctUntilChanged(compareLocations)),
    ]).pipe(
      map(([playgrounds, location]) => playgrounds.toSorted((a, b) => getDistance(a.position, location) - getDistance(b.position, location))),
      takeUntilDestroyed(),
    ).subscribe(playgrounds => this.playgrounds.set(playgrounds));

    combineLatest([
      locationService.location$,
      playground$.pipe(
        map(p => p ? ({ ...p.position, message: p.name }) : undefined),
        startWith(undefined),
      ),
    ]).pipe(
      takeUntilDestroyed(),
    ).subscribe(markers => this.markers.set(markers));

    effect(() => localStorage.setItem('playground', JSON.stringify(this.playgrounds())));
    effect(() => {
      const playground = this.playground();
      playground && router.navigate([playground.id]);
    });
  }
}
