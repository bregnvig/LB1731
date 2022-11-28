import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Menu } from '../menu.model';

@Component({
  selector: 'examples-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

  @Input() menuss!: Menu;

}
