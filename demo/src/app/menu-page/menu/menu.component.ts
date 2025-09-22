import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Menu } from '../menu.model';
import { RouterLinkActive, RouterLink } from '@angular/router';


@Component({
    selector: 'examples-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLinkActive, RouterLink]
})
export class MenuComponent {

  @Input() menuss!: Menu;

}
