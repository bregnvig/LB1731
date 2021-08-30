import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'loop-locale',
  template: `
    <loop-default-locale></loop-default-locale><br>
    <loop-da-locale></loop-da-locale>
  `
})
export class LocaleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
