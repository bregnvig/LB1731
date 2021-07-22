import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'loop-life-cycle',
  templateUrl: './life-cycle.component.html',
  styleUrls: ['./life-cycle.component.scss']
})
export class LifeCycleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
