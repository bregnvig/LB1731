import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  private zipcode$: Observable<any>
  private elapsed: number;

  constructor(private http: Http) { }

  ngOnInit() {
    const start: number = Date.now(); 
    this.zipcode$ = this.http.get('http://404.com/asd.json')
      .catch(() => this.http.get('http://404.com/another.404'))
      .catch(() => this.http.get('https://dawa.aws.dk/postnumre'))
      .catch(() => Observable.throw('Fetch no data!!'))
      .map(response => response.json())
      .finally(() => this.elapsed = Date.now() - start);
  }

}
