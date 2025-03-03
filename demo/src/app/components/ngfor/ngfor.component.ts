import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ngfor',
  templateUrl: './ngfor.component.html',
  imports: [NgFor]
})
export class NgforComponent {

  items: string[] = ['foo', 'bar'];

  myTrack = (index: number, text: string) => text;

  addInput(input: string) {
    this.items.push(input);
    this.items.sort();
  }

}
