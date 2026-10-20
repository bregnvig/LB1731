import { ChangeDetectionStrategy, Component, afterNextRender, viewChild } from '@angular/core';
import { NgbAccordionBody, NgbAccordionButton, NgbAccordionCollapse, NgbAccordionDirective, NgbAccordionHeader, NgbAccordionItem, NgbAccordionToggle, NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'loop-after-next-render',
  templateUrl: './after-view-init.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgbAccordionDirective, NgbAccordionItem, NgbAccordionHeader, NgbAccordionToggle, NgbAccordionButton, NgbCollapse, NgbAccordionCollapse, NgbAccordionBody]
})
export class AfterNextRender {

  accordion = viewChild.required(NgbAccordionDirective);

  constructor() {
    // this.accordion.expand('simple');
    afterNextRender(() => this.accordion().expand('simple'));
  }

}
