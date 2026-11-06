import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Playground } from 'src/app/shared';

@Component({
  selector: 'loop-signal-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if(distance()) { <span [innerHTML]="text()"></span> } @else { No distance provided }`
})
export class SignalInputComponent {

  playgrounds = input.required<Playground[]>();
  distance = input<string | undefined, number | undefined>(undefined, { transform: value => typeof value === 'number' ? `${value} meters` : value });
  text = computed(() => this.distance() ? this.getText() : undefined);

  private getText(): string {
    const [first, second] = this.playgrounds();
    return `Distance between ${first?.name} and ${second?.name}: <strong>${this.distance()}</strong>`;
  }

}
