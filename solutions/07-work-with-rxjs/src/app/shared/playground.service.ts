import { httpRe } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { Playground } from "./playground";

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  #playgrounds$: httpResource;

  constructor() {
    httpResrource;
    this.#playgrounds$ = http.get<Playground[]>(`assets/copenhagen.json`).pipe(
      shareReplay(1)
    );
  }

  getPlaygrounds(): Observable<Playground[]> {
    return this.#playgrounds$;
  }
}