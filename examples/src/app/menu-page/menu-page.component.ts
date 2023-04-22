import { Component } from '@angular/core';
import { Menu, MenuItems } from './menu.model';

@Component({
  selector: 'examples-menu-page',
  templateUrl: './menu-page.component.html',
})
export class MenuPageComponent {

  private componets: MenuItems = [
    { routerLink: '/components/hello', title: 'Hello world' },
    { routerLink: '/components/outer', title: 'Outer & inner' },
    { routerLink: '/components/interpolation', title: 'Interpolation' },
    { routerLink: '/components/property', title: 'Property' },
    { routerLink: '/components/event', title: 'Event' },
    { routerLink: '/components/twoway', title: 'Two way' },
    { routerLink: '/components/ng-if', title: '*ngIf' },
    { routerLink: '/components/ng-for', title: '*ngFor' },
  ];

  private inputOutput: MenuItems = [
    { routerLink: '/io/directly', title: 'Parent -> child directly' },
    { routerLink: '/io/intercept', title: 'Parent -> child intercept' },
    { routerLink: '/io/event', title: 'Child  -> parent' },
    { routerLink: '/io/local', title: 'Local reference variable' },
    { routerLink: '/io/viewchild', title: '@ViewChild' },
    { routerLink: '/io/viewchildren', title: '@ViewChildren    ' },
  ];

  private services: MenuItems = [
    { routerLink: '/services/no-provider', title: 'No provider' },
    { routerLink: '/counter', title: 'Counter shared' },
    { routerLink: '/services/provided', title: 'Random generator (Conviniently provided)' },
    { routerLink: '/services/factory', title: 'Random generator (Factory provided)' },
  ];

  private asyncs: MenuItems = [
    { routerLink: '/async/simple', title: 'Simple HTTP' },
    { routerLink: '/async/better', title: 'Better async service' },
    { routerLink: '/async/cached', title: 'Cached async service' },
    { routerLink: '/async/localStorage', title: 'Local storage sync & async service' },
    { routerLink: '/async/retry', title: 'Retry when service' },
    { routerLink: '/async/autoRefresh', title: 'Auto refresh service' },
    { routerLink: '/async/interval', title: 'Interval (RxJS)' },
    { routerLink: '/async/wrap', title: 'Wrap API (RxJS)' },
    { routerLink: '/async/refCount', title: 'Ref count (RxJS)' },
    { routerLink: '/async/error', title: 'Errors (RxJS)    ' },
  ];

  private pipes: MenuItems = [
    { routerLink: '/pipes/today', title: 'Today' },
    { routerLink: '/pipes/buildin', title: 'Build-in' },
    { routerLink: '/pipes/async', title: 'Async pipe' },
    { routerLink: '/pipes/chaining', title: 'Chaining' },
    { routerLink: '/pipes/phone', title: 'Phone pipe' },
    { routerLink: '/pipes/pure', title: 'Pure vs. impure' },
  ];

  private routes: MenuItems = [
    { routerLink: '/orders', title: 'Orders' }
  ];

  private forms: MenuItems = [
    { routerLink: '/form/person4', title: 'Person form ngForm template reference variable' },
    { routerLink: '/form/person1', title: 'Person form two way binding' },
    { routerLink: '/form/oneway', title: 'Person form one way binding' },
    { routerLink: '/form/person5', title: 'Person form ngForm no domain model' },
    { routerLink: '/form/person3', title: 'Person form Error message' },
    { routerLink: '/form/person2', title: 'Person form CSS classes' },
    { routerLink: '/form/model-driven', title: 'Model driven person form' },
    { routerLink: '/form/search', title: 'Search stand alone    ' },
  ];

  menues: Menu[] = [
    {
      title: 'Components',
      items: this.componets,
    },
    {
      title: 'Input & output',
      items: this.inputOutput
    },
    {
      title: 'Services',
      items: this.services,
    },
    {
      title: 'Async',
      items: this.asyncs
    },
    {
      title: 'Pipes',
      items: this.pipes
    }, {
      title: 'Routes',
      items: this.routes
    },
    {
      title: 'Forms',
      items: this.forms
    }
  ];


}
