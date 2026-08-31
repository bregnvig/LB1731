
import { Observable, throwError } from 'rxjs';

import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';


import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-error',
    template: `
      <h2>Errors</h2>
      <p>
        It took {{elapsed}} ms
      </p>
      <ul class="list-group">
        @for (postNummer of zipCodes$ | async; track postNummer) {
          <li class="list-group-item">
            {{postNummer.nr}} - {{postNummer.navn}}
          </li>
        }
      </ul>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AsyncPipe]
})
export class ErrorComponent implements OnInit {

  protected zipCodes$!: Observable<any>;
  protected elapsed: number = 0;

  private http = inject(HttpClient);

  constructor() { }

  ngOnInit() {
    const start: number = Date.now();
    this.zipCodes$ = this.http.get<any>('http://404.com/asd.json').pipe(
      catchError(() => this.http.get<any>('http://404.com/another.404')),
      catchError(() => this.http.get<any>('https://dawa.aws.dk/postnumre')),
      catchError(() => throwError('No data!!')),
      finalize(() => this.elapsed = Date.now() - start),
    );
  }

}
