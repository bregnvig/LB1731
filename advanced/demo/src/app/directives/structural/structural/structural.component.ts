import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'loop-structural',
    templateUrl: './structural.component.html',
    styleUrls: ['./structural.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class StructuralComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
