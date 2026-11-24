import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Menu } from '../menu.model';
import { RouterLinkActive, RouterLink } from '@angular/router';


@Component({
    selector: 'examples-menu',
    template: `
      <div class="card h-100 menu-card">
        <div class="card-header d-flex align-items-center justify-content-between">
          <h5 class="card-title mb-0">{{menuss().title}}</h5>
          <span class="badge bg-secondary">{{menuss().items.length}}</span>
        </div>
        <div class="list-group list-group-flush">
          @for (item of menuss().items; track item) {
            <a [routerLink]="item.routerLink" routerLinkActive="active" class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
              <span>{{item.title}}</span>
              <span class="chevron" aria-hidden="true">›</span>
            </a>
          }
        </div>
      </div>
    `,
    styles: `
      @import "src/scss/variables";

      .menu-card {
        overflow: hidden;
        border: 1px solid $gray-200;
        transition: transform .15s ease, box-shadow .15s ease;

        &:hover {
          box-shadow: 0 0 0 1px rgba($navy, .08), 0 8px 24px -8px rgba($navy, .18);
        }
      }

      .card-header {
        background: $gray-100;
        border-bottom: 1px solid $gray-200;
        padding: .875rem 1.125rem;
      }

      .card-title {
        color: $ink;
        font-size: 1rem;
        letter-spacing: -.01em;
      }

      .list-group-item {
        font-size: .9rem;
        font-weight: 500;
        color: $gray-700;
        padding: .625rem 1.125rem;
        transition: background-color .12s ease, color .12s ease;

        .chevron {
          color: $gray-400;
          font-family: $font-family-monospace;
          font-size: 1rem;
          line-height: 1;
          transition: transform .12s ease, color .12s ease;
        }

        &:hover {
          color: $navy;
          background: $gray-100;

          .chevron {
            color: $cobalt;
            transform: translateX(2px);
          }
        }
      }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLinkActive, RouterLink]
})
export class MenuComponent {

  menuss = input.required<Menu>();

}
