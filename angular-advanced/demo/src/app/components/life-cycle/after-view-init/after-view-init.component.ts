import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbAccordionDirective } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'loop-after-view-init',
  templateUrl: './after-view-init.component.html',
  styleUrls: ['./after-view-init.component.scss']
})
export class AfterViewInitComponent implements OnInit, AfterViewInitComponent {

  @ViewChild(NgbAccordionDirective) accordion!: NgbAccordionDirective;

  constructor() { }

  ngOnInit(): void {
    // this.accordion.expand('simple');
  }

  ngAfterViewInit(): void {
    this.accordion.expand('simple');
  }

}
