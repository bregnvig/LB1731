
import {throwError,  Observable } from 'rxjs';

import {finalize, catchError} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';


import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  public zipCodes$: Observable<any>
  public elapsed: number;

  constructor(private http: HttpClient) { }

  public ngOnInit() {
    const start: number = Date.now();
    this.zipCodes$ = this.http.get<any>('http://404.com/asd.json').pipe(
      catchError(() => this.http.get<any>('http://404.com/another.404')),
      catchError(() => this.http.get<any>('https://dawa.aws.dk/postnumre')),
      catchError(() => throwError('No data!!')),
      finalize(() => this.elapsed = Date.now() - start),
    );
  }

}
