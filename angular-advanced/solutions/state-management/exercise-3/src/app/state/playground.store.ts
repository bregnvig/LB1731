import { inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { of } from "rxjs";
import { Playground } from "../model";
import { PlaygroundService } from "../service";

export class PlaygroundStore {

  #service = inject(PlaygroundService);
  #playgroundsResource = rxResource({
    loader: () => this.#service.list()
  });
  #updateResource = rxResource({
    request: () => this.#updatePlayground(),
    loader: ({ request }) => request ? this.#service.update(request.id, request) : of(undefined)
  });

  #deleteResource = rxResource({
    request: () => this.#deletePlayground(),
    loader: ({ request }) => request ? this.#service.delete(request) : of(undefined)
  });

  playgrounds = this.#playgroundsResource.value;
  playgroundsError = this.#playgroundsResource.error;
  loading = this.#playgroundsResource.isLoading;

  #updatePlayground = signal<Playground | null>(null);
  #deletePlayground = signal<string | null>(null);

  updateError = this.#updateResource.error;
  deleteError = this.#deleteResource.error;

  update(playground: Playground): void {
    this.#updatePlayground.set(playground);
  }

  delete(playgroundId: string): void {
    this.#deletePlayground.set(playgroundId);
  }
}