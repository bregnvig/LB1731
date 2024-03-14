import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Playground } from 'src/app/shared';

@Component({
  selector: 'loop-resolver',
  template: `
    @if (playground$ | async; as playground) {
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{playground?.name}}</h5>
          <p class="card-text">{{playground?.description}}</p>
          <p class="card-text">{{playground?.addressDescription}}</p>
        </div>
      </div>
    }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResolverComponent {

  playground$: Observable<Playground | undefined> = this.route.data.pipe(map(data => data.playground));

  constructor(private route: ActivatedRoute) { }


}
