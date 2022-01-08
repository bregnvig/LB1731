import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'loop-collapse-state',
  templateUrl: './collapse-state.component.html',
  styleUrls: ['./collapse-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapseStateComponent {

  @Input() index: number | undefined;

}
