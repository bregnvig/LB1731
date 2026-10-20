import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'loop-components',
    templateUrl: './components.component.html',
    styleUrls: ['./components.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgbNav, NgbNavItem, NgbNavLink, RouterLink, RouterLinkActive, RouterOutlet]
})
export class ComponentsComponent {

}
