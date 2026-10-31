# Angular Advanced - Course Description

A Lund&Bendsen course covering advanced Angular topics through hands-on exercises built around a playground-finder application (Copenhagen/Aarhus playgrounds with geolocation, maps, and filtering).

## Course Modules

### 1. RxJS (slides 3-59)

Reactive programming with RxJS in Angular. Covers why reactive paradigms matter for UI development, comparing imperative vs. reactive approaches side by side.

**Topics covered:**
- Reactive programming fundamentals (event-driven, async, data streams)
- Imperative vs. RxJS approach comparison
- **Creators:** combineLatest, forkJoin, zip, of, Subject, ReplaySubject, BehaviorSubject
- **Operators:** map, filter, share, shareReplay, higher-order observables (switchMap, mergeMap, exhaustMap, concatMap), first, debounceTime, startWith, withLatestFrom, distinctUntilChanged
- **Custom operators:** creating from scratch and composing from existing operators (truthy/falsy, shareLatest, retryWhenOnline, useCacheOnError)
- **Subscribe/unsubscribe strategies:** first(), firstValueFrom(), async pipe, takeUntilDestroyed(), @ngneat/until-destroy

**Exercises:**
1. **Sort playgrounds by location** (p18) - Use combineLatest with LocationService to sort playgrounds by distance; verify with browser DevTools Sensors tab
2. **Operators** (p36) - Make location distinct before emitting; auto-refresh playgrounds every 10 seconds using timer; assign markers$ observable with current location
3. **Custom operators** (p50) - Filter empty responses from PlaygroundService using filter operator; extract into a custom `withLength` operator using pipe(); place in `utils/rxjs-utils.ts`
4. **Unsubscribe strategy** (p58) - Choose and implement an unsubscribe strategy (async pipe recommended)
5. **Extra: Add a map marker** (p59) - Add a second marker for the currently selected playground using Subject, combineLatest, and startWith

---

### 2. Dependency Injection (slides 60-108)

Deep dive into Angular's DI system - how injectors, providers, and tokens work together.

**Topics covered:**
- DI concepts: injectors, providing, and injecting
- `inject()` function vs. constructor injection
- **5 ways to provide:** providedIn: 'root', providers array (useClass), overriding default implementation, useValue, useFactory
- Multi-providers
- **InjectionToken:** creating tokens, tokens with default implementations, configuring and overriding
- **Injector levels:** root, lazy route, route (v15+), component; injector hierarchy and resolution
- Injector destruction and DestroyRef for services
- **Resolution modifiers:** optional, skipSelf, self, host
- Built-in tokens: LOCALE_ID, APP_INITIALIZER / provideAppInitializer
- The Injector class for dynamic dependency resolution
- inject() function (v14+) vs. Injector class

**Exercises:**
1. **Create an Aarhus service** (p82) - Create `aarhus-playground.service.ts` by copying existing service; use environment files and a factory provider to select service based on location; run both `npm run copenhagen` and `npm run aarhus`
2. **Use an InjectionToken** (p88) - Replace the Aarhus service with a single PlaygroundService configured via a `PLAYGROUNDS_URL` InjectionToken; provide with useValue per environment
3. **Prefetch the playgrounds** (p101) - Add a provideAppInitializer to prefetch playgrounds; convert unicast observable to multicast using shareReplay

---

### 3. Components (slides 109-162)

Advanced component patterns in Angular's component-centric framework.

**Topics covered:**
- Component architecture recap: class, metadata, template
- **Lifecycle hooks:** OnInit (and rethinking it with inject()), OnDestroy, DestroyRef, OnChanges
- **Content projection:** ng-content, single slot vs. multi slot (with CSS selectors)
- **ViewChild & ViewChildren:** signal queries (v19+) and decorator-based (@ViewChild/@ViewChildren), by type and template reference variable, static vs. dynamic, QueryList
- **Dynamic components:** *ngComponentOutlet (with inputs), ViewContainerRef.createComponent (v20), ng-dynamic-component (3rd party)
- **Template outlets:** ngTemplateOutlet with context, creating reusable filter components
- **Change detection:** zone.js, running outside zone, ChangeDetectionStrategy.OnPush vs. Default/Eager, signals and OnPush
- Container/presentation component pattern

**Exercises:**
1. **Create a sidebar-list-item component** (p127-128) - Extract button from sidebar into new component; add input properties (playground, selected, location); use ng-content for content projection; wire up click listener for selection
2. **Create a component dynamically** (p145) - Replace loop-footer with ng-container and *ngComponentOutlet; pass component and inputs dynamically
3. **Speed up the application** (p161) - Identify components that can use ChangeDetectionStrategy.OnPush and apply it

