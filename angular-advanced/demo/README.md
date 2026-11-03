# Demo showcase guide

How to walk through the examples in `src/app`. This file stays out of `demo.zip`, so students don't get it.

Start the demo:

```bash
npm start
```

Dev server runs on **http://localhost:4201**.

---

## State management

Source: `src/app/state-management`
Base URL: `http://localhost:4201/state-management`

The route shell is `StateManagementComponent` (`state-management.component.ts`) — a tab bar with a `<router-outlet>`. The parent route also provides a `StateListenerService` via `useClass: GlobalStateListenerService` (`state-management.routes.ts:16-21`); some children use it, some override it.

Order to demo: **Global → Local → URL → Form → RxJS store → Signal store → RxResource store**. Each builds on the previous one.

### 1. Global state — `/state-management/global`

**Files:** `feature/global-state.component.ts`, `shared/state-listener/state-listener.service.ts`

**What it shows:** a service-as-singleton scoped to the route subtree. The component does *not* declare its own `providers`, so it inherits the `StateListenerService` instance provided at the parent route level.

**Demo flow:**
1. Click **Update State** a few times — the displayed state changes.
2. Click **Register** on a couple of the 5 listener cards. They appear in `Subscribers`.
3. Navigate to **Local state** and back to **Global state**.
4. Point out that the listeners and the last state are still there. The service outlived the component.
5. Show the commented-out `this.#service.clear()` in `ngOnDestroy` (`global-state.component.ts:36-40`) — with a service whose lifetime exceeds the component's, *you* are responsible for cleanup.

**Talking point:** despite the name, this is not application-global. It is "global" only relative to the component subtree. The route comment at `state-management.routes.ts:19` calls this out.

### 2. Local state — `/state-management/local`

**Files:** `feature/local-state.component.ts`

**What it shows:** the same service API, but the component declares its own `providers: [{ provide: StateListenerService, useClass: LocalStateListenerService }]` (`local-state.component.ts:23-28`). A fresh instance is created on enter and torn down on leave.

**Demo flow:**
1. Repeat the same steps as Global: Update State, Register listeners.
2. Navigate to **Global** and back to **Local**.
3. Listeners and state are gone — the service was destroyed and recreated.

**Talking point:** identical template, identical service class — the only change is *where* it's provided. That single decision controls lifetime, sharing, and cleanup obligations. Use this slide to introduce DI hierarchy as a state-scope tool.

### 3. URL state — `/state-management/url`

**Files:** `feature/url-state.component.ts`, route config at `state-management.routes.ts:36-50`

**What it shows:** the URL as the source of truth. Three buttons each navigate with a different combination of query params, matrix params, and route params (the buttons regenerate random values every 500 ms via a `timer` so each click is fresh).

**Demo flow:**
1. Click **Navigate with query params** — show the `?a=…&b=…` in the URL and in the rendered `Query Params`.
2. Click **Navigate with placeholder and matrix params** — point out the `;matrixKey=…` segment in the URL.
3. Click **Navigate with child-route placeholder and matrix params** — show that the child component (`UrlStateChildRouteComponent`) renders its own params via its own `ActivatedRoute`.
4. Reload the page — state survives, because it lives in the URL.
5. Copy/paste the URL into a new tab — it restores fully.

**Talking point:** URL state is shareable, bookmarkable, and back/forward-button-friendly for free. Use it for filters, selected ids, view modes — anything a user would expect to keep across reload.

### 4. Form state — `/state-management/form`

**Files:** `feature/form-state.component.ts`

**What it shows:** Reactive Forms as a state container, plus a small bridge between a `FormControl` and the URL.

**Demo flow:**
1. Type into Name / Email — show the per-control flags (`valid`, `invalid`, `dirty`, `touched`) update independently.
2. Show the live `form.value` JSON dump and the form-level flags.
3. Type into the **Filter** input — the URL updates with `;filter=…` matrix param on every change (`valueChanges` → `router.navigate`).
4. Reload — note that the filter input is *not* yet rehydrated from the URL on load. The `//TODO` at `form-state.component.ts:65` is intentional and a natural lab continuation.

