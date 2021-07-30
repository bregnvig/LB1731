import { Component, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Playground, PlaygroundService } from 'src/app/shared';
import { CommonFilterListComponent } from './common-filter-list/common-filter-list.component';

@Component({
  selector: 'loop-template-outlet',
  template: `
    <loop-common-filter-list [items]="playgrounds$ | async" [itemTemplateRef]="playgroundInfo"></loop-common-filter-list>
    <ng-template #playgroundInfo let-playground>
      {{playground.name}}
    </ng-template>
  `,
})
export class TemplateOutletComponent implements OnInit {

  @ViewChild(CommonFilterListComponent, { static: true }) filterComponent!: CommonFilterListComponent;
  playgrounds$!: Observable<Playground[]>;

  constructor(private service: PlaygroundService) { }

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
