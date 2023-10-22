import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { interval, switchMap } from 'rxjs';
import { Playground } from './model';

@Component({
    selector: 'loop-what-happens-rxjs',
    standalone: true,
    imports: [CommonModule],
    template: `
    <p>
      what-happens-rxjs works!
      {{playgrounds.length}}
    </p>
  `,
    styles: [
    ]
})
export class WhatHappensRxjsComponent {

    playgrounds: Playground[] = [];

    constructor(http: HttpClient) {
        interval(1000).pipe(
            switchMap(() => http.get<Playground[]>('assets/copenhagen.json'))
        ).subscribe(playgrounds => this.playgrounds = playgrounds);
    }

}
