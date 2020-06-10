import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: '<h1>{{title}}</h1>',
  // templateUrl: './hello.component.html',
  styles: [
    `h1 {
      color: darkred !important;
    } `
  ]
})
export class HelloComponent implements OnInit {

   title: string;

  ngOnInit() {
    this.title = 'Hello world!';
  }

}
