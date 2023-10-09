import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'loop-after-view-init',
  templateUrl: './after-view-init.component.html',
  styleUrls: ['./after-view-init.component.scss']
})
export class AfterViewInitComponent implements OnInit, AfterViewInitComponent {

  @ViewChild(NgbAccordion, { static: true }) accordion!: NgbAccordion;

  constructor() { }

  ngOnInit(): void {
    // this.accordion.expand('simple');
  }

  ngAfterViewInit(): void {
    this.accordion.expand('simple');
  }

}
