import { Component } from '@angular/core';

@Component({
  selector: 'loop-key-value',
  templateUrl: './key-value.component.html',
  styleUrls: ['./key-value.component.scss']
})
export class KeyValueComponent {

  myObject = {
    b: 'B is the second',
    a: 'A is the first letter',
  };

  myMap = new Map<string, string>([
    ['c', 'C is the third'],
    ['a', 'A is the first letter'],
    ['b', 'B is the second'],
  ]);


  originalOrder = () => 0;
}
