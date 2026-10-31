import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { icon, LatLng, marker } from 'leaflet';
import { Playground } from 'src/app/shared';
import { createOptions } from '../location/create-options';
import { PaginationComponent } from './pagination.compont';

@Component({
  selector: 'loop-model',
  templateUrl: './model.component.html',
  styleUrl: './model.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [PaginationComponent, LeafletModule]
})

export class ModelComponent {

  copenhagen = toSignal(inject(HttpClient).get<Playground[]>('assets/copenhagen.json'));
  aarhus = toSignal(inject(HttpClient).get<Playground[]>('assets/aarhus.json'));
  city = signal<'copenhagen' | 'aarhus'>('copenhagen');
  active = computed(() => this.city() === 'copenhagen' ? this.copenhagen() : this.aarhus());
  // Writable (the pagination sets it), but back to page 0 whenever the list changes.
  page = linkedSignal({ source: this.active, computation: () => 0 });
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
    this.city.set('copenhagen');
  }

  useAarhus() {
    this.city.set('aarhus');
  }

}