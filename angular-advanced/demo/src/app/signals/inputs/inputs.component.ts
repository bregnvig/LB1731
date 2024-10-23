import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { randNearbyGPSCoordinate, randSequence, randAnimal } from '@ngneat/falso';
import { getRandomPlayground, LocationService, Playground } from 'src/app/shared';
import { AnnotationInputComponent } from './annotation-input.component';
import { SignalInputComponent } from "./signal-input.component";
import { toObservable } from '@angular/core/rxjs-interop';
import { SharedPlaygroundUlComponent } from "../../shared/component/shared-playground-ul.component";

@Component({
  selector: 'loop-inputs',
  standalone: true,
  imports: [JsonPipe, NgbAlert, LeafletModule, AnnotationInputComponent, SignalInputComponent, SharedPlaygroundUlComponent],
  template: `
    <div class="container">
      <button type="button" class="btn btn-primary" (click)="addPlayground()">Add playground</button>
      <button type="button" class="ms-3 btn btn-primary" (click)="playgrounds.set([])">Clear playgrounds</button>
      
      <div class="d-flex flex-column my-3">
        <span class="fs-5">Signal Input</span>
        <loop-signal-input [playgrounds]="playgrounds()" [distance]="distance()"></loop-signal-input>
      </div>
      <div class="d-flex flex-column my-3">
        <span class="fs-5">Annotation Input</span>
        <loop-annonation-input [playgrounds]="playgrounds()" [distance]="distance()"></loop-annonation-input>
      </div>
    
      <loop-shared-playground-ul class="mt-5" [playgrounds]="playgrounds()"/>
    </div>
  `
})
export class InputsComponent {

  private service = inject(LocationService);

  playgrounds = signal<Playground[]>([getRandomPlayground(), getRandomPlayground()]);
  distance = computed(() => {
    const playgrounds = this.playgrounds();
    if (playgrounds?.length === 2) {
      const coordinates = playgrounds.map(playground => playground.position);
      return this.service.getDistance(coordinates[0], coordinates[1]);
    }
    return undefined;
  });

  addPlayground(): void {
    const [lat, lng] = randNearbyGPSCoordinate();
    this.playgrounds.update(playgrounds => [...playgrounds ?? [], getRandomPlayground()]);
  }

}
