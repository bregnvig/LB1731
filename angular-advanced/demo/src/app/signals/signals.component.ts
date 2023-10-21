import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'loop-signals',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgbNav, NgbNavLink, NgbNavItem],
  template: `
  <ul ngbNav class="nav-tabs mb-3">
    <li ngbNavItem="without-di">
        <a ngbNavLink routerLink="with-rxjs" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Using RxJS</a>
    </li>
    <li ngbNavItem="with-di">
        <a ngbNavLink routerLink="with-signals" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Using Signals</a>
    </li>
  </ul>
  <router-outlet></router-outlet>
  `,
})
export class SignalsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
