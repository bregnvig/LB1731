import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'loop-state-management',
  template: `
    <ul ngbNav class="nav-tabs mb-3">
      <li ngbNavItem="global-state">
        <a ngbNavLink routerLink="global-state" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Global state</a>
      </li>
      <li ngbNavItem="local-state">
        <a ngbNavLink routerLink="local-state" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Local state</a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  `,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgbNav, NgbNavLink, NgbNavItem],
})
export class StateManagementComponent {
  constructor() {
    console.log('StateManagementComponent initialized');
  }
}
