import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { merge, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AbstractSubscribeUnsubscribeDirective, truthy } from 'src/app/rxjs/rxjs-utils';
import { Playground, PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-playground-details',
  template: `
    @if (playground$ |async; as playground) {
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{playground?.name}}</h5>
          <p class="card-text">{{playground?.description}}</p>
          <p class="card-text">{{playground?.addressDescription}}</p>
        </div>
      </div>
    }
    `,
  styleUrls: ['./playground-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaygroundDetailsComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  playground$!: Observable<Playground | undefined>;

  constructor(private service: PlaygroundService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    const matrixPlayground$ = this.route.params.pipe(
      map(params => params.playgroundId),
      truthy(),
      switchMap(playgroundId => this.service.getById(playgroundId))
    );
    const queryPlayground$ = this.route.queryParams.pipe(
      map(params => params.playgroundId),
      truthy(),
      switchMap(playgroundId => this.service.getById(playgroundId))
    );
    this.playground$ = merge(
      matrixPlayground$,
      queryPlayground$
    );
    this.subscriptions.push(
      this.route.params.subscribe(params => console.log('Details matrix', params)),
      this.route.queryParams.subscribe(params => console.log('Details query', params)),
    );
  }

}
