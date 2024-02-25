
import { Observable, throwError } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';


import { HttpClient } from '@angular/common/http';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    standalone: true,
    imports: [NgFor, AsyncPipe],
})
export class ErrorComponent implements OnInit {

  zipCodes$!: Observable<any>;
  elapsed: number = 0;

  constructor(private http: HttpClient) { }

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
