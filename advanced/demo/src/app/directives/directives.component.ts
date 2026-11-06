import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'loop-directives',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <nav class="nav nav-tabs" aria-label="Directives">
      @for (group of groups; track group.path) {
        <div class="group">
          <span class="group-label">{{ group.label }}</span>
          @for (tab of group.tabs; track tab.path) {
            <a class="nav-link" [routerLink]="[group.path, tab.path]" routerLinkActive="active" ariaCurrentWhenActive="page">{{ tab.label }}</a>
          }
        </div>
      }
    </nav>
    <router-outlet />
  `,
  styles: `
    @import "src/scss/variables";

    // Each kind of directive gets a quiet label in the tab track. On wide
    // screens the groups share one row with a divider, on phones each gets
    // its own rows.
    .group {
      display: contents;
    }

    .group-label {
      align-self: center;
      padding: 0 .375rem 0 .625rem;
      color: $gray-500;
      font: 500 .75rem $font-family-monospace;
    }

    .group + .group .group-label {
      margin-left: .5rem;
      padding-left: 1rem;
      border-left: 1px solid $gray-300;
    }

    @media (max-width: 767.98px) {
      .group {
        display: flex;
        flex-wrap: wrap;
        gap: .125rem;
        width: 100%;
      }

      .group-label {
        width: 100%;
        padding: .25rem .625rem .125rem;
      }

      .group + .group .group-label {
        margin: .375rem 0 0;
        padding-left: .625rem;
        border-left: 0;
        border-top: 1px solid $gray-300;
        padding-top: .5rem;
      }
    }
  `
})
export class DirectivesComponent {
  groups = [
    {
      label: 'Attribute',
      path: 'attribute',
      tabs: [
        { path: 'built-in', label: 'Built-in' },
        { path: 'built-in-class-dot', label: 'Built-in [class.]' },
        { path: 'select-all', label: 'Select all' },
        { path: 'focus-empty', label: 'Focus empty' },
      ]
    },
    {
      label: 'Structural',
      path: 'structural',
      tabs: [
        { path: 'ng-if', label: 'ngIf' },
        { path: 'ng-for', label: 'ngFor' },
        { path: 'ng-switch', label: 'ngSwitch' },
        { path: 'is-in-role', label: 'isInRole' },
        // { path: 'performance', label: 'Performance' }, (its route is commented out in structural.module.ts)
      ]
    }
  ];
}
