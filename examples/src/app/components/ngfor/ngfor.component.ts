import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ngfor',
  templateUrl: './ngfor.component.html',
  styleUrls: ['./ngfor.component.css']
})
export class NgforComponent implements OnInit {

  items: string[] = ['foo', 'bar'];

  myTrack = (index: number, o: string) => {
    console.log(o);
    return o;
  };

  constructor() { }

  ngOnInit() {
  }

  addInput(input: string) {
    this.items.push(input);
  }

}
