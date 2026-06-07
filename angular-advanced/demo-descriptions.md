# Demo showcase guide

How to walk through the examples in `demo/src/app`.

Start the demo:

```bash
cd demo && npm start
```

Dev server runs on **http://localhost:4201**.

---

## State management

Source: `demo/src/app/state-management`
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

## TODO — other demo areas

The rest of `demo/src/app` will be added in follow-up sections.
