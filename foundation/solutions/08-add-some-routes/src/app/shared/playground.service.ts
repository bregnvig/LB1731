import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, shareReplay } from "rxjs";
import { Playground } from "./playground";

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  playgrounds$: Observable<Playground[]>;

  constructor(http: HttpClient) {
    this.playgrounds$ = http.get<Playground[]>(`copenhagen.json`).pipe(
      shareReplay(1)
    );
  }

  getPlaygrounds(): Observable<Playground[]> {
    return this.playgrounds$;
  }

  find(id: string): Observable<Playground | undefined> {
    return this.playgrounds$.pipe(
      map(playgrounds => playgrounds.find(p => p.id === id))
    );
  }
}