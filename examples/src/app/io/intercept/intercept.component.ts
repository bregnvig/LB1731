import { Component, OnInit, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-intercept-child',
  template: '<p>{{value}}</p>'
})
class InterceptChildComponent {
  public _value: string;

  @Input()
  public get value() {
    return this._value;
  }

  public set value(value: string) {
    this._value = value.toUpperCase();
  }
}

@Component({
  moduleId: module.id,
  selector: 'app-intercept',
  templateUrl: 'intercept.component.html',
  styleUrls: ['intercept.component.css'],
  directives: [ InterceptChildComponent]
})
export class InterceptComponent implements OnInit {

  public fromProperty = 'From property';

  ngOnInit() {
  }

}
