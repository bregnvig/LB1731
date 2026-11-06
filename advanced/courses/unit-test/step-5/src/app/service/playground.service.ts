import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { filterPlaygrounds } from '../model/filter-playgrounds';
import { Playground } from '../model/playground';

@Service()
export class PlaygroundService {

  playgrounds$: Observable<Playground[]> = inject(HttpClient).get<Playground[]>('assets/copenhagen.json');

  search(query: string): Observable<Playground[]> {
    return this.playgrounds$.pipe(map(playgrounds => filterPlaygrounds(playgrounds, query)));
  }

}
