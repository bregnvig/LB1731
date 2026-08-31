# Changelog

All notable changes to the **Angular Foundation** slide deck and its companion
demo project (`~/repo/LB1731/demo`) are documented here.

## [2026.10] - 2026-08-31

### Slides

- **New: Signal forms section** (5 slides, at the end of the Forms section
  before Routing). Covers the v22 `@angular/forms/signals` API: the model as a
  plain `signal`, `form()` deriving the field tree from the model's shape,
  validation rules (`required`/`min`/`max`) declared against typed paths, the
  `[formRoot]`/`[formField]` directives, and field state as signals. Closes
  with a comparison of template driven vs. reactive vs. signal forms.

### Demo

- **New: `/form/signal`** - a signal forms example laid out identically to the
  template-driven and model-driven forms so the three can be compared. Uses
  `form()`, `required`/`min`/`max`, `[formField]` and `submit()`.
- The shared `Person` class declares `height?: number | null`, which signal
  forms cannot bind (a field must be both present and non-nullable). The model
  type is derived from `Person` rather than restated:
  `type PersonModel = { [K in keyof Person]-?: NonNullable<Person[K]> }`, where
  `-?` removes the `?` (as `Required<T>` does) and `NonNullable<>` removes the
  `| null`. `Person` itself is unchanged, so the other two forms are unaffected,
  and the signal form follows `Person` if it changes.

### Tooling

- Added `serve.mjs`: `npm start` serves the deck with live reload, so saving a
  slide refreshes the browser. The reload snippet is added to the response
  only - `index.html` on disk stays byte-identical for slides.com re-import.

## [2026.09] - 2026-08-31

Synchronisation pass between the slides (`index.html`) and the demo code.
Angular 21.2 / TypeScript 5.9.

### Guiding principles

