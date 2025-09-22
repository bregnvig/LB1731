import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, tap } from 'rxjs';
import { Playground } from 'src/app/shared';
import { RxresourcePlaygroundService } from './rxresource-playground.service';

@Injectable()
export class RxresourcePlaygroundStore {

  #service = inject(RxresourcePlaygroundService);
  #playgroundsResource = rxResource({ stream: () => this.#service.list(), defaultValue: [] });

  #update = signal<Playground | undefined>(undefined);
  #updateResource = rxResource({
    params: () => this.#update(),
    stream: ({ params: playground }) => !playground ? of(null) : this.#service.update(playground).pipe(
      tap(() => this.#playgroundsResource.reload())
    ),
  });

  readonly playgrounds = this.#playgroundsResource.value.asReadonly();
  readonly playgroundsError = this.#playgroundsResource.error;
  readonly playgroundsLoading = this.#playgroundsResource.isLoading;
  readonly updateError = this.#updateResource.error;

  update(playground: Playground) {
    this.#update.set(playground);
  }
}

