import { Component } from '@angular/core';

@Component({
  selector: 'app-ngfor',
  templateUrl: './ngfor.component.html',
})
export class NgforComponent {

  items: string[] = ['foo', 'bar'];

  myTrack = (index: number, o: string) => o;

  addInput(input: string) {
    this.items.push(input);
  }

}
