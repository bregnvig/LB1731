import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { filter, map } from 'rxjs';

interface Topic {
  path: string;
  label: string;
  icon: IconName;
  description: string;
}

@Component({
    selector: 'loop-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FaIconComponent, RouterLink, RouterLinkActive, RouterOutlet]
})
export class AppComponent {
  private router = inject(Router);

  topics: Topic[] = [
    { path: '/rxjs', label: 'RxJS', icon: 'wave-square', description: 'The same playground list built imperatively and as streams, and what happens when you forget to unsubscribe.' },
    { path: '/di', label: 'DI', icon: 'syringe', description: 'From hand-wired dependencies to providers, injectors and the levels they live on.' },
    { path: '/components', label: 'Components', icon: 'cubes', description: 'Life cycle hooks, content projection, view queries, dynamic components and change detection.' },
    { path: '/reactive-forms', label: 'Reactive forms', icon: 'pen-to-square', description: 'Form groups and arrays, validators and custom form controls.' },
    { path: '/routing', label: 'Routing', icon: 'route', description: 'Matrix and query parameters, resolvers and guards.' },
    { path: '/pipes', label: 'Pipes', icon: 'filter', description: 'Built-in pipes, async, and writing your own pure and impure pipes.' },
    { path: '/signals', label: 'Signals', icon: 'signal', description: 'Equality, untracked reads, signal inputs, model, computed versus effect and linked signals.' },
    { path: '/state-management', label: 'State management', icon: 'database', description: 'Where state can live: globally, locally, in the URL, in a form or in a service store.' },
    { path: '/directives', label: 'Directives', icon: 'wand-magic-sparkles', description: 'Attribute directives change how an element looks or behaves. Structural directives add and remove elements, from ngIf and ngFor to your own.' },
  ];

  url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    ),
    { initialValue: '/' }
  );

  topic = computed(() => {
    // Compare whole segments, so /directives/... doesn't match /di
    const path = this.url().split(/[?;#]/)[0] + '/';
    return this.topics.find(t => path.startsWith(t.path + '/'));
  });
}
