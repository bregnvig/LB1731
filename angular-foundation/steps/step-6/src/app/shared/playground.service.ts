import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { Playground } from "./playground";

@Service()
export class PlaygroundService {

  playgrounds$: Observable<Playground[]>;

  constructor() {
    const http = inject(HttpClient);
    this.playgrounds$ = http.get<Playground[]>(`copenhagen.json`).pipe(
      shareReplay(1)
    );
  }

  getPlaygrounds(): Observable<Playground[]> {
    return this.playgrounds$;
  }

}