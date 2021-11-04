import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'loop-params',
  templateUrl: './params.component.html',
  styleUrls: ['./params.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParamsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
