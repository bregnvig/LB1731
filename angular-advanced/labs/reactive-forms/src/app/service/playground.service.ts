import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Playground } from '../model';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  playgrounds$: Observable<Playground[]>;

  constructor(http: HttpClient) {
    this.playgrounds$ = http.get<Playground[]>('assets/copenhagen.json');
  }
}