---

### 4. Unit Testing (slides 163-208)

Leveraging automated testing in Angular applications with Vitest.

**Topics covered:**
- Why test: identify bugs, ensure functionality, reduce costs, build trust
- What makes a good unit test: lightweight, fast, consistent, repeatable
- Bad tests and false sense of security
- What is a "unit" (Roy Osherove's definition) - unit of work, not a function or class
- A unit in Angular context: returns a value, changes state, calls a 3rd party API
- **Test runners:** Karma (deprecated), Jasmine, Vitest (official Angular 21 default)
- Migrating from Karma + Jasmine to Vitest
- **Test structure:** describe, it, beforeEach/afterEach/beforeAll/afterAll
- Arrange/Act/Assert pattern
- **Test helpers:** TestBed, ComponentFixture, DebugElement, NativeElement
- **Test doubles:** dummies, stubs, fakes, spies (vi.spyOn), mocks (vi.mock)
- Test Driven Development (TDD) - red/green/refactor cycle
- Testing asynchronous code (Promise pattern)
- Testing components: state, API calls, (not DOM)
- **Test management:** standalone components for isolation, SCAM pattern (pre-standalone), keeping tests isolated
- What not to test: private functions, click events, DOM (at least not initially)
- Costs of testing and over-testing

**Exercises:**
1. **AuthService test** (p190) - Create AuthService with Angular CLI; write TDD tests for login with email & password; see test fail then make it pass; test isLoggedIn state
2. **AuthService - new service & suite within a suite** (p194) - Replace TestBed.inject with `new AuthService()`; organize tests into nested describes ("Initially", "When logged in", "When not logged in"); add "should throw on login" test
3. **Asynchronous changes** (p199) - Add HttpClient to AuthService; replace spec with async version; test that login calls '/api/login' endpoint using httpClientMock
4. **LoginComponent** (p201) - Create LoginComponent; test "should call login with email & password from form"; test "should not login when form is invalid"

---

### 5. Reactive Forms (slides 209-255)

Building type-safe, model-driven forms with validation and custom controls.

**Topics covered:**
- Reactive forms vs. template-driven forms (scalability, testability, type safety since v14)
- **Controls:** FormControl, FormGroup, FormArray, FormRecord; AbstractControl API (value, valid/invalid, valueChanges, reset, patchValue)
- FormBuilder (v13 vs. v14 type-safe syntax)
- Attaching controls to templates: formControl, formControlName, formGroup, formGroupName, formArrayName
- **Validation:** built-in validators (Validators class), custom validators (pure functions returning null or ValidationErrors), async custom validators (returning Observable), errors property, ng-invalid CSS class, statusChanges
- **Custom controls (ControlValueAccessor):** registerOnChange, writeValue, setDisabledState, registerOnTouched, providing with NG_VALUE_ACCESSOR and forwardRef
- Custom control validity: implementing Validator interface, providing with NG_VALIDATORS

**Exercises:**
1. **Edit a playground** (p227) - Create a form group with name, description & addressDescription controls using FormBuilder; attach to template; reset with playground value in ngOnInit; save with form content preserving position
2. **Add validation** (p233-235):
   - 2.1 **Built-in validation** - Add required validation to name control; disable OK button when form invalid
   - 2.2 **Custom validator** - Create validator ensuring either description or addressDescription is filled out (returns `{ requiredOr: [...] }`)
   - 2.3 **Async custom validator** - Create async validator checking playground name uniqueness via PlaygroundService
3. **Add a custom control** (p253-254) - Create `edit-playground-control` component implementing ControlValueAccessor; move form from modal into reusable control; wire up registerOnChange, writeValue, setDisabledState

---

### 6. Routing (slides 256-307)

Navigation, URL-based state management, and route protection in Angular.

**Topics covered:**
- Why routing matters: URL holds application state
- Defining routes: basic and nested, router-outlet
- Navigation: by code (Router.navigate) and by template (routerLink, routerLinkActive)
- **Parameters:** placeholders (:id), matrix parameters (path segment params), query parameters, reading params (observable vs. snapshot)
- Matrix vs. query parameters: when to use what, URL fragments breakdown
- **Guards:** CanActivate, CanActivateChild, CanDeactivate, CanLoad (all deprecated as class-based); functional guards (v14+) with CanActivateFn, CanDeactivateFn
- **Resolvers:** pre-fetching data before route activation; class-based (pre v14) and functional resolvers; reading resolved data
- **Route data:** static data on routes, reading in guards
- Using URL to save app state (filter via query params, state change flow)
- **Lazy loading:** loadChildren with modules and routes arrays, CanLoad guard

**Exercises:**
1. **Add routes to playground app** (p269-270) - Create map component; set up routing with '' and ':id' routes; replace click events with routerLink; use ActivatedRoute params to find selected playground via getById
2. **Restrict access with auth guard** (p287-288) - Set up login route with LoginComponent; create functional CanActivateFn guard using AuthService; pass returnUrl via matrix params for redirect after login
3. **Save state in the URL** (p299-300) - Add filterControl to sidebar; navigate on value changes using query params; extend combineLatest with query params observable for filtering; initialize filterControl from snapshot

---

### 7. Pipes & Directives (slides 308-354)

Creating custom pipes and directives - one module, two subjects.

**Topics covered:**
- **Pipes:** purpose (data transformation in templates), parameters, chaining
- Built-in pipes: LOCALE_ID dependent (CurrencyPipe, DatePipe, DecimalPipe, PercentPipe), JsonPipe, KeyValuePipe, AsyncPipe
- Building custom pipes: @Pipe decorator, PipeTransform interface, standalone
- Pure vs. impure pipes (pure: false)
- **Attribute directives:** adding behavior to existing elements
- **Structural directives:** conditionally adding/removing DOM elements

**Exercises:**
1. **Create a DistancePipe** (p321-323) - Build a pipe that shows distance from current location to each playground
2. **Make the DistancePipe impure** (p326) - Set `pure: false` so the pipe updates when location changes
3. **Create a SelectAllTextDirective** (p340) - Build an attribute directive that selects all text in an input on focus
4. **Create an IsInRoleDirective** (p353) - Build a structural directive that shows/hides the edit button based on user role

---

### 8. Signals (slides 355-402)

Angular's optimized change detection mechanism using reactive primitives.

**Topics covered:**
- **From zone.js to zoneless:** zone.js and its limits, zoneless by default for new apps (v21), OnPush the default (v22, the old default is now `Eager`), signal-based change detection updates only the affected view
- **Working with signals:**
  - WritableSignal: signal(), .set(), .update()
  - Computed signals: computed() - lazily evaluated and memoized
  - Signal equality functions for custom change detection
  - Effects: effect() - run side effects when signals change (stable since v20), lifetime and injection context
  - Reading without tracking: untracked()
  - Don't copy state with an effect: computed vs. an effect-kept copy (demo `/signals/computed-vs-effect`)
  - linkedSignal: writable derived state, short form and the long form that keeps the previous selection (stable since v20)
  - Which tool: computed, linkedSignal, resource, RxJS + toSignal, effect
  - Effect cleanup with onCleanup: cancelling timers and requests
- **Signal inputs:** input(), input.required() (stable since v19), transformers (booleanAttribute, numberAttribute, custom)
- **Function-based outputs:** output(), output with alias, outputFromObservable()
- **Model inputs:** model() for two-way data binding (stable since v19)
- **RxJS interop:** toSignal() (Observable to Signal, v20), toObservable() (Signal to Observable)
- What has been "signalified": @ViewChild/@ViewChildren, @ContentChild/@ContentChildren
- What hasn't changed: @HostListener, @HostBinding/host
- **Resource API (stable since v22):** rxResource(), httpResource(), resource() - unified pattern for fetch/cache/react; ResourceRef with value(), isLoading(), reload(), error(), status()
- **New in 21 and 22:** zoneless, OnPush default, stable resources, linkedSignal `set`, `debounced()` (experimental), Signal Forms
- Signals vs. Observables: when to use which

**Exercises:**
1. **Getting started with signals & effects** (p375-377) - Convert instance variables to signals; use effect to cache playgrounds in localStorage (only once they are loaded); initialize from localStorage; bonus: remove `Eager`
2. **Using input & output** (p384-386) - Convert @Input/@Output to signal-based input()/output() in sidebar; create SidebarListItemComponent with signal inputs; replace pipes with computed()
3. **Use two-way data binding** (p388) - Convert selectedPlayground to model() input; use two-way binding in home component; remove separate output; navigate on selection (event binding or effect: a discussion point)

---

### 9. State Management (slides 403-441)

Patterns and libraries for managing application state in Angular.

**Topics covered:**
- What is state: playgrounds, user profiles, etc.
- **Two kinds of state:** application state (global, entire app lifespan) vs. local/component state (provided at component level, shared across hierarchy)
- Where to put state: URL (address bar, query params, matrix params), forms (transient data)
- **The store concept:** centralized state handling, single source of truth, service vs. store relationship, store responsibility (loading, error, refresh)
- Store with RxJS (BehaviorSubject-based), store with signals (toSignal + WritableSignal)
- **rxResource for stores:** using rxResource properties (value, params, reload, error, isLoading, status), exposing as readonly resource
- **State management libraries** (pros/cons comparison):
  - NgRx Signal Store (built on Signals API, less boilerplate)
  - NgRx Store (enterprise workhorse - Actions, Reducers, Effects, devtools)
  - NgRx Component Store (local state, feature encapsulation)
  - NGXS (decorator-driven, Angular-idiomatic)
  - RxJS with services (the classic - no dependencies, flexible)

**Exercises:**
1. **Getting started & delete a playground** (p412-414) - Examine the app; add delete output to sidebar; implement delete using PlaygroundService; reload playgrounds after deletion; handle loading state
2. **Add a PlaygroundStore** (p419) - Create `state/playground.store.ts`; move playground, update, and delete logic from component into store; inject store instead of service; create separate error properties for read/update/delete
3. **Signal store with rxResource** (p434) - Simplify PlaygroundStore using three rxResource properties; expose as signals or readonly Resource; use computed for sorting; eliminate toSignal()

---

### 10. Performance & Change Detection

Finding and fixing what makes the playground app slow, with one rule for every lab: measure, change, measure again.

**Before the course:** install [Angular DevTools](https://chromewebstore.google.com/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh) in Chrome. Plan B without the extension: Chrome's Performance panel with the Angular track (`ng.enableProfiling()` in the console).

**Topics covered:**
- What "slow" means for a user: startup, interaction, memory
- Change detection and zone.js: a cycle after every task; Eager (was Default) vs OnPush; `NgZone.runOutsideAngular`
- **Tools:** Angular DevTools Profiler, Chrome Performance panel (Angular track), `ng build` output, the esbuild bundle analyzer (`npm run build -- --stats-json`), Chrome Memory panel heap snapshots
- **Zoneless:** what schedules change detection without zone.js, OnPush as the default in v22, signals instead of plain fields, what to do on Angular 15–19; lists with `@for` `track` and `computed`
- **Loading less up front:** what ends up in `main` (whole icon packs defeat tree-shaking), lazy routes (`loadComponent`), `@defer` triggers and placeholders, when `@defer` costs more than it saves
- **Memory and the DOM:** leaks from intervals, listeners and third-party objects, detached DOM trees and retainers in heap snapshots, `DestroyRef` and `takeUntilDestroyed`
- `ngSrc`, preloading, virtual scroll and `WeakMap` have hidden slides, no lab

Every exercise ends with an "In your app" slide: what to measure and try in your own app.

**Exercises:**
1. **Measure and leave the zone** - Profile 5 s of mouse moves over the map; create the Leaflet map with `runOutsideAngular`; profile again; bonus: wrap the `center$` `setZoom`/`setView` calls (slides only), and run the footer interval outside the zone to see it freeze (try, then revert)
2. **Go zoneless and move to signals** - Measure the build and the Profiler; remove `zone.js` from the polyfills, use `provideZonelessChangeDetection()`; make the footer's seconds a signal and measure; drop `Eager` in all seven components and measure again
3. **Load less up front** - Find what is in `main` with the esbuild analyzer; `loadComponent` for the detail route, `@defer (on idle)` around the map, try `@defer (on viewport)` on the footer, measure and revert, register only the used icon; compare Initial total after each change. The solution also has a lazily loaded "Om appen" panel (`NgComponentOutlet`); its slides are hidden
4. **Memory and the DOM** - Heap snapshots before and after 5 rounds of home and detail; read the retainers; `map.remove()` and `clearInterval` in `DestroyRef.onDestroy`; bonus: `takeUntilDestroyed(this.destroyRef)` on the map's three subscriptions

---

## Exercise Progression

Each module builds on the same playground-finder application. Labs are organized as:

| Module | Folder | Exercises |
|--------|-----------|-----------|
| RxJS | `courses/rxjs` | 4 exercises + 1 extra |
| Dependency Injection | `courses/di` | 3 exercises |
| Components | `courses/components` | 3 exercises |
| Unit Testing | `courses/unit-test` | 4 exercises |
| Reactive Forms | `courses/reactive-forms` | 3 exercises |
| Routing | `courses/routing` | 3 exercises |
| Pipes & Directives | `courses/pipes-and-directives` | 4 exercises |
| Signals | `courses/signals` | 3 exercises |
| State Management | `courses/state-management` | 3 exercises |
| Performance | `courses/performance` | 4 exercises |

The workspace these courses live in (steps, zips, the `adv` CLI, the slides) is described in [../README.md](../README.md).
