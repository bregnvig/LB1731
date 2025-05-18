import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Playground, PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-template-outlet',
  template: `
    <ng-template #playgroundInfo let-playground>
      <h6>{{playground.name}}</h6>
      <small>{{playground.description}}</small>
    </ng-template>
    <ng-template #fancyInfo let-playground>
      <loop-fancy-playground-details [playground]="playground" />
    </ng-template>

    <h5 class="mt-5">Using filter function</h5>
    <loop-common-list-filter-filter-fn 
      class="mt-3" 
      [filterFn]="filterFn" 
      [itemTemplateRef]="playgroundInfo"/>
  `,
  standalone: false
})
export class TemplateOutletComponent {

  playgrounds$!: Observable<Playground[]>;
  filterFn?: (term: string) => Observable<Playground[]>;

  constructor(public service: PlaygroundService) {
    this.filterFn = (term: string) => this.service.playgrounds$.pipe(
      map(playgrounds => playgrounds.filter(playground => playground.name.toLocaleLowerCase().includes(term.toLocaleLowerCase())))
    );
  }
}
