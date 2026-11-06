import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { delay, Observable, of, tap } from "rxjs";
import { Playground } from "src/app/shared";

const simulatedDelay = 1500; // Simulated delay for the backend response

@Injectable({ providedIn: 'root' })
export class RxresourcePlaygroundService {
  #http = inject(HttpClient);
  simulatedBackendSave: Playground[] = [];

  list(): Observable<Playground[]> {
    console.log('Fetching playgrounds');
    if (this.simulatedBackendSave.length) {                             // 
      return of(this.simulatedBackendSave).pipe(delay(simulatedDelay)); // THIS PART SHOULD NOT BE A PART OF YOUR SERVICE
    }                                                                   // 
    return this.#http.get<Playground[]>('assets/copenhagen.json').pipe(
      tap(playgrounds => this.simulatedBackendSave = [...playgrounds]),
      delay(simulatedDelay),
    );
  }

  update(playground: Playground): Observable<void> {
    console.log('Updating playground:', playground.id);
    this.simulatedBackendSave = this.simulatedBackendSave.map(p => p.id === playground.id ? playground : p);
    return of(void 0);
  }
}
