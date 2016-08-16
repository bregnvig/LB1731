import { Component, OnInit, Input } from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'app-directly-child',
  template: '<p>{{value}}</p> <p>{{value2}}</p>'
})
export class DirectlyChildComponent {
  @Input() public value: string;
  @Input('renamed-value') public value2: string;

}

@Component({
  moduleId: module.id,
  selector: 'app-directly',
  templateUrl: 'directly.component.html',
  styleUrls: ['directly.component.css'],
})
export class DirectlyComponent implements OnInit {

  public fromProperty = 'From property';

  constructor() { }

  ngOnInit() {
  }

}

