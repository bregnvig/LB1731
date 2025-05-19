import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { Playground } from 'src/app/shared';
import { RxresourcePlaygroundService } from './rxresource-playground.service';

@Injectable()
export class RxresourcePlaygroundStore {

  #service = inject(RxresourcePlaygroundService);
  #resource = rxResource({
    loader: () => this.#service.list()
  });
  #updateError = signal<any>(undefined);
  error = computed(() => this.#resource.error() ?? this.#updateError());
  loading = this.#resource.isLoading;
  playgrounds = this.#resource.value.asReadonly();

  update(playground: Playground): Promise<Playground> {
    return firstValueFrom(this.#service.update(playground.id, playground))
      .then(playground => {
        this.#resource.reload();
        return playground;
      });
  }
}

