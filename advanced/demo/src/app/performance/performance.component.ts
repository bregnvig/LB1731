import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'loop-performance',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgbNav, NgbNavLink, NgbNavItem],
  template: `
    <ul ngbNav class="nav-tabs mb-3">
      <li ngbNavItem="change-detection">
        <a ngbNavLink routerLink="change-detection" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Change detection</a>
      </li>
      <li ngbNavItem="defer">
        <a ngbNavLink routerLink="defer" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">&#64;defer</a>
      </li>
      <li ngbNavItem="leaks">
        <a ngbNavLink routerLink="leaks" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Leaks</a>
      </li>
      <li ngbNavItem="images">
        <a ngbNavLink routerLink="images" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">ngSrc</a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  `
})
export class PerformanceComponent {
}
