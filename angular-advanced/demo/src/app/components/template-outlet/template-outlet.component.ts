import { Component, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Playground, PlaygroundService } from 'src/app/shared';
import { CommonFilterListComponent } from './common-filter-list/common-filter-list.component';

@Component({
  selector: 'loop-template-outlet',
  template: `
    <h5>Using event emitter</h5>
    <loop-common-filter-list [items]="playgrounds$ | async" [itemTemplateRef]="playgroundInfo"></loop-common-filter-list>
    <h5>Using filter function</h5>
    <loop-common-list-filter-filter-fn class="mt-3" [items$]="service.playgrounds$" [filterFn]="filterFn" [itemTemplateRef]="playgroundInfo"></loop-common-list-filter-filter-fn>
    <ng-template #playgroundInfo let-playground>
      {{playground.name}}
    </ng-template>
  `,
})
export class TemplateOutletComponent implements OnInit {

  @ViewChild(CommonFilterListComponent, { static: true }) filterComponent!: CommonFilterListComponent;
  playgrounds$!: Observable<Playground[]>;
  filterFn = (term: string, playgrounds: Playground[]) => playgrounds.filter(p => p.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()));

  constructor(public service: PlaygroundService) { }

  ngOnInit(): void {
    this.playgrounds$ = combineLatest([
      this.service.playgrounds$,
      this.filterComponent.filter.pipe(
        startWith(''),
        map(term => term.toLocaleLowerCase())
      )
    ]).pipe(
      map(([playgrounds, term]) => playgrounds.filter(p => p.name.toLocaleLowerCase().includes(term)))
    );
  }

}