**Talking point:** Reactive Forms already give you validation, dirty tracking, and value streams. Combined with URL state, you get persistent, shareable form state.

### 5. RxJS service store — `/state-management/rxjs-store`

**Files:** `feature/rxjs-service-store/` (`rxjs-service-store.component.ts`, `rxjs-playground.store.ts`, `rxjs-playground.service.ts`)

**What it shows:** the classic "service with a Subject" store pattern — observable-first.

**Demo flow:**
1. Show the list rendering with `playgrounds | async`, plus loading and error branches.
2. Edit a playground name/description in any row, click **Save**. The row briefly pulses (`update-effect` animation) when the input signal changes.
3. Open `rxjs-playground.store.ts` — point out:
   - `#refresh = new BehaviorSubject<void>` driving the pipeline.
   - `playgrounds` is a `shareReplay(1)` observable built from `#refresh.pipe(switchMap(...))`.
   - `update()` calls the service, then `#refresh.next()` to re-trigger the list.
   - `loading` and `error` exposed as Subjects.
4. The component template uses the `async` pipe everywhere — no manual subscribe.

**Talking point:** all reactivity is RxJS. Works fine, but you carry the cost of `async` pipes, `shareReplay`, and Subjects.

### 6. Signal service store — `/state-management/signal-store`

**Files:** `feature/signal-service-store/` (`signal-service-store.component.ts`, `signal-playground.store.ts`)

**What it shows:** the same store, ported to Signals. Same UI, different primitive.

**Demo flow:**
1. UX is identical to the RxJS store — emphasize that.
2. Open `signal-playground.store.ts` and put it side-by-side with `rxjs-playground.store.ts`. Highlights:
   - `loading`, `error`, `updateError` are `signal(...)` instead of Subjects.
   - `playgrounds` uses `toSignal(...)` over the same RxJS pipeline — bridge into the signal world.
   - `update()` returns a `Promise<void>` via `firstValueFrom(...)`.
3. Component template drops `| async` everywhere — `loading()`, `error()`, `playgrounds()` are direct signal reads.

**Talking point:** for component consumers, Signals collapse the boilerplate. The store can still use RxJS internally where it shines (HTTP, switchMap), then expose Signals at the boundary.

### 7. RxResource service store — `/state-management/rxresource-store`

**Files:** `feature/rxresource-service-store/` (`rxresource-service-store.component.ts`, `rxresource-playground.store.ts`)

**What it shows:** the same store again, this time using Angular's `rxResource` primitive — loading state, error state, and reload are baked in.

**Demo flow:**
1. UX still identical.
2. Open `rxresource-playground.store.ts`:
   - `#playgroundsResource = rxResource({ stream: () => this.#service.list(), defaultValue: [] })` — that single line replaces the BehaviorSubject + pipeline + shareReplay from the RxJS version.
   - `#updateResource` is parameterised with `params: () => this.#update()` and triggers `#playgroundsResource.reload()` on success.
   - `playgroundsLoading`, `playgroundsError` come straight from the resource — no manual tracking.
3. The component template binds to `store.playgroundsLoading()`, `store.playgroundsError()`, `store.playgrounds()`.

**Talking point:** show all three stores in the same conversation. Same feature, three eras: Subject-based RxJS → Signals over RxJS → declarative `rxResource`. Each step removes wiring you previously had to write.

---

## Summary slide order

| Path | Concept | Key takeaway |
| --- | --- | --- |
| `/global` | DI scope at the parent route | Service outlives component → manual cleanup |
| `/local` | DI scope at the component | Service lifetime = component lifetime |
| `/url` | Router as state | Reload-safe, shareable, free history |
| `/form` | Reactive Forms + URL bridge | Forms are state + validation in one |
| `/rxjs-store` | Observable service store | Subjects + `shareReplay` + `async` pipe |
| `/signal-store` | Signal-facing store | RxJS inside, Signals out |
| `/rxresource-store` | `rxResource` primitive | Loading/error/reload, declared not wired |

