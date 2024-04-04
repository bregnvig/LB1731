import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Playground, PlaygroundService } from 'src/app/shared';
import { CommonFilterListComponent } from './common-filter-list/common-filter-list.component';

@Component({
  selector: 'loop-template-outlet',
  template: `
    <h5>Using event emitter</h5>
    <loop-common-filter-list [items]="playgrounds$ | async" [itemTemplateRef]="playgroundInfo"></loop-common-filter-list>
    <h5 class="mt-5">Using filter function</h5>
    <loop-common-list-filter-filter-fn 
      class="mt-3" 
      [items]="playgrounds$ | async" 
      [filterFn]="filterFn" 
      [itemTemplateRef]="playgroundInfo"/>
    <ng-template #playgroundInfo let-playground>
      <h6>{{playground.name}}</h6>
      <small>{{playground.description}}</small>
    </ng-template>
  `,
})
export class TemplateOutletComponent implements OnInit {

  @ViewChild(CommonFilterListComponent, { static: true }) filterComponent!: CommonFilterListComponent;
  playgrounds$!: Observable<Playground[]>;
  filterFn = (term: string, playground: Playground) => playground.name.toLocaleLowerCase().includes(term.toLocaleLowerCase());

  constructor(public service: PlaygroundService) { }

  ngOnInit(): void {
    this.playgrounds$ = combineLatest([
      this.service.playgrounds$,
      this.filterComponent.filter.pipe(
        startWith(''),
        map(term => new RegExp(term, 'i'))
      )
    ]).pipe(
      map(([playgrounds, term]) => playgrounds.filter(p => term.test(p.name)))
    );
  }

}
