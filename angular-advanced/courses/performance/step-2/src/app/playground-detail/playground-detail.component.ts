import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { PlaygroundService } from '../service';

@Component({
  selector: 'loop-playground-detail',
  template: `
    <main class="container py-4">
      <a routerLink="/">Tilbage til kortet</a>
      @if (playground(); as playground) {
        <h1 class="mt-3">{{ playground.name }}</h1>
        <p class="text-muted">{{ playground.addressDescription }}</p>
        <p>{{ playground.description || 'Ingen beskrivelse' }}</p>
      } @else {
        <p class="mt-3">Henter legepladsen...</p>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink],
})
export class PlaygroundDetailComponent {

  private service = inject(PlaygroundService);
  playground = toSignal(inject(ActivatedRoute).params.pipe(
    switchMap(params => this.service.getById(params.id)),
  ));
}
