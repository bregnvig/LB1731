import { ChangeDetectionStrategy, Component, EventEmitter, input, output, Output } from '@angular/core';
import { Playground } from 'src/app/shared';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'loop-simple-playground-details',
  template: `
    <p>{{playground()?.description}}, {{playground()?.addressDescription}}</p>
    <p class="mt-3 mb-0">
      <fa-icon role="button" size="2x" [icon]="['far', 'thumbs-up']" (click)="emit('up')"/>
      <fa-icon class="ms-2" role="button" size="2x" [icon]="['far', 'thumbs-down']" (click)="emit('down')"/>
    </p>
  `,
  styles: `
    @import "src/scss/variables";

    :host {
      display: block;
      max-width: 18rem;
    }

    p:first-child {
      margin: 0;
      color: $ink;
      font-size: .9375rem;
    }

    // Vote buttons: round steel targets
    fa-icon {
      display: inline-grid;
      place-items: center;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: $canvas;
      color: $cobalt;

      &:hover {
        background: $cobalt;
        color: $white;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent]
})
export class SimplePlaygroundDetailsComponent {
  playground = input<Playground>();
  @Output() vote = new EventEmitter<'up' | 'down'>();
  modernVote = output<'up' | 'down'>();

  emit(vote: 'up' | 'down') {
    this.vote.emit(vote);
    this.modernVote.emit(vote);
  }
}
