import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom, of, tap } from 'rxjs';
import { Playground } from 'src/app/shared';
import { RxresourcePlaygroundService } from './rxresource-playground.service';

@Injectable()
export class RxresourcePlaygroundStore {

  #service = inject(RxresourcePlaygroundService);
  #playgroundsResource = rxResource({ loader: () => this.#service.list() });

  #update = signal<Playground | undefined>(undefined);
  #updateResource = rxResource({
    request: () => this.#update(),
    loader: ({ request: playground }) => !playground ? of(null) : this.#service.update(playground.id, playground).pipe(
      tap(() => this.#playgroundsResource.reload())
    )
  });

  readonly playgrounds = this.#playgroundsResource.value.asReadonly();
  readonly playgroundsError = this.#playgroundsResource.error;
  readonly playgroundsLoading = this.#playgroundsResource.isLoading;
  readonly updateError = this.#updateResource.error;

  update(playground: Playground) {
    this.#update.set(playground);
  }
}

