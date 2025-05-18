import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Playground } from "src/app/shared";

@Injectable({ providedIn: 'root' })
export class RxjsPlaygroundService {
  constructor(private http: HttpClient) {}

  list(): Observable<Playground[]> {
    console.log('Fetching playgrounds');
    return this.http.get<Playground[]>('assets/copenhagen.json');
  }

  update(id: string, playground: Playground): Observable<Playground> {
    // Simulate a PUT request to update the playground
    console.log('Updating playground:', playground.id);
    return of(playground);
  }
}
