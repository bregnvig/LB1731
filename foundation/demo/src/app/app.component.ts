import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

interface TopicExample {
  routerLink: string;
  title: string;
}

interface Topic {
  id: string;
  label: string;
  entryPath: string;
  prefixes: string[];
  description: string;
  items: TopicExample[];
}

@Component({
    selector: 'app-root',
    template: `
      <header class="band">
        <div class="bar">
          <a class="brand" routerLink="/menu">
            <img class="rainbow-hover" src="angular.png" alt="" height="30">
            Angular Foundation
          </a>
          <nav aria-label="Topics">
            <a routerLink="/menu" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" ariaCurrentWhenActive="page">Menu</a>
            @for (topic of topics; track topic.id) {
              <a [routerLink]="topic.entryPath" [class.active]="activeTopic()?.id === topic.id">{{ topic.label }}</a>
            }
          </nav>
          <a class="repo-link" href="https://github.com/bregnvig/LB1731" target="_blank" rel="noopener noreferrer" title="Go to repository" aria-label="Go to GitHub repository">
            <img src="github.svg" alt="" height="22" width="22">
          </a>
        </div>

        <div class="title">
          <span class="topic-icon" aria-hidden="true">
            @switch (activeTopic()?.id) {
              @case ('components') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              }
              @case ('io') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              }
              @case ('services') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              }
              @case ('async') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              }
              @case ('pipes') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              }
              @case ('routes') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
              }
              @case ('forms') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              }
              @default {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
              }
            }
          </span>
          <h1>{{ activeTopic()?.label ?? 'Angular Foundation' }}</h1>
          <p>{{ activeTopic()?.description ?? 'Interactive course examples covering components, input & output, services, async & RxJS, pipes, routing and forms.' }}</p>
        </div>
      </header>

      <main class="stage">
        @if (activeTopic(); as topic) {
          @if (topic.items.length > 1) {
            <ul class="nav nav-tabs">
              @for (item of topic.items; track item.routerLink) {
                <li class="nav-item">
                  <a class="nav-link" [routerLink]="item.routerLink" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    {{ item.title }}
                  </a>
                </li>
              }
            </ul>
          }
        }
        <router-outlet />
      </main>
    `,
    styles: `
      @import "src/scss/variables";

      :host {
        display: block;
        min-height: 100vh;
        padding-bottom: 4rem;
        background: $canvas;
      }

      .band {
        position: relative;
        padding: 0 2.5rem 7.5rem;
        background-color: $navy;
        background-image:
          linear-gradient(rgba($signal, .06) 1px, transparent 1px),
          linear-gradient(90deg, rgba($signal, .06) 1px, transparent 1px);
        background-size: 32px 32px;
        color: $white;
        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 3px;
          background: $signal-gradient;
        }
      }

      .bar {
        display: flex;
        align-items: center;
        gap: 2rem;
        padding: 1.25rem 0;
      }

      .brand {
        display: flex;
        flex: none;
        align-items: center;
        gap: .625rem;
        color: $white;
        font-weight: 700;
        font-stretch: 85%;
        font-size: 1.0625rem;
        text-decoration: none;
      }

      nav {
        display: flex;
        flex-wrap: wrap;
        gap: .125rem;

        a {
          padding: .375rem .75rem;
          border-radius: .3rem;
          color: rgba($white, .65);
          font-family: $font-family-monospace;
          font-weight: 500;
          font-size: .8125rem;
          white-space: nowrap;
          text-decoration: none;

          &:hover {
            color: $white;
            background: rgba($white, .08);
          }

          &.active {
            color: $navy;
            background: $signal;
          }

          &:focus-visible {
            outline: 2px solid $signal;
            outline-offset: 2px;
          }
        }
      }

      .repo-link {
        margin-left: auto;
        display: grid;
        place-items: center;
        flex: none;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: .375rem;
        opacity: .75;
        transition: opacity .15s ease, background-color .15s ease;

        &:hover {
          opacity: 1;
          background: rgba($white, .08);
        }

        &:focus-visible {
          outline: 2px solid $signal;
          outline-offset: 2px;
        }
      }

      .title {
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 1.25rem;
        align-items: end;
        max-width: 84rem;
        margin: 3rem auto 0;

        .topic-icon {
          grid-row: span 2;
          align-self: start;
          display: grid;
          place-items: center;
          width: 4.5rem;
          height: 4.5rem;
          border-radius: $border-radius-xl;
          background: $signal-gradient;
          color: $navy;
          box-shadow: 0 0 32px -4px rgba($signal, .7);

          svg {
            width: 1.875rem;
            height: 1.875rem;
          }
        }

        h1 {
          margin: 0;
          color: $white;
          font-size: clamp(2.75rem, 5vw + 1rem, 5.5rem);
          font-weight: 700;
          letter-spacing: -.035em;
          line-height: .9;
        }

        p {
          max-width: 62ch;
          margin: .875rem 0 0;
          color: rgba($white, .7);
          font-size: 1.0625rem;
        }
      }

      .stage {
        position: relative;
        max-width: 84rem;
        margin: -5rem auto 0;
        background: $white;
        border-radius: $border-radius-xl;
        padding: 2.25rem 2.25rem 2.75rem;
        box-shadow: $stage-shadow;
      }

      @media (max-width: 1440px) {
        .stage {
          margin-inline: 2.5rem;
        }
      }

      @media (max-width: 767.98px) {
        .band {
          padding: 0 1rem 6rem;
        }

        .bar {
          flex-wrap: wrap;
          gap: .5rem;
        }

        nav {
          order: 3;
          width: 100%;
          gap: .25rem;

          a {
            padding: .1875rem .5rem;
            font-size: .75rem;
          }
        }

        .title {
          column-gap: .875rem;
          align-items: center;
          margin-top: 1rem;

          .topic-icon {
            grid-row: auto;
            width: 2.75rem;
            height: 2.75rem;
            border-radius: $border-radius-lg;

            svg {
              width: 1.25rem;
              height: 1.25rem;
            }
          }

          h1 {
            font-size: 2rem;
          }

          p {
            grid-column: 1 / -1;
            margin-top: .5rem;
            font-size: .875rem;
          }
        }

        .stage {
          margin: -4.25rem .5rem 0;
          padding: 1rem;
          border-radius: $border-radius-lg;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .brand img {
          animation: none;
        }
      }
    `,
    imports: [RouterLink, RouterLinkActive, RouterOutlet]
})
export class AppComponent {
  private router = inject(Router);

