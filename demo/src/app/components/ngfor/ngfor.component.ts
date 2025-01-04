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

  myTrack = (index: number, text: string) => text;

  addInput(input: string) {
    this.items.push(input);
  }

}
