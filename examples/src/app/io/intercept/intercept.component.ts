import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-intercept-child',
  template: '<p>{{value}}</p>'
})
export class InterceptChildComponent {
  private _value?: string;

  @Input()
  set value(value: string | undefined) {
    this._value = value?.toUpperCase();
  }

  get value() {
    return this._value;
  }
}

@Component({
  selector: 'app-intercept',
  templateUrl: './intercept.component.html',
  styleUrls: ['./intercept.component.css'],
})
export class InterceptComponent implements OnInit {

  fromProperty = 'From property';

  ngOnInit() {
  }

}
