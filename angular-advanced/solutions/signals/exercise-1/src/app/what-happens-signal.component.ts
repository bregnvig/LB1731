import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, switchMap } from 'rxjs';
import { Playground } from './model';

@Component({
  selector: 'loop-what-happens-signal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      what-happens-signal works!
      {{playgrounds().length}}
    </p>
  `,
  styles: [
  ]
})
export class WhatHappensSignalComponent {

  playgrounds: Signal<Playground[]>;

  constructor(http: HttpClient) {
    this.playgrounds = toSignal(
      interval(1000).pipe(
        switchMap(() => http.get<Playground[]>('assets/copenhagen.json'))
      ), { initialValue: [] });
  }

}
