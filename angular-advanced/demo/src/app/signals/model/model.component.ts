import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { icon, LatLng, marker } from 'leaflet';
import { Playground } from 'src/app/shared';
import { createOptions } from '../location/create-options';
import { PaginationComponent } from './pagination.compont';

@Component({
  selector: 'loop-model',
  templateUrl: './model.component.html',
  imports: [PaginationComponent, LeafletModule]
})

export class ModelComponent {

  page = signal(0);

  copenhagen = toSignal(inject(HttpClient).get<Playground[]>('assets/copenhagen.json'));
  aarhus = toSignal(inject(HttpClient).get<Playground[]>('assets/aarhus.json'));
  active: Signal<Playground[] | undefined> = this.copenhagen;
  options = createOptions();

  playground = computed(() => this.active()?.[this.page()]);
  center = computed(() => {
    const playground = this.playground();
    return playground ? new LatLng(playground.position.lat, playground.position.lng) : new LatLng(56.360029, 10.746635);
  });
  marker = computed(() => marker(this.center(), {
    icon: icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png'
    })
  }));

  useCopenhagen() {
    this.active = this.copenhagen;
    this.page.set(0);
  }

  useAarhus() {
    this.active = this.aarhus;
    this.page.set(0);
  }

}