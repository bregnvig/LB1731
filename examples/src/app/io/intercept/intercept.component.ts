import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-intercept-child',
  template: '<p>{{value}}</p>'
})
export class InterceptChildComponent {
  private _value: string;

  @Input()
  public set value(value: string) {
    this._value = value.toUpperCase();
  }

  public get value() {
    return this._value;
  }
}

@Component({
  selector: 'app-intercept',
  templateUrl: './intercept.component.html',
  styleUrls: ['./intercept.component.css'],
})
export class InterceptComponent implements OnInit {

  public fromProperty = 'From property';

  ngOnInit() {
  }

}
