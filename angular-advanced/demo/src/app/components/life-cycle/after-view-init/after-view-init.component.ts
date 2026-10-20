import { AfterViewInit, Component, OnInit, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgbAccordionDirective } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'loop-after-view-init',
    templateUrl: './after-view-init.component.html',
    styleUrls: ['./after-view-init.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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
