import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-inner',
  template: `
  <p>
    I'm inner
  </p>
 `,
})
export class InnerComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    console.log('Constructed');
  }

  ngOnDestroy() {
    console.log('Destroyed!!');
  }

}
