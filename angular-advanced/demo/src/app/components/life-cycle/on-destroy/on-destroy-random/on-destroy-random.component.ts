import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'loop-on-destroy-random',
  template: `
    <p>
      {{no}}
    </p>
  `,
})
export class OnDestroyRandomComponent implements OnInit, OnDestroy {

  no: number | undefined;
  private subscription: Subscription | undefined;

  constructor() { }

  ngOnInit(): void {
    this.subscription = interval(1000).pipe(
      map(() => Math.floor(Math.random() * 100))
    ).subscribe(no => this.no = no);
  }

  ngOnDestroy() {
    console.log('OnDestroyRandomComponent destroyed');
    this.subscription?.unsubscribe();
  }

}
