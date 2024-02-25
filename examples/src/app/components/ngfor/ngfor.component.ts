import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-ngfor',
    templateUrl: './ngfor.component.html',
    standalone: true,
    imports: [NgFor],
})
export class NgforComponent {

  items: string[] = ['foo', 'bar'];

  myTrack = (index: number, o: string) => o;

  addInput(input: string) {
    this.items.push(input);
  }

}