---

## Performance

Source: `src/app/performance`
Base URL: `http://localhost:4201/performance`

Start with `npm run start:no-hmr` for this one: with HMR (the `ng serve` default) the dev server loads every `@defer` chunk up front.

The route shell is `PerformanceComponent` (`performance.component.ts`), the same tab bar + `<router-outlet>` as state management. The demo app runs zoneless. Add `?zone` to the URL to boot it with zone.js instead (`src/main.ts` loads zone.js before Angular); the change detection page has a button for it.

Order to demo: **Change detection → @defer → Leaks**. Change detection goes with the intro and the theory of exercises 1–2, `@defer` with the theory of exercise 3, leaks with exercise 4. Show `/performance/images` only if someone asks about images.

### 1. Change detection tree — `/performance/change-detection`

**Files:** `change-detection-2/root.component.ts` (the page), `a.component.ts`, `branch.component.ts`, `leaf.component.ts`, `strategies.ts`, `check-counter.ts`

**What it shows:** which components Angular checks after a click, a changed input or a signal, Eager vs OnPush, as a tree of seven nodes: A on top, B and C below, B1, B2, C1, C2 as leaves.

A has no inputs. Every parent passes two values to both its children: `primitive` through `@Input()` and `signal` through `input()`; the **primitive +1** and **signal +1** buttons change them. A node flashes yellow and its **checks** counter goes up when Angular checks it (a template binding calls `checked()` from `check-counter.ts`, which draws from outside Angular, so the flash never causes a check). Every button is a plain `(click)`. The **Eager ⇄ / OnPush ⇄** button on a node, and **All Eager** / **All OnPush**, rebuild the nodes as the other strategy, so their counters start again at 1. **Zoneless ⇄** reloads the page with or without `?zone`; every step below gives the same counts in both modes.

**Demo flow:**
1. **All Eager**, click **click** on B1 — every node flashes, every counter +1.
2. **All OnPush**, click **click** on B1 — only B1, B and A flash. A listener marks its node and the path to the root.
3. **primitive +1** on A — A, B and C flash, the leaves don't: B and C got a new input, their own outputs to the leaves didn't change.
4. **start signal interval** on B1 — the click checks B1, B, A once, then only B1 flashes, once a second. The signal marks B1 alone; Angular walks down to it without checking A or B. **stop signal interval**.
5. **start primitive interval** on B1, wait 3 s — nothing flashes, `ticks: primitive` stays 0. **stop primitive interval**: that click checks B1 and it shows 3. A plain field changed in a timer tells Angular nothing.
6. **All Eager**, **start signal interval** on B1 — every node flashes every second. Eager nodes are checked whenever a check passes them, whatever started it.
7. Still All Eager, **Zoneless ⇄** to zone.js, **start primitive interval** on B1 — every node flashes every second and the primitive counts up: zone.js runs a check after every timer. Zoneless, the same click gives no flash and a frozen 0. This is the only step where the two modes differ.

**Talking point:** OnPush plus signals means Angular checks the path to what changed and nothing else. Inspired by Matthieu Riegler's [Angular change detection demo](https://jeanmeche.github.io/angular-change-detection/).

### 2. `@defer` triggers — `/performance/defer`

**Files:** `defer/defer-board.component.ts`, `defer/loaded/*.ts` (one component per chunk)

**What it shows:** each `@defer` block becomes its own JS chunk, fetched when its trigger fires (`defer-board.component.ts:27-100`).

