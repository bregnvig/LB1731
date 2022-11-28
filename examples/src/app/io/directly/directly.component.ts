import { ChangeDetectionStrategy, Component, Input } from '@angular/core';


@Component({
  selector: 'app-directly-child',
  template: '<p>{{value1}}</p> <p>{{value2}}</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectlyChildComponent {
  @Input() value1?: string;
  @Input() value2?: string;

}

@Component({
  selector: 'app-directly',
  templateUrl: './directly.component.html',
  styleUrls: ['./directly.component.css'],
})
export class DirectlyComponent {

  fromProperty = 'From property';

}

