import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { randNearbyGPSCoordinate } from '@ngneat/falso';
import { getRandomPlayground, LocationService, Playground } from 'src/app/shared';
import { SharedPlaygroundUlComponent } from "../../shared/component/shared-playground-ul.component";
import { AnnotationInputComponent } from './annotation-input.component';
import { SignalInputComponent } from "./signal-input.component";

@Component({
  selector: 'loop-inputs',
  imports: [AnnotationInputComponent, SignalInputComponent, SharedPlaygroundUlComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="container">
      <button type="button" class="btn btn-primary" (click)="addPlayground()">Add playground</button>
      <button type="button" class="ms-3 btn btn-outline-primary" (click)="playgrounds.set([])">Clear playgrounds</button>

      <div class="demo-surface outputs my-3">
        <div class="output">
          <span class="fs-5">Signal Input <code>input()</code></span>
          <loop-signal-input [playgrounds]="playgrounds()" [distance]="distance()"></loop-signal-input>
        </div>
        <div class="output">
          <span class="fs-5">Annotation Input <code>&#64;Input()</code></span>
          <loop-annonation-input [playgrounds]="playgrounds()" [distance]="distance()"></loop-annonation-input>
        </div>
      </div>

      <loop-shared-playground-ul class="p-0 border-0" [playgrounds]="playgrounds()"/>
    </div>
  `,
  styles: `
    @import "src/scss/variables";

    .outputs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
      gap: 1.5rem;
    }

    // Both children get the same inputs; each card shows what its child made of them
    .output {
      display: flex;
      flex-direction: column;
      gap: .75rem;
      padding: 1.25rem 1.5rem;
      border-radius: $border-radius-lg;
      background: $white;
      color: $ink;
      box-shadow: $lift-shadow;

      > span {
        display: flex;
        align-items: center;
        gap: .625rem;
        font-weight: 650;
        font-stretch: 85%;
      }

      // the distance the child got through its transform, e.g. "123 meters"
      ::ng-deep strong {
        display: block;
        margin-top: .25rem;
        color: $azure;
        font-size: 2.5rem;
        font-stretch: 75%;
        line-height: 1.1;
      }
    }
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
