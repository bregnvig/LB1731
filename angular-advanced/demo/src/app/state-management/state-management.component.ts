import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'loop-state-management',
  template: `
    <ul ngbNav class="nav-tabs mb-3">
      <li ngbNavItem="global">
        <a ngbNavLink routerLink="global" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Global state</a>
      </li>
      <li ngbNavItem="local">
        <a ngbNavLink routerLink="local" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Local state</a>
      </li>
      <li ngbNavItem="url">
        <a ngbNavLink routerLink="url" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">URL state</a>
      </li>
      <li ngbNavItem="form">
        <a ngbNavLink routerLink="form" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Form state</a>
      </li>
      <li ngbNavItem="rxjs-store">
        <a ngbNavLink routerLink="rxjs-store" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">RxJS service store</a>
      </li>
      <li ngbNavItem="signal-store">
        <a ngbNavLink routerLink="signal-store" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Signal service store</a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  `,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgbNav, NgbNavLink, NgbNavItem],
})
export class StateManagementComponent {
}
