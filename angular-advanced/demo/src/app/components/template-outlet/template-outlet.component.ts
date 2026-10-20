import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Playground, PlaygroundService } from 'src/app/shared';
import { FancyPlaygroundDetailsComponent } from '../dynamic-component/fancy-playground-details/fancy-playground-details.component';
import { CommonListFilterFilterFnComponent } from './common-list-filter-filter-fn/common-list-filter-filter-fn.component';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FancyPlaygroundDetailsComponent, CommonListFilterFilterFnComponent]
})
export class TemplateOutletComponent {

  #playgrounds = toSignal(inject(PlaygroundService).playgrounds$, { initialValue: [] });

  filterFn = (term: string): Playground[] => this.#playgrounds()
    .filter(playground => playground.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
}
