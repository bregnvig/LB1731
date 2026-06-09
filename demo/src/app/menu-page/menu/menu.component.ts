import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Menu } from '../menu.model';
import { RouterLinkActive, RouterLink } from '@angular/router';


@Component({
    selector: 'examples-menu',
    template: `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">{{menuss().title}}</h5>
          <div class="list-group list-group-flush">
            @for (item of menuss().items; track item) {
              <a [routerLink]="item.routerLink" routerLinkActive="active" class="list-group-item list-group-item-action">
                {{item.title}}
              </a>
            }
          </div>
        </div>
      </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLinkActive, RouterLink]
})
export class MenuComponent {

  menuss = input.required<Menu>();

}
