import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';

@Component({
  moduleId: module.id,
  selector: 'app-error',
  templateUrl: 'error.component.html',
  styleUrls: ['error.component.css']
})
export class ErrorComponent implements OnInit {

  private zipcodeStream: Observable<any>
  private elapsed: number;

  constructor(private http: Http) { }

  ngOnInit() {
    console.log('HERE?!');
    
    const start: number = Date.now(); 
    this.zipcodeStream = this.http.get('404')
      .catch(() => this.http.get('another.404'))
      .catch(() => this.http.get('https://dawa.aws.dk/postnumre'))
      .catch(() => Observable.throw('Fetch no data!!'))
      .map(response => response.json())
      .finally(() => this.elapsed = Date.now() - start);
  }

}
