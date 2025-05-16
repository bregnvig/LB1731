import { inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";
import { Playground } from "../model";
import { PlaygroundService } from "../service";

export class PlaygroundStore {

  #service = inject(PlaygroundService);
  #resource = rxResource({
    loader: () => this.#service.list()
  });

  playgrounds = this.#resource.value;
  error = this.#resource.error;
  loading = this.#resource.isLoading;

  update(playground: Playground): Observable<Playground> {
    return this.#service.update(playground.id, playground).pipe(
      tap(() => this.#resource.reload())
    );
  }

  delete(playgroundId: string): Observable<void> {
    return this.#service.delete(playgroundId).pipe(
      tap(() => this.#resource.reload())
    );
  }
}