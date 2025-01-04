import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: `
    <h2>
      {{title}}
    </h2>
  `,
  styles: `
  h2 {
      color: orange !important;
    } 
  `,
  standalone: true
})
export class HelloComponent implements OnInit {

  title: string;

  constructor() {
    this.title = 'Hello world!';
  }

  ngOnInit() {
    // this.title = 'Hello world!';
  }

  doSomething() {
    this.title.length;
  }

}
