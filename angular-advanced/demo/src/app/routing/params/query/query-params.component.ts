import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';
import { Playground } from 'src/app/shared';
import { LocationService, PlaygroundService } from 'src/app/shared/service';

@Component({
  selector: 'loop-query-params',
  templateUrl: './query-params.component.html',
  styleUrls: ['./query-params.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryParamsComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  filterControl = new FormControl(this.route.snapshot.params.term);
  playgrounds$: Observable<Playground[]> | undefined;
  refresh$ = new BehaviorSubject<void>(undefined);
  location$ = this.locationService.location$;

  trackById = (i: number, playground: Playground): string => playground.id;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: PlaygroundService,
    private locationService: LocationService) {
    super();
  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.filterControl.valueChanges.subscribe(term => this.router.navigate([], { queryParams: { term }, relativeTo: this.route })),
      this.route.url.subscribe(params => console.log('Params url', this.router.url)),
      this.route.queryParams.subscribe(params => console.log('Params query', params)),
    );

    const queryParams = this.route.queryParams.pipe(
      map(params => params.term),
      map(term => new RegExp(term || '', 'i'))
    );

    this.playgrounds$ = combineLatest([
      this.service.playgrounds$,
      queryParams,
    ]).pipe(
      map(([playgrounds, matcher]: [Playground[], RegExp]) => playgrounds.filter(p => matcher.test(p.name))),
    );

  }

}
