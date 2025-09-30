import { ChangeDetectionStrategy, Component, EventEmitter, input, output, Output } from '@angular/core';
import { Playground } from 'src/app/shared';

@Component({
  selector: 'loop-simple-playground-details',
  template: `
    <p>{{playground()?.description}}, {{playground()?.addressDescription}}</p>
    <p class="mt-3 mb-0">
      <fa-icon role="button" size="2x" [icon]="['far', 'thumbs-up']" (click)="emit('up')"/>
      <fa-icon class="ms-2" role="button" size="2x" [icon]="['far', 'thumbs-down']" (click)="emit('down')"/>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
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
