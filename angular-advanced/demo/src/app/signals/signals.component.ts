import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'loop-signals',
    imports: [RouterLink, RouterLinkActive, RouterOutlet, NgbNav, NgbNavLink, NgbNavItem],
    template: `
  <ul ngbNav class="nav-tabs mb-3">
    <li ngbNavItem="equality">
        <a ngbNavLink routerLink="equality" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Equality</a>
    </li>
    <li ngbNavItem="untracked">
        <a ngbNavLink routerLink="untracked" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Untracked</a>
    </li>
    <li ngbNavItem="inputs">
        <a ngbNavLink routerLink="inputs" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inputs</a>
    </li>
    <li ngbNavItem="model">
        <a ngbNavLink routerLink="model" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Model</a>
    </li>
    <li ngbNavItem="infinite-loop">
        <a ngbNavLink routerLink="infinite-loop" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Infinite loop</a>
    </li>
    <li ngbNavItem="location">
        <a ngbNavLink routerLink="location" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Location RxJS</a>
    </li>
    <li ngbNavItem="playgrounds">
        <a ngbNavLink routerLink="playgrounds" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Playgrounds</a>
    </li>
  </ul>
  <router-outlet></router-outlet>
  `
})
export class SignalsComponent {
}
