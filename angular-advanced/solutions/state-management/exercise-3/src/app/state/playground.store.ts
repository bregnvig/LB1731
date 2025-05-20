import { inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { of, tap } from "rxjs";
import { Playground } from "../model";
import { PlaygroundService } from "../service";

export class PlaygroundStore {

  #service = inject(PlaygroundService);
  #playgroundsResource = rxResource({
    loader: () => this.#service.list()
  });
  #updateResource = rxResource({
    request: () => this.#updatePlayground(),
    loader: ({ request }) => request ? this.#service.update(request.id, request).pipe(
      tap(() => this.#playgroundsResource.reload())
    ) : of(undefined)
  });
  #deleteResource = rxResource({
    request: () => this.#deletePlayground(),
    loader: ({ request }) => request ? this.#service.delete(request).pipe(
      tap(() => this.#playgroundsResource.reload())
    ) : of(undefined)
  });

  readonly playgrounds = this.#playgroundsResource.value.asReadonly();
  readonly playgroundsError = this.#playgroundsResource.error;
  readonly loading = this.#playgroundsResource.isLoading;
  readonly updateError = this.#updateResource.error;
  readonly deleteError = this.#deleteResource.error;

  #updatePlayground = signal<Playground | null>(null);
  #deletePlayground = signal<string | null>(null);

  update(playground: Playground): void {
    this.#updatePlayground.set(playground);
  }

  delete(playgroundId: string): void {
    this.#deletePlayground.set(playgroundId);
  }
}