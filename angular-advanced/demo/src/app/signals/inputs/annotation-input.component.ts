import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core';
import { Playground } from 'src/app/shared';

@Component({
  selector: 'loop-annonation-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if(distance) { <span [innerHTML]="text"></span> } @else { No distance provided }`
})
export class AnnotationInputComponent {

  text?: string;

  @Input({ required: true }) playgrounds!: Playground[];

  // // Option1 - using setter (be vary that we actually don't know if we have playgrounds set yet)
  // @Input({ transform: (value: number | undefined) => typeof value === 'number' ? `${value} meters` : value }) set distance(value: string | undefined) { 
  //   this.text = this.getText(); 
  // };

  // Option2 - using ngOnChanges
  @Input({ transform: (value: number | undefined) => typeof value === 'number' ? `${value} meters` : value }) distance?: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.playgrounds?.length && changes['distance']?.currentValue !== changes['distance']?.previousValue) {
      this.text = this.distance && this.getText();
    }
  }

  private getText(): string | undefined {
    const [first, second] = this.playgrounds;
    return `Distance between ${first?.name} and ${second?.name}: <strong>${this.distance}</strong>`;
  }
}
