import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'loop-signals',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgbNav, NgbNavLink, NgbNavItem],
  template: `
  <ul ngbNav class="nav-tabs mb-3">
    <li ngbNavItem="playgrounds-rxjs">
        <a ngbNavLink routerLink="playgrounds-rxjs" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Playgrounds RxJS</a>
    </li>
    <li ngbNavItem="playgrounds-signals">
        <a ngbNavLink routerLink="playgrounds-signals" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Playgrounds Signals</a>
    </li>
    <li ngbNavItem="location-rxjs">
        <a ngbNavLink routerLink="location-rxjs" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Location RxJS</a>
    </li>
    <li ngbNavItem="location-signals">
        <a ngbNavLink routerLink="location-signals" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Location Signals</a>
    </li>
    <li ngbNavItem="equality">
        <a ngbNavLink routerLink="equality" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Equality</a>
    </li>
    <li ngbNavItem="untracked">
        <a ngbNavLink routerLink="untracked" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Untracked</a>
    </li>
    <li ngbNavItem="inputs">
        <a ngbNavLink routerLink="inputs" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inputs</a>
    </li>
  </ul>
  <router-outlet></router-outlet>
  `,
})
export class SignalsComponent {
}
