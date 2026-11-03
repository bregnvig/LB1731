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

    <h5>Using filter function</h5>
    <div class="split">
      <loop-common-list-filter-filter-fn
        [filterFn]="filterFn"
        [itemTemplateRef]="playgroundInfo"/>
      <code><pre ngNonBindable>&lt;ng-template #playgroundInfo let-playground&gt;
  &lt;h6&gt;&#123;&#123;playground.name&#125;&#125;&lt;/h6&gt;
  &lt;small&gt;&#123;&#123;playground.description&#125;&#125;&lt;/small&gt;
&lt;/ng-template&gt;

&lt;loop-common-list-filter-filter-fn
  [filterFn]="filterFn"
  <strong>[itemTemplateRef]="playgroundInfo"</strong>/&gt;</pre></code>
    </div>
  `,
  styles: `
    @import "src/scss/variables";

    // The list beside the template it stamps, like a live preview next to its code
    .split {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
      align-items: start;
      gap: 1.5rem;
    }

    pre {
      position: sticky;
      top: 1rem;
      margin: 0;
    }

    h5 {
      font-size: 1.25rem;
      font-stretch: 80%;
    }

    // The #playgroundInfo template, stamped into each row by the list
    h6 {
      margin: 0 0 .125rem;
      font-weight: 650;
    }

    small {
      color: $muted;
    }

    @media (max-width: 767.98px) {
      .split { grid-template-columns: minmax(0, 1fr); }
      pre { position: static; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FancyPlaygroundDetailsComponent, CommonListFilterFilterFnComponent]
})
export class TemplateOutletComponent {

  #playgrounds = toSignal(inject(PlaygroundService).playgrounds$, { initialValue: [] });

  filterFn = (term: string): Playground[] => this.#playgrounds()
    .filter(playground => playground.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
}
