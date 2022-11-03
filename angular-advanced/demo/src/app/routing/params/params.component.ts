import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, merge, Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';
import { Playground } from 'src/app/shared';
import { LocationService, PlaygroundService } from 'src/app/shared/service';

@Component({
  selector: 'loop-params',
  templateUrl: './params.component.html',
  styleUrls: ['./params.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParamsComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  fg = this.fb.group({
    filter: [this.route.snapshot.params.term || this.route.snapshot.queryParams.term],
    useQueryParams: [this.route.snapshot.params.useQueryParams || this.route.snapshot.queryParams.useQueryParams],
  });
  playgrounds$: Observable<Playground[]> | undefined;
  refresh$ = new BehaviorSubject<void>(undefined);
  location$ = this.locationService.location$;

  trackById = (i: number, playground: Playground): string => playground.id;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: PlaygroundService,
    private locationService: LocationService) {
    super();
  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.fg.valueChanges.subscribe(({ useQueryParams, filter }) => {
        useQueryParams
          ? this.router.navigate([], { queryParams: { term: filter, useQueryParams }, })
          : this.router.navigate([{ term: filter, useQueryParams }], { relativeTo: this.route });
      }),
      this.route.url.subscribe(params => console.log('Params url', this.router.url)),
      this.route.params.subscribe(params => console.log('Params matrix', params)),
      this.route.queryParams.subscribe(params => console.log('Params query', params)),
    );


    const matrixParams = this.route.params.pipe(
      filter(params => params.term),
      map(params => params.term),
      map(term => new RegExp(term || '', 'i')),
      startWith(new RegExp('', 'i'))
    );

    const queryParams = this.route.queryParams.pipe(
      filter(params => params.term),
      map(params => params.term),
      map(term => new RegExp(term || '', 'i'))
    );

    this.playgrounds$ = combineLatest([
      this.service.playgrounds$,
      merge(matrixParams, queryParams),
    ]).pipe(
      map(([playgrounds, matcher]: [Playground[], RegExp]) => playgrounds.filter(p => matcher.test(p.name))),
    );

  }

}
