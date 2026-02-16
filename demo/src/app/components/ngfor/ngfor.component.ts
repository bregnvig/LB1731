import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ngfor',
  templateUrl: './ngfor.component.html',
  imports: [NgFor]
})
export class NgforComponent {

  protected items: string[] = ['1. foo', '2. bar'];

  protected myTrack = (index: number, text: string) => text;

  protected addInput(input: string) {
    this.items.push(`${this.items.length + 1}. ${input}`);
  }

}
