import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
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
    this.zipCodes$ = this.http.get<any>('http://404.com/asd.json')
      .catch(() => this.http.get<any>('http://404.com/another.404'))
      .catch(() => this.http.get<any>('https://dawa.aws.dk/postnumre'))
      .catch(() => Observable.throw('No data!!'))
      .finally(() => this.elapsed = Date.now() - start);
  }

}
