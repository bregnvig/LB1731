import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Playground } from '../model/playground';

@Service()
export class PlaygroundService {

  playgrounds$: Observable<Playground[]> = inject(HttpClient).get<Playground[]>('assets/copenhagen.json');

}
