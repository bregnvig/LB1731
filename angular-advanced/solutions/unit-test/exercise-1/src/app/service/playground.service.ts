import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Playground } from '../model/playground';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  playgrounds$: Observable<Playground[]> = inject(HttpClient).get<Playground[]>('assets/copenhagen.json');

}
  