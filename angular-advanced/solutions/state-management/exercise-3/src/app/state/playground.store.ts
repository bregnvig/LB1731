import { inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { of, tap } from "rxjs";
import { Playground } from "../model";
import { PlaygroundService } from "../service";

export class PlaygroundStore {

  #service = inject(PlaygroundService);
  #playgroundsResource = rxResource({
    stream: () => this.#service.list()
  });
  #updateResource = rxResource({
    params: () => this.#updatePlayground(),
    stream: ({ params }) => params ? this.#service.update(params.id, params).pipe(
      tap(() => this.#playgroundsResource.reload())
    ) : of(undefined)
  });
  #deleteResource = rxResource({
    params: () => this.#deletePlayground(),
    stream: ({ params }) => params ? this.#service.delete(params).pipe(
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