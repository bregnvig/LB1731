import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Playground } from 'src/app/shared';

@Component({
  selector: 'loop-annonation-input',
  standalone: true,
  imports: [JsonPipe, NgbAlert, LeafletModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if(distance) { {{text}} } @else { No distance provided }`
})
export class AnnotationInputComponent {

  text?: string;

  @Input({ required: true }) playgrounds!: Playground[];

  // // Option1 - using setter
  // @Input({ transform: (value: number | undefined) => typeof value === 'number' ? `${value} meters` : value }) set distance(value: string | undefined) { 
  //   this.text = this.getText(); 
  // };
  
  // Option2 - using ngOnChanges
  @Input({ transform: (value: number | undefined) => typeof value === 'number' ? `${value} meters` : value }) distance?: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.distance?.currentValue !== changes.distance?.previousValue) {
      this.text = this.distance && this.getText();
    }
  }

  private getText(): string | undefined {
    const [first, second] = this.playgrounds;
    return `Distance between ${first?.name} and ${second?.name}: ${this.distance}`;
  }
}
