import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ngfor',
  templateUrl: './ngfor.component.html',
  styleUrls: ['./ngfor.component.css']
})
export class NgforComponent implements OnInit {

  public items:string[] = ['foo', 'bar'];

  myTrack = (index, o) => {
    console.log(o);
    return o;
  }

  constructor() { }

  ngOnInit() {
  }

  addInput(input: string) {
    this.items.push(input);
  }

}