  protected topics: Topic[] = [
    {
      id: 'components',
      label: 'Components',
      entryPath: '/components/hello',
      prefixes: ['/components/'],
      description: 'Templates, interpolation, property and event binding, two-way binding and built-in control flow.',
      items: [
        { routerLink: '/components/hello', title: 'Hello world' },
        { routerLink: '/components/outer', title: 'Outer & inner' },
        { routerLink: '/components/interpolation', title: 'Interpolation' },
        { routerLink: '/components/property', title: 'Property' },
        { routerLink: '/components/event', title: 'Event' },
        { routerLink: '/components/twoway', title: 'Two way' },
        { routerLink: '/components/ng-if', title: 'if statement' },
        { routerLink: '/components/ng-for', title: 'for loop' },
      ],
    },
    {
      id: 'io',
      label: 'Input & output',
      entryPath: '/io/directly',
      prefixes: ['/io/'],
      description: 'Passing data down with inputs, emitting events up with outputs, template references and view queries.',
      items: [
        { routerLink: '/io/directly', title: 'Parent -> child directly' },
        { routerLink: '/io/intercept', title: 'Parent -> child intercept' },
        { routerLink: '/io/event', title: 'Child -> parent' },
        { routerLink: '/io/reference', title: 'Template reference variable' },
        { routerLink: '/io/viewchild', title: 'viewChild | @ViewChild' },
        { routerLink: '/io/viewchildren', title: 'viewChildren | @ViewChildren' },
      ],
    },
    {
      id: 'services',
      label: 'Services',
      entryPath: '/counter',
      prefixes: ['/services/', '/counter/'],
      description: 'Dependency injection, shared state across components and service provider scopes.',
      items: [
        { routerLink: '/services/no-provider', title: 'No provider' },
        { routerLink: '/counter', title: 'Counter shared' },
        { routerLink: '/services/provided', title: 'Random generator (Provided)' },
        { routerLink: '/services/factory', title: 'Random generator (Factory)' },
      ],
    },
    {
      id: 'async',
      label: 'Async',
      entryPath: '/async/simple',
      prefixes: ['/async/'],
      description: 'HTTP requests, caching, auto-refresh, retry strategies and RxJS streams.',
      items: [
        { routerLink: '/async/simple', title: 'Simple HTTP' },
        { routerLink: '/async/better', title: 'Better async' },
        { routerLink: '/async/cached', title: 'Cached async' },
        { routerLink: '/async/localStorage', title: 'Local storage' },
        { routerLink: '/async/retry', title: 'Retry when' },
        { routerLink: '/async/autoRefresh', title: 'Auto refresh' },
        { routerLink: '/async/interval', title: 'Interval' },
        { routerLink: '/async/refCount', title: 'Ref count' },
        { routerLink: '/async/error', title: 'Errors' },
      ],
    },
    {
      id: 'pipes',
      label: 'Pipes',
      entryPath: '/pipes/today',
      prefixes: ['/pipes/'],
      description: 'Built-in pipes, async pipe, chaining pipes and writing custom pure and impure pipes.',
      items: [
        { routerLink: '/pipes/today', title: 'Today' },
        { routerLink: '/pipes/buildin', title: 'Build-in' },
        { routerLink: '/pipes/async', title: 'Async pipe' },
        { routerLink: '/pipes/chaining', title: 'Chaining' },
        { routerLink: '/pipes/phone', title: 'Phone pipe' },
        { routerLink: '/pipes/pure', title: 'Pure vs. impure' },
      ],
    },
    {
      id: 'routes',
      label: 'Routes',
      entryPath: '/orders',
      prefixes: ['/orders/'],
      description: 'Router outlets, child routes, route parameters and programmatic navigation.',
      items: [
        { routerLink: '/orders', title: 'Orders' },
      ],
    },
    {
      id: 'forms',
      label: 'Forms',
      entryPath: '/form/template-driven',
      prefixes: ['/form/'],
      description: 'Template-driven forms, typed reactive forms, signal forms and standalone search controls.',
      items: [
        { routerLink: '/form/template-driven', title: 'Template driven form' },
        { routerLink: '/form/model-driven', title: 'Model driven form' },
        { routerLink: '/form/signal', title: 'Signal form' },
        { routerLink: '/form/search', title: 'Search stand alone' },
      ],
    },
  ];

  private url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  protected activeTopic = computed(() => {
    const path = this.url().split(/[?;#]/)[0] + '/';
    return this.topics.find(t => t.prefixes.some(prefix => path.startsWith(prefix)));
  });
}