**Demo flow:**
1. DevTools, Network, filter **JS**, reload. `idle-loaded.component-….js` and `prefetch-loaded.component-….js` arrive at once; `timer-loaded…` about 3 s later. The green card names the chunk it came from.
2. Hover **Hover me** — `hover-loaded…` appears in the list.
3. Click **Click me** — `interaction-loaded…`.
4. Tick **show()** — `when-loaded…`. Untick it: the block stays (`when` is one-shot).
5. Click **Downloaded already. Click me** — it renders, and no new request: `prefetch on idle` already fetched it in step 1.
6. Scroll down — `viewport-loaded…` loads when its box comes into view.
7. Throttle to **Slow 4G**, reload, click **Click me** — **Loading ...** shows for about a second before the card. Locally a chunk arrives in well under 100 ms, so `@loading (after 100ms)` never shows without throttling.
8. Set throttling back to **No throttling**.

**Talking point:** wrap the heavy thing below the fold or behind a click in `@defer` and it leaves `main`. In lab 3 that's the map, with `@defer (on idle)`; the footer, which is small and in view, gets bigger when deferred.

### 3. ngSrc — `/performance/images` (optional, no slide)

**Files:** `images/images.component.ts`, `src/assets/performance/*.webp`

**What it shows:** `NgOptimizedImage` tells you in dev mode when the LCP image lacks `priority` (`images.component.ts:29`).

**Demo flow:**
1. Open the console. Click **Reload without priority** — Angular logs error **NG02955** for `hero.webp`: it is the LCP element and has no `priority`.
2. Click **Reload with priority** — the heading says "with `priority`" and the console stays clean.
3. Scroll down: `fill` (no width/height, fills its `position: relative` box) and `placeholder` (a tiny blurred data URL). With **Slow 4G** the placeholder shows before the swings image arrives.

Use the reload buttons, not the tabs: LCP is measured on a fresh page load only. The `ngSrc` paths start with `/` on purpose: the LCP check resolves a relative path against the page URL, not `<base href>`, and would never match.

**Talking point:** swap `src` for `ngSrc` with `width` and `height`, add `priority` to the one image above the fold, and let the console tell you which one that is.

### 4. Leaks — `/performance/leaks`

**Files:** `leaks/leaks.component.ts`, `leaks/leaky.component.ts`

**What it shows:** a component that starts a `setInterval`, adds a `window` listener and subscribes to an app-wide subject, and never cleans up (`leaky.component.ts:41-57`). Every unmounted instance stays in memory. **Use the fix** switches it to `DestroyRef.onDestroy` + `takeUntilDestroyed()`. The counters use a `FinalizationRegistry`, so **Collected** moves only after a garbage collection: DevTools, Memory, **Collect garbage** (bin icon).

**Demo flow:**
1. Click **Mount a playground card** — a red card ticks every second. Click **Send an update**: "last update: Havrebakkens Legeplads". **Created 1**.
2. Click **Unmount a playground card**, then **Mount + unmount 10 times** — **Created 11, Still alive 11** (1 from step 1 plus 10).
3. Collect garbage — **Collected 0, Still alive 11**. The interval, the listener and the subscription still point at every card.
4. Reload. Tick **Use the fix**, **Mount + unmount 10 times**, collect garbage — **Created 10, Collected 10, Still alive 0**.
5. Optional, Map vs WeakMap: **Cache 1000 playgrounds in each**, **Drop the playgrounds**, collect garbage — WeakMap collected **1000**, Map collected **0** (size still 1000). **map.clear()**, collect garbage — Map collected **1000**.

**Talking point:** anything you start in a component (interval, listener, subscription, third-party map) gets its cleanup in `DestroyRef.onDestroy` right next to it. The first thing you measure is whether the count of a component in a heap snapshot goes back down after you leave the page.

### Summary slide order

| Path | Concept | Key takeaway |
| --- | --- | --- |
| `/change-detection` | Eager vs OnPush, inputs, signals | A click checks the path to the root; a signal checks one node |
| `/defer` | `@defer` triggers | One block, one chunk, loaded when the trigger fires |
| `/images` | `NgOptimizedImage` | `priority` on the LCP image, the console tells you which |
| `/leaks` | Cleanup with `DestroyRef` | Uncleaned intervals and subscriptions keep every instance alive |

---

## TODO — other demo areas

The rest of `src/app` will be added in follow-up sections.
