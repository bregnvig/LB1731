import { Component } from '@angular/core';

@Component({
  selector: 'loop-key-value',
  templateUrl: './key-value.component.html',
  styleUrls: ['./key-value.component.scss']
})
export class KeyValueComponent {

  myObject = {
    a: 'A is the first letter',
    b: 'B is the second',
  };

  myMap = new Map<string, string>([
    ['a', 'A is the first letter'],
    ['b', 'B is the second'],
  ]);


}