- Slides that **deliberately** teach the old style (`@Input`, `@Output`,
  `*ngIf`, `*ngFor`, `@NgModule`, constructor injection) are marked as such on
  the slide itself ("Stop using this", "Control flow pre v17", "Deprecated in
  v20 to be removed in v22"). Those were kept legacy on purpose — only their
  genuine errors were corrected.
- Everywhere else the modern API is used: `input()` / `output()`,
  `viewChild()` / `viewChildren()`, signals, `inject()`, built-in control flow.
- The slides.com export structure of `index.html` was left byte-for-byte intact
  apart from the text inside `<code>` elements, so the deck can be re-imported.

---

### Slides (`index.html`)

#### Corrected — code that would not compile or run

- **`*ngIf` control-flow slide**: stray `.` instead of `,` after the `template`
  property, which broke the decorator object. Also corrected `ngif works!` to
  `ngIf works!`.
- **`input.required` transform slide**: `value.toUppercase()` →
  `value.toUpperCase()` (the former does not exist), plus a missing semicolon.
- **RxJS anti-pattern slide**: unbalanced parentheses — the block closed with
  `)` instead of `});`.
- **`@Component` decorator example**: missing comma between `template` and
  `imports`.
- **Routing slides** (5 blocks): missing comma after `component: OrdersComponent`
  before the `children` array. The intentionally wrong `redirectTo: 'order'`
  used to demonstrate URL matching was **kept**, since that is the teaching point.
- **Lazy-loading slide**: same missing-comma fix.
- **Reactive `FormGroup` slides**: missing semicolon, and `this.model` was
  referenced without ever being declared — added the `#model` field.
- **Template-driven form slide**: `name="eight"` → `name="height"`, a typo that
  silently produced the wrong form key.
- **TypeScript `private static` slide**: the closing line `Vat.VAT = 1.25;`
  contradicted the slide's own point about `private`. Now shown as a commented
  compile error with a differing value.
- **`calculateVAT` TypeScript slide**: added the actual compiler error as a
  comment so the contrast with the JavaScript version is explicit.
- **`OnInit` slide**: `title: string` → `title?: string`, required under
  `strictPropertyInitialization`.
- **`@NgModule` example**: `CommonModule` was imported from `@angular/core`
  (it lives in `@angular/common`), and the `declarations` referenced
  `PrivateComponent` / `SharedComponent` while importing
  `MyPrivateComponent` / `MySharedComponent`.
- **Legacy getter/setter `@Input` slide** (kept legacy by design): `#value: string`
  was never initialised — now `#value = ''`.
- **`effect()` slide**: removed redundant `!` non-null assertions inside a block
  already guarded by `if (center && map)`.
- **`LocationService` slide**: `error => noop` referenced an undefined `noop`.
- **`computed` slide**: class name typo `PlaygroundCompont` → `PlaygroundComponent`.

#### Aligned with the demo code

- **HTTP component slide** now matches `simple-http-service.component.ts`:
  `inject()` + `signal()` instead of constructor injection into a plain array.
- **`F1LocalStorageCache` slide** now matches `f1.service.ts`: `inject()`,
  `#request$` private field, `providedIn: 'root'`, and the null-safe
  `localStorage.getItem('drivers') || '[]'` parse.
- **`RandomService` slide** now matches `random.service.ts` (signal-backed).
- **`RandomLoggerService` slide** switched to `inject()` and a signal, matching
  the deck's own DI guidance.
- **Stopwatch slide** now matches `stopwatch.component.ts`: `signal()` for
  `seconds` and `DestroyRef`-based interval cleanup.
- **Router / `ActivatedRoute` slides** switched from constructor parameter
  properties to `inject()`, consistent with the demo.
- **Reactive-forms search slide** switched to `inject()` and a strict-safe
  initialiser.
- **Bootstrap slide** now matches `main.ts` (includes `NgbModule`).
- **Error-message slide** now matches the demo: `ngb-alert` and
  `lastName.untouched` rather than `pristine`.
- **`*ngFor` inside the two form template slides** replaced with `@for`. These
  are *not* legacy-contrast slides — they teach forms, so they now use the
  control flow the rest of the deck teaches.
- **Sidebar class slide** uses `inject()` and the `Playground` interface name
  actually defined two slides earlier (was `IPlayground`).
- **`toSignal` slide**: typed as `Signal<Playground[] | undefined>`, which is
  what `toSignal` without an initial value actually returns.

#### Left unchanged by design

- `@Input` / `@Output` slides under the "Stop using this" headings.
- `*ngIf` / `*ngFor` slides under "Control flow pre v17".
- The `@NgModule` slide (marked "Kind of old school").
- The `constructor(private service: …)` slide shown as the alternative to
  `inject()`.
- The deliberately incorrect `redirectTo: 'order'` on the URL-matching slides.

---

### Demo code (`~/repo/LB1731/demo`)

#### Modernised to Angular 21 signal queries

- `io/viewchild/viewchild.component.ts`: `@ViewChild(StopwatchComponent, { static: true })`
  → `viewChild.required(StopwatchComponent)`; call sites now `this.stopwatch()`.
- `io/view-children/view-children.component.ts`: `@ViewChildren` + `QueryList`
  → `viewChildren()`, returning a readonly array; the `?.` guards are no longer
  needed. Headings updated to `viewChild` / `viewChildren`.
- Both files also dropped the duplicated `StopwatchComponent_1` import alias
  left over from an earlier automated migration, in favour of the barrel import.

#### Bug fixes

- `form/template-driven-form`: `name="firstName "` had a trailing space, which
  produced a form value keyed `"firstName "` instead of `firstName`.
- `form/template-driven-form` and `form/typed-form`: `type=" submit "` is not a
  valid submit button — corrected to `type="submit"` so the forms actually submit.
- `form/template-driven-form`: the height field was `type="text"` with
  `max="230"` / `min="65"`, disagreeing with both the slide and the reactive
  form. Now `type="number"` with `min="100"` / `max="220"`.
- `form/typed-form`: `Validators.max(200)` → `Validators.max(220)` to match the
  slide and the template-driven form.
- `form/search-form`: method typo `ngModelSaerch` → `ngModelSearch`.
- `async/cached-async-service`: method typo `addSubscribtion` → `addSubscription`.

### Verification

- `ng build --configuration development` completes with no errors or warnings.
- `index.html` re-parses cleanly, and the `section` / `pre` / `code` / `div` /
  `img` / `data-block-id` / `data-line-numbers` counts are identical to the
  pre-change export (193 / 139 / 138 / 1990 / 53 / 983 / 75).

### Tooling

- Added `export-pdf.mjs`, which exports the deck to PDF by driving reveal's
  built-in `?print-pdf` mode in headless Chrome at the deck's own 1280x720
  slide size. Run with `npm run pdf`, or `npm run pdf:fragments` to get one
  page per build step. Uses `puppeteer-core` against the system Chrome; set
  `CHROME_PATH` to point at a different browser.
