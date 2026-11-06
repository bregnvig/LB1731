import { AfterViewInit, Component, OnInit, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgbAccordionBody, NgbAccordionButton, NgbAccordionCollapse, NgbAccordionDirective, NgbAccordionHeader, NgbAccordionItem, NgbAccordionToggle, NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'loop-after-view-init',
    templateUrl: './after-view-init.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgbAccordionDirective, NgbAccordionItem, NgbAccordionHeader, NgbAccordionToggle, NgbAccordionButton, NgbCollapse, NgbAccordionCollapse, NgbAccordionBody]
})
export class AfterViewInitComponent implements OnInit, AfterViewInit {

  accordion = viewChild.required(NgbAccordionDirective);

  constructor() { }

  ngOnInit(): void {
    // this.accordion.expand('simple');
  }

  ngAfterViewInit(): void {
    this.accordion().expand('simple');
  }

}
