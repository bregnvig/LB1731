import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'loop-select-all',
  templateUrl: './select-all.component.html',
  styleUrls: ['./select-all.component.scss']
})
export class SelectAllComponent implements OnInit {

  text = 'lorem ipsum dolor';

  constructor() { }

  ngOnInit(): void {
  }

}
