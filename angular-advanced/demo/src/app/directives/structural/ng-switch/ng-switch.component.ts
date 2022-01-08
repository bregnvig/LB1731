import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'loop-ng-switch',
  templateUrl: './ng-switch.component.html',
  styleUrls: ['./ng-switch.component.scss']
})
export class NgSwitchComponent implements OnInit {

  selectedNumber: number | undefined;

  constructor() { }

  ngOnInit(): void {
    setInterval(() => this.selectedNumber = ((this.selectedNumber ?? 0) + 1) % 3, 1000);
  }

}
