# Performance & Change Detection: slide preview

Rendered from PR #24 (branch `performance`) with the slides theme from PR #25. 50 visible slides; hidden slides are not shown. Fragments show their final state. Each slide names its slide type.

## 1. Performance & Change Detection

`performance.html` · type `title`

![performance.html](slides/01-performance.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Performance & Change Detection: one day, four labs on the playground app.
> Ex 1 leave the zone, ex 2 zoneless and signals, ex 3 load less, ex 4 memory.
>
> Welcome. Today we make the playground app faster, and we only believe numbers.
> The app is slow in ways you can see in a profiler. In every lab you measure first, change one thing, and measure again to see the number move.
> Four labs: take the map out of the zone, go zoneless with signals, load less up front, and clean up what leaks. Each one ends with a slide called "In your app": what to try on Monday.
> Ask the room who has opened a profiler on their own app. That tells you how long to stay on the tools.

</details>

## 2. What does "slow" mean?

`what-slow-means.html` · type `reveal-list`

![what-slow-means.html](slides/02-what-slow-means.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Three clicks, three kinds of slow, then the rule.
> Respond: Profiler bars in 5 s of mouse moves (labs 1, 2). Start: Initial total from npm run build (lab 3). Over time: objects counted in a heap snapshot (lab 4).
>
> When a user says the app is slow, ask which slow.
> Click. Slow to respond: you move the mouse or click, and the screen answers late. Usually Angular does too much work per event. We count bars in the Angular DevTools Profiler, labs 1 and 2.
> Click. Slow to start: the wait before you can use the app. JavaScript to download, parse and run. We read Initial total in the build output, lab 3.
> Click. Slower over time: fine when you opened it, heavy an hour later, because things were never cleaned up. We count objects in a heap snapshot, lab 4.
> Click. Each kind has its own number, and a fix for one does nothing for the others. That's the only rule today: measure, change exactly one thing, measure again the same way. Developers are bad at guessing where time goes, and a fix that does nothing still feels like progress.
> Ask the room: which of the three did your last "the app is slow" ticket mean?

</details>

## 3. Change detection in one minute

`change-detection-in-one-minute.html` · type `claim-image`

![change-detection-in-one-minute.html](slides/03-change-detection-in-one-minute.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Before class: npm run start:no-hmr in demo/, open http://localhost:4201/performance/change-detection, press Reset counters.
> Demo: All Eager, click "click" on E: all seven nodes flash, checks 1 each. All OnPush, Reset, same click: only E, B, A flash (the screenshot, after two clicks).
> Credit: the demo is modelled on Matthieu Riegler's Angular change detection demo, https://jeanmeche.github.io/angular-change-detection/
>
> Change detection keeps the screen in sync with your data. After something happens, Angular walks the tree from the root and compares every binding with its old value.
> So the cost is easy to state: how many components are checked, times how many bindings they have, once per cycle. Two levers: how often does a cycle run, and how many components does each one check?
> When: in today's app, zone.js decides. It patches events, timers and promises, and runs a cycle after every one. It knows a task finished, not that anything changed. New apps since Angular 21 are zoneless, and that's exercise 2.
> Which: Eager is the old Default, renamed: checked every time the walk passes. OnPush: only when something marked it dirty.
> Switch to the demo. All Eager, Reset counters, click "click" on E. Every node flashes yellow, seven checks for one click on a leaf. Now All OnPush, Reset, the same click: only E, B and A, like the screenshot. Ask the room: why A and B, when nobody clicked them? They're on the path from E to the root.
> The demo is built on Matthieu Riegler's change detection demo from the Angular team, so the credit goes to him.

</details>

## 4. Running outside zone.js

`running-outside-zone-js.html` · type `claim-code`

![running-outside-zone-js.html](slides/04-running-outside-zone-js.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Demo: /performance/change-detection. All Eager, Reset, click setTimeout on B: every node flashes, checks 2 each (zone entry + timer). Reset, click "outside zone" on B: nothing flashes, B's field stays stale.
> Click through the highlights: the injected zone, then the wrapped createMap call. Click: the punchline.
>
> Here's the tool. NgZone.runOutsideAngular takes a function and runs it outside the zone. Anything it starts, event listeners and timers, isn't patched, so zone.js doesn't trigger change detection after them. Be precise: only zone.js stops. A signal you set in there, or a markForCheck, still schedules a check.
> Switch to the demo. All Eager, Reset counters, click setTimeout on B. Every node flashes, and the counters say two checks each: one for the click, one for the timer. Reset, click outside zone on B. Nothing flashes. B's field did change, but the screen still shows the old value. Ask the room: when will B show the new number? At the next cycle, whatever starts it.
> That's the catch. Fine for a map that draws its own DOM. If a template depends on something in there, set a signal.
> The code is exercise 1. The map is created inside runOutsideAngular, and the arrow function returns it, so const _map still works. Leaflet adds its listeners when the map is created, so wrapping creation is enough.
> Click. If your app at work still runs zone.js, this is the cheapest fix you'll find today: one wrapper, no refactoring. If it's already zoneless, you get this for free, and that's lab 2.

</details>

## 5. Plan B: the Angular track in Chrome

`chrome-performance-angular-track.html` · type `claim-code`

![chrome-performance-angular-track.html](slides/05-chrome-performance-angular-track.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Plan B for anyone without Angular DevTools, and the view when you want milliseconds. Dev build (npm start).
> Console: ng.enableProfiling(). Performance, Record, use the app, Stop. Track "🅰️ Angular" next to Main.
> Colours, from Angular's source: "primary" family for change detection cycles and component names, "secondary" for template functions and host bindings, "tertiary" for lifecycle hooks, listeners and DI.
>
> The second tool lives in Chrome's own Performance panel, so it works without the extension. Angular writes its work into the timeline, but you switch it on yourself: type ng.enableProfiling() in the console of a dev build.
> Then record as usual. Next to the usual tracks there's an Angular track: each change detection cycle, and inside it the components that were checked, with their time in milliseconds.
> Click. Angular colours the entries by kind: one colour family for cycles and components, one for template code, one for lifecycle hooks, listeners and dependency injection. The exact colours depend on the DevTools theme, so read the label, not the colour.
> Which one to use? The Angular DevTools Profiler is simplest for counting cycles. The Performance panel is better when you want milliseconds next to everything else the browser does: layout, paint, long tasks. Our millisecond numbers today come from there.

</details>

## 6. Exercise 1 - Getting started

`exercise-1-getting-started.html` · type `exercise-start`

![exercise-1-getting-started.html](slides/06-exercise-1-getting-started.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Send the groups out. Angular DevTools installed? (pre-course requirement). No extension on a machine: plan B, the Angular track, from the theory.
>
> Before they leave: everyone has the Angular tab in DevTools, or knows plan B. labs/performance/exercise-1, npm install, npm start, http://localhost:4200, allow location.
> Helping a group: "Loading playgrounds" forever means they blocked location. Icon left of the address, reset the permission, reload. The spinner for about three seconds is the slow backend, on purpose.

</details>

## 7. Exercise 1 - Measure before

`exercise-1-measure-before.html` · type `exercise-step`

![exercise-1-measure-before.html](slides/07-exercise-1-measure-before.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Exactly 5 s, mouse moving slowly over the map, no clicks. Count, write it down, click one bar.
>
> Helping a group: no bars at all usually means they recorded before the list loaded, or on the wrong tab. A fixed 5 s is what makes before and after comparable, so make them redo a sloppy recording. Don't give them our number; it's in the debrief.

</details>

## 8. Exercise 1 - Leave the zone

`exercise-1-leave-the-zone.html` · type `exercise-step-code`

![exercise-1-leave-the-zone.html](slides/08-exercise-1-leave-the-zone.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Inject NgZone as zone, wrap createMap(...) only, add inject and NgZone to the import. Mind the closing })).
>
> Helping a group: createMap is one expression, so it becomes an arrow function that returns the map, and const _map still works. A compile error near the options object is nearly always the closing: two parentheses after the object.

</details>

## 9. Exercise 1 - Measure after

`exercise-1-measure-after.html` · type `exercise-step`

![exercise-1-measure-after.html](slides/09-exercise-1-measure-after.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> The same 5 s recording as before, after the change. Write the count next to the first.
>
> Helping a group: still a stream of bars? Check that they wrapped the createMap call itself and reloaded the page. A few bars are left whatever they do, and the debrief explains them.

</details>

## 10. Exercise 1 - Bonus: the list click

`exercise-1-bonus-list-click.html` · type `exercise-step-code`

![exercise-1-bonus-list-click.html](slides/10-exercise-1-bonus-list-click.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Bonus, not in the solution: zoneless fixes the click path for the whole app. Record one list click, wrap setZoom/setView, record again.
>
> Helping a group: the burst after a list click comes from the two center$ subscriptions calling setZoom and setView inside the zone; Leaflet animates the pan from there. Wrapping both calls is enough. It stays out of the solution on purpose.

</details>

## 11. Exercise 1 - Bonus: try it, then revert

`exercise-1-bonus.html` · type `exercise-step-code`

![exercise-1-bonus.html](slides/11-exercise-1-bonus.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Try and revert, not part of the solution. Footer interval outside the zone, record, look at the footer.
>
> Helping a group: the counter freezing is the expected result, not a bug. Make sure they undo the change before they come back. It's the lead-in to the debrief and to zoneless.

</details>

## 12. Exercise 1 - What we measured

`exercise-1-what-we-measured.html` · type `exercise-result`

![exercise-1-what-we-measured.html](slides/12-exercise-1-what-we-measured.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Ask for their two counts first. ~300 -> 5 bars (before 298, 301, 300, 301; after 5, 5, 5). Click: 229 -> 6 ms of change detection in 5 s (median of 3, CPU 4x, Angular track timing). Click: why.
> Before, each bar: all 6 components (App, Home, Leaflet, Sidebar, SidebarListItem, Footer) and 133 list rows. 6, not 7: PlaygroundDetailComponent only exists on /legeplads/:id.
>
> Welcome back. Ask two or three groups for their before and after counts and write them on the board. Ours: about 300 bars in five seconds before, five after. Chrome sends roughly one mousemove per frame while the mouse moves, and every one was a cycle. Your number depends on your mouse and your screen, so the ratio is what counts.
> Ask the room: what on this page needs to know where the mouse is? Nothing. Leaflet adds its mousemove, drag and zoom listeners when it creates the map, and we created it inside Angular's zone, so zone.js patched them and ran change detection after each one. Created outside the zone, they're never patched, which is why wrapping creation is enough.
> Click. In milliseconds: with the CPU slowed down four times, like a mid-range phone, change detection took 229 ms of those five seconds before and 6 ms after. That's time the main thread didn't have for anything else.
> Click. And each of those 300 bars checked all six components and all 133 rows in the sidebar, because a mouse moved over a map. The five left are the footer's one-second timer.
> The footer bonus: who tried it? The bars went, and so did the counter. The field still changed every second, but nothing told Angular any more. zone.js was the only one telling Angular, and with no zone nobody does. That's exactly what happens to the whole app when we go zoneless, next.
> If someone asks: the zoom buttons are added after the wrapped call, so clicking them still runs a cycle. That's a click, not a stream.

</details>

## 13. In your app: leaving the zone

`exercise-1-in-your-app.html` · type `reveal-list`

![exercise-1-in-your-app.html](slides/13-exercise-1-in-your-app.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Monday homework for runOutsideAngular. Click through the four lines.
>
> Here's the same exercise in your own app. Click. Open the screen your users call slow and record five seconds of what they normally do there. Click. Count the bars, click the biggest one and look at what was checked.
> Click. If the app still runs zone.js, look for the things that fire often: addEventListener, setInterval, and third-party widgets like maps, charts and editors that add their own listeners.
> Click. Wrap where they're created in runOutsideAngular, and measure again. If a template shows something from in there, set a signal.
> Ask the room: who has a map, a chart or a drag-and-drop library in their app?

</details>

## 14. From zone.js to zoneless

`from-zone-js-to-zoneless.html` · type `claim-code`

![from-zone-js-to-zoneless.html](slides/14-from-zone-js-to-zoneless.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Recap from signals. Guesses vs is told. Versions: zoneless stable in v20, default in v21.
> runOutsideAngular from exercise 1 can stay: it still compiles and does no harm zoneless.
>
> You saw this in the signals course, so one minute. zone.js guesses: an event or a timer finished, so maybe something changed, check. Zoneless is told: a signal a template reads changed, so refresh that view.
> Zoneless became stable in Angular 20 and is the default for new apps since 21: they write nothing in main.ts. Our app still says provideZoneChangeDetection. In exercise 2 you swap it for provideZonelessChangeDetection and take zone.js out of the build.
> Your runOutsideAngular from exercise 1 can stay. Ask the room: what will happen to the footer counter when the zone is gone? Hold that thought, next slide.

</details>

## 15. Zoneless: what schedules change detection?

`what-schedules-change-detection.html` · type `reveal-list`

![what-schedules-change-detection.html](slides/15-what-schedules-change-detection.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Clicks 1-3: the three that schedule a check, with or without zone.js. Click 4: the ones only zone.js schedules (setTimeout, setInterval, a promise or request finishing). Click: the rule.
> Demo: /performance/change-detection. All OnPush, signal on B: only B flashes. setTimeout on B: nothing flashes, B keeps field 0; click "click" on B: A and B flash, field jumps to 1.
>
> Here's the list to keep in your head. Click, click, click. These three schedule a check, with or without zone.js: a signal read in a template, a listener in a template, markForCheck, which the async pipe calls for you.
> Click. Only zone.js: timers, promises, requests. These used to work only because the zone ran a cycle after every timer and every finished request. Zoneless, they schedule nothing. And assigning a plain field never scheduled anything, the next cycle just happened to pick it up. The footer's setInterval writes a plain field, so ask the room: what happens to the footer counter in exercise 2? It freezes.
> Switch to the demo. All OnPush, Reset. Click signal on B: only B flashes. Click setTimeout on B: nothing flashes, B still shows field 0. Click "click" on B: A and B flash, and now the field jumps to 1. The value was there all along, nobody asked Angular to look.
> Be precise about what you just saw: the demo app still has zone.js. The timer did start a cycle, and OnPush skipped B because nothing marked it. Zoneless, there wouldn't even be a cycle.
> Click. The rule of thumb: if the screen should change, change a signal.

</details>

## 16. OnPush is the default (v22)

`onpush-is-the-default.html` · type `claim-code`

![onpush-is-the-default.html](slides/16-onpush-is-the-default.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Recap from signals. Eager = the old Default: checked whenever the walk reaches it. ng update to 22 adds Eager to every component.
> Mutated input object: same reference, so OnPush sees no change. That's an OnPush rule, with or without zone.js.
>
> Since Angular 22 every component is OnPush unless it says otherwise. The old default is now called Eager, and Default is a deprecated alias for it.
> Eager means: check me every time change detection walks past. That's how the footer's plain field works under zone.js: the zone runs a cycle every second, the footer is checked, the new number shows. ng update adds Eager to every component so nothing changes behaviour, and our app looks exactly like that.
> An OnPush component is checked when an input gets a new value, an event fires in its template, or a signal its template reads changes.
> The catch with inputs: a new value means a new reference. Push to an array that a child gets as an input, and the reference is the same, so OnPush sees nothing and the child stays stale. Pass a new array or object, or make it a signal. That's OnPush, it has nothing to do with zone.js.
> In exercise 2 you make the counter a signal, then the Eager lines can go. Ask the room: in your own app after ng update to 22, how many Eager lines are there? That's your to-do list.

</details>

## 17. Exercise 2 - Measure before

`exercise-2-measure-before.html` · type `exercise-step`

![exercise-2-measure-before.html](slides/17-exercise-2-measure-before.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> labs/performance/exercise-2 for a clean start. Build: polyfills line. Profiler: 10 quiet s, then one list click (3 s). Three numbers on paper before any change.
>
> Helping a group: "quiet" means hands off the mouse. Clicking a bar shows the components it checked in the panel next to the bars. They write the polyfills line raw and transfer.

</details>

## 18. Exercise 2 - Go zoneless

`exercise-2-go-zoneless.html` · type `exercise-step-code`

![exercise-2-go-zoneless.html](slides/18-exercise-2-go-zoneless.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> zone.js out of polyfills, provideZonelessChangeDetection() in main.ts and its import. Restart. Expected: the footer counter freezes.
>
> Helping a group: the frozen counter is the expected result, not a bug; the next step fixes it. runOutsideAngular from exercise 1 stays where it is. No restart, no change: angular.json is only read at start.

</details>

## 19. Exercise 2 - Fix the footer with a signal

`exercise-2-fix-the-footer.html` · type `exercise-step-code`

![exercise-2-fix-the-footer.html](slides/19-exercise-2-fix-the-footer.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> footer: seconds = signal(0), .set(...) in the interval, seconds() in the template, signal in the import. Eager stays everywhere. Then 10 quiet s and one list click.
>
> Helping a group: counter still frozen? The template must call seconds(); without the parentheses it shows the function, not the number. No markForCheck needed: the template reads the signal.

</details>

## 20. Exercise 2 - Remove Eager

`exercise-2-remove-eager.html` · type `exercise-step`

![exercise-2-remove-eager.html](slides/20-exercise-2-remove-eager.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Seven files: app, home, sidebar, sidebar-list-item, playground-detail, leaflet, footer. Only ChangeDetectionStrategy leaves each import.
>
> Helping a group: a compile error after this is almost always an import line where they deleted Component or inject along with ChangeDetectionStrategy.

</details>

## 21. Exercise 2 - Measure after

`exercise-2-measure-after.html` · type `exercise-step`

![exercise-2-measure-after.html](slides/21-exercise-2-measure-after.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> The same three measurements as at the start of the exercise, plus clicking each bar.
>
> Helping a group: they compare three things with their first numbers: bars in 10 quiet s and what one bar checks, bars for one list click, and the polyfills line. Our numbers are in the debrief, not here.

</details>

## 22. Exercise 2 - What we measured

`exercise-2-what-we-measured.html` · type `exercise-result`

![exercise-2-what-we-measured.html](slides/22-exercise-2-what-we-measured.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Ask for their numbers first. Before (zone.js): one list click = 46 bars in 3 s (46, 47, 46). Zoneless + signal, Eager kept: 5 bars in 3 s = 2 from the click + 3 timer bars, every bar still 6 components / 133 rows. 10 quiet s: still 10 bars, each 6 / 133.
>
> Welcome back. Ask a group for their list click before and after going zoneless.
> Click. Under zone.js one click gave us 46 bars, because Leaflet's pan animation ran inside the zone. Zoneless, the click makes two bars, plus the footer's one per second. Nobody wrapped anything: there is no zone left to patch the animation. That's the exercise 1 bonus, for free.
> Click. But at that point every bar still checked all six components and all 133 rows, the footer tick too. Ask the room: why? Every component still said Eager, and Eager means "check me whenever a cycle runs".
> Click. So zoneless decides when a cycle runs. Eager versus OnPush decides how much of the tree it checks. That's why the Eager lines had to go.

</details>

## 23. Exercise 2 - What we measured

`exercise-2-what-we-measured-2.html` · type `exercise-result`

![exercise-2-what-we-measured-2.html](slides/23-exercise-2-what-we-measured-2.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Timer bar = FooterComponent only (1 component, 0 rows), was 6 components / 133 rows. Click: polyfills 35.09 kB -> 494 bytes (Initial total 1.81 MB -> 1.77 MB). Click: the list click.
> List click: 2 bars + timer bars. First: 6 components / 133 rows (new Home). Second: 5 components. A second click ':id' -> ':id' reuses Home: 1 bar, 2 rows.
>
> After removing Eager. Quiet: still one bar per second, because the number really does change every second. But click the bar: only FooterComponent. Before, that tick checked all six components and 133 rows.
> Click. And the build: polyfills from 35 kilobytes to 494 bytes. main is practically the same, so the saving is zone.js itself.
> Click. The list click is still two bars, and the first one checks everything. That's not the signals failing. Look at app.routes.ts: the empty path and ':id' are two route entries that both show HomeComponent. Going from one to the other, the router destroys Home and builds a new one, and a new Home renders all 133 rows. Ask the room: what happens on a second click, from one playground to another? Same route entry, so Home is reused, and that bar checks 2 rows: the one you left and the one you picked.

</details>

## 24. Lists: track and computed

`lists-track-and-computed.html` · type `claim-code`

![lists-track-and-computed.html](slides/24-lists-track-and-computed.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Not a lab: the app already does it right. Numbers from a copy of step-3, dev build, CPU 4x: the server list (new objects, same ids) replaces the cached list.
> track playground.id: 25.6 ms median, 0 rows created. track playground (object identity): 58.0 ms median, 133 rows destroyed + 133 created.
>
> One slide on lists, because every app has one. The list in our app is already done right, so this is to check in yours.
> @for needs a track expression. It tells Angular which row is which when the list changes. The app tracks by id. When the server answer replaces the cached list, every object is new but the ids are the same, so Angular keeps all 133 rows and only updates bindings: 25.6 milliseconds with the CPU slowed down.
> Track the object itself, and every new object is a new row: 133 rows destroyed and 133 created, 58 milliseconds. Ask the room: what does your API return on a refresh, the same objects or new ones?
> Second rule: anything a row derives, put it in a computed, like description and distance here. A method call in a template runs on every check of that row; a computed runs only when what it reads changes.

</details>

## 25. In your app: zoneless and OnPush

`exercise-2-in-your-app.html` · type `reveal-list`

![exercise-2-in-your-app.html](slides/25-exercise-2-in-your-app.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Monday homework for zoneless and signals. Click through the five lines.
>
> Click. Search the code for ChangeDetectionStrategy.Eager and Default. If you ran ng update to 22, every component has one: that's your to-do list.
> Click. Record one timer tick or one click and look at what a single bar checks. If it's the whole tree, you've found your lever.
> Click. Anything a timer, a promise or a request writes that the screen shows: make it a signal, like the footer.
> Click. Before you go zoneless, search for fakeAsync in the tests and onStable in the code: those depend on zone.js.
> Click. And while you're in the templates, check your @for track expressions and any method calls in bindings.

</details>

## 26. What ends up in main?

`what-ends-up-in-main.html` · type `claim-code`

![what-ends-up-in-main.html](slides/26-what-ends-up-in-main.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Tree-shaking keeps what's used. A registered pack is "used": every icon in it ships. Side-effect imports (import 'x') always stay.
> Exercise 3 opens with the esbuild analyzer on our main.
>
> The bundler only keeps code that something uses. That's tree-shaking. Import one icon by name and use it: one icon ships.
> The catch is what counts as "used". Hand a whole pack to a function, like addIconPacks, and every icon in that pack is used as far as the bundler can tell. It has no idea which ones your templates will ask for at runtime.
> Same with a side-effect import, import 'some-lib' with no names: the bundler has to keep it, because running it is the point.
> Click. So before you start splitting things with @defer, find out what's actually heavy. That's the first step of exercise 3. Ask the room: who knows what's in their own main bundle?

</details>

## 27. @defer and its triggers

`defer-triggers.html` · type `claim-code`

![defer-triggers.html](slides/27-defer-triggers.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Demo: /performance/defer (demo on npm run start:no-hmr). Network, filter JS, reload: idle + prefetch chunks at once, timer at 3 s; hover "Hover me": hover-loaded chunk. Click "Downloaded already. Click me": renders, no new request.
> Then: throttle to Slow 4G, reload, click "Click me": "Loading ..." for about a second. Set throttling back to No throttling.
> viewChild(LeafletComponent) in Home on top of the defer: no leaflet chunk (measured on a copy of the exercise 3 start).
>
> @defer is lazy loading for part of a template. Everything inside the block that's only used there, components, directives, pipes, goes into its own chunk and is fetched when the trigger fires.
> Let me show you. Network tab, filter JS, reload. The idle card and the prefetch chunk come in right away, the timer card three seconds later. Ask the room: what happens when I hover "Hover me"? A new request. Now "Downloaded already. Click me": it renders, no new request. That's prefetch: download early, show later.
> The placeholder: what the user sees until the trigger fires. Give it the size of the content, or the page jumps. In the exercise the map placeholder is an empty full-size div. On viewport, hover and interaction without a reference watch the placeholder, so it needs exactly one root element.
> Throttle to Slow 4G, reload, click "Click me": the loading block shows for about a second. Then set throttling back to No throttling, or the rest of the demo crawls.
> Click through the trap: if anything outside the block uses the component, even a viewChild of it, it stays eager and there's no chunk. The build won't warn you; look for the chunk in the lazy table.

</details>

## 28. Exercise 3 - Measure the build

`exercise-3-getting-started.html` · type `exercise-step`

![exercise-3-getting-started.html](slides/28-exercise-3-getting-started.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> labs/performance/exercise-3 for a clean start. npm run build: Initial total, raw and transfer. A written guess for what's in main.
>
> Helping a group: raw is the file on disk, transfer is the estimate after compression. Both go on paper; the guess too, so they can check it on the next slide.

</details>

## 29. Exercise 3 - What is in main?

`exercise-3-whats-in-main.html` · type `exercise-step-image`

![exercise-3-whats-in-main.html](slides/29-exercise-3-whats-in-main.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> npm run build -- --stats-json. https://esbuild.github.io/analyze/, "Import your metafile...", dist/performance/browser-stats.json. Expect: main 1.5 mb, @fortawesome 1.1 mb of it.
>
> Helping a group: the file is dist/performance/browser-stats.json, next to the browser folder, not inside it. Analyzer units are KiB. Nothing is uploaded: the page runs locally.

</details>

## 30. Exercise 3 - Lazy detail route

`exercise-3-lazy-route.html` · type `exercise-step-code`

![exercise-3-lazy-route.html](slides/30-exercise-3-lazy-route.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Change 1: app.routes.ts. The import() path is 'src/app/playground-detail/playground-detail.component', copied from the static import line, which then goes. Lazy table: playground-detail-component, about 1 kB.
>
> Helping a group: no lazy table in the build output means the class is still imported somewhere the normal way. Initial total barely moving is expected; the chunk is the proof.

</details>

## 31. Exercise 3 - Defer the map

`exercise-3-defer-map.html` · type `exercise-step-code`

![exercise-3-defer-map.html](slides/31-exercise-3-defer-map.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Change 2: home.component.ts, @defer (on idle) around leaflet, placeholder an empty vh-100 vw-100 div. Lazy table: leaflet-component, about 155 kB.
>
> Helping a group: no leaflet-component chunk means something in Home still uses LeafletComponent outside the block. The map painting a moment later is expected; the debrief measures what it costs.

</details>

## 32. Exercise 3 - Defer the footer, then revert

`exercise-3-defer-footer.html` · type `exercise-step-code`

![exercise-3-defer-footer.html](slides/32-exercise-3-defer-footer.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Change 3: try, measure, revert. @defer (on viewport) around loop-footer, placeholder <footer>&nbsp;</footer>.
>
> Helping a group: Initial total going up is the expected result, not a mistake. Don't explain it, the debrief does. Make sure they revert before the next change.

</details>

## 33. Exercise 3 - Register one icon

`exercise-3-one-icon.html` · type `exercise-step-code`

![exercise-3-one-icon.html](slides/33-exercise-3-one-icon.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Change 4: main.ts. Delete initializeFontAwesomeFactory and the fas/far imports; provideAppInitializer(() => inject(FaIconLibrary).addIcons(faSpinner)).
>
> Helping a group: spinners gone and "Could not find icon with iconName=spinner and prefix=fas in the icon library" in the console means addIcons is missing. inject and FaIconLibrary need imports too.

</details>

## 34. Exercise 3 - Watch the chunks load

`exercise-3-see-it-load.html` · type `exercise-step-image`

![exercise-3-see-it-load.html](slides/34-exercise-3-see-it-load.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> npm run start:no-hmr. Network, JS, filter /main\.js|component/ (slashes included: a regex), reload. leaflet.component right after main; playground-detail.component only after Detaljer.
>
> Helping a group: every chunk at once means they still run plain npm start, whose hot module replacement loads defer chunks eagerly. An empty list means the filter is missing its slashes.

</details>

## 35. Exercise 3 - What we measured

`exercise-3-what-we-measured.html` · type `exercise-result`

![exercise-3-what-we-measured.html](slides/35-exercise-3-what-we-measured.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Raw Initial total, cumulative in slide order: start 1.77 MB / 383.17 kB, + route 1.77 MB / 383.58 kB, + map 1.62 MB / 346.92 kB, + icons (footer reverted) 615.00 kB / 125.46 kB. The solution (with the hidden Om appen bonus): 620.49 kB / 123.67 kB.
> Footer on top of route + map: 1.62 -> 1.64 MB (1,639.49 kB / 347.37 kB). Alone on the start: 1.77 -> 1.78 MB, +7,678 B: defer runtime + viewport trigger in, footer (920 B) out.
>
> Welcome back. Ask a group for their Initial totals, one per change. Ours, each build on top of the last: the lazy route barely moves it, the map takes it from 1.77 to 1.62 megabytes, and the icons take it from 1.62 megabytes to 615 kilobytes. Ask the room: who guessed the icons before the analyzer?
> Click. And the footer. It made Initial total go up. The first @defer in an app pulls in Angular's defer runtime and, for on viewport, the IntersectionObserver trigger. The footer component that moves out is 920 bytes. So you pay more than you save, and on top of that the footer is in view from the first frame, so the chunk is fetched straight away.
> Click. That's why the solution reverts it. Defer what's heavy and below the fold or behind a click, not what's small and in view. The solution, with the four changes minus the footer, is 620 kilobytes.

</details>

## 36. Exercise 3 - On a slow phone

`exercise-3-cold-load.html` · type `exercise-result`

![exercise-3-cold-load.html](slides/36-exercise-3-cold-load.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Production builds, step-3 vs step-4, npx serve with gzip, fresh context, cache off, CPU 4x, DevTools Slow 4G preset. Medians of 3: FCP 4.4 s -> 2.3 s, LCP 9.4 s -> 7.4 s. JS transferred 477 kB -> 160 kB.
> LCP element is always a map tile. Step-4 with vs without the map @defer: LCP 80 ms earlier with it (Slow 4G), 84 ms (Fast 4G).
>
> What does that mean for a user? We served both builds for real and loaded them with Chrome's Slow 4G preset and the CPU slowed down four times.
> Click. First contentful paint, when something shows: 4.4 seconds before, 2.3 after.
> Click. Largest contentful paint: 9.4 down to 7.4 seconds. It's that late because the backend takes three seconds on purpose, and the largest element is a map tile.
> Click. And the worry from the map slide: deferring the map trades a smaller first download for a map that paints later. So we measured that too: with the map deferred, LCP was not later, it was 80 milliseconds earlier, because the list and the rest of the page compete less for the network. Measure it in your app, it can go either way.

</details>

## 37. In your app: the first download

`exercise-3-in-your-app.html` · type `reveal-list`

![exercise-3-in-your-app.html](slides/37-exercise-3-in-your-app.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Monday homework for loading less. Click through the five lines.
>
> Click. Build your own app and write down Initial total. Click. Then the stats flag and the analyzer, and name the three biggest things in main.
> Then work down the list, cheapest first. Click. Something registered whole, like icons or locales, becomes one by one. Click. Routes almost nobody visits get loadComponent. Click. Heavy components below the fold or behind a click get @defer, but not small things that are in view from the start: you saw what the footer cost. Build after each change.
> Ask the room: who will open the analyzer on their own app this week?

</details>

## 38. Leaks in Angular apps

`leaks-in-angular-apps.html` · type `claim-image`

![leaks-in-angular-apps.html](slides/38-leaks-in-angular-apps.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Demo: /performance/leaks. Mount a playground card, Unmount, Mount + unmount 10 times: Created 11, Still alive 11; Memory -> Collect garbage: still 11. Reload, tick Use the fix, Mount + unmount 10 times, collect garbage: Created 10, Collected 10, Still alive 0.
> Click: eleven cards nobody can see.
>
> Garbage collection frees what nothing points to. A leak is when something that lives longer than your component still points at it. In a single page app the page lives for hours, so every navigation can add one more.
> The usual suspects. setInterval: the browser holds your callback, and the callback holds the component. Listeners you put on window or document yourself. Third-party objects like a Leaflet map, which adds its own listener on window. And a subscribe you made by hand to something that outlives the component.
> Let me show you. /performance/leaks. Mount a card, unmount it, then Mount + unmount 10 times. Created 11, Still alive 11. Open the Memory tab and click Collect garbage: still 11. Nothing lets go of them.
> Reload, tick Use the fix, same clicks, collect garbage: Created 10, Collected 10, Still alive 0.
> Click. Eleven cards unmounted, eleven still in memory.
> Two of these suspects are in our app on purpose. That's exercise 4.

</details>

## 39. Reading a heap snapshot

`reading-a-heap-snapshot.html` · type `reveal-list`

![reading-a-heap-snapshot.html](slides/39-reading-a-heap-snapshot.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> The tool for exercise 4, before they leave. DevTools, Memory, Heap snapshot, Take snapshot. Click through the four lines, then the trap.
>
> Here's how you read the Memory panel, because in the exercise you're on your own with it.
> Click. Open DevTools, Memory, pick Heap snapshot and take one. Then do the navigation you suspect, a fixed number of times, and take a second one. A snapshot always collects garbage first, so what's in it is really held.
> Click. The class filter at the top of the Summary narrows the rows. Type a component's class name and you get its count. Type Detached and you get one row per tag: Detached div, Detached button, and so on. DevTools has no total for all of them, so read the row for an element you know.
> Click. One count on its own means nothing. A count that grows with the number of rounds is a leak. That's why you count your rounds.
> Click. Open the row, click one object, and the Retainers pane underneath shows the chain of references that keeps it alive. Read it from the bottom: start at something long-lived, like Window or a timer, and follow it up to your object.
> Click. The trap: if you clicked a node in the Elements panel or logged it, DevTools itself holds on to it, and the retainer says DevTools console. That's not your app. Clear the console, or snapshot from a fresh tab.
> If you want a quicker look in your own app later: the same panel has a profile type called Detached elements. Today we use the snapshot, because it shows the components too.

</details>

## 40. Cleaning up with DestroyRef

`cleaning-up-with-destroyref.html` · type `claim-code`

![cleaning-up-with-destroyref.html](slides/40-cleaning-up-with-destroyref.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> DestroyRef.onDestroy: runs when the owner (component, directive, service) is destroyed. Register synchronously, in the constructor or right after creating the thing: after an await, registering on a destroyed owner throws NG0911.
> takeUntilDestroyed() with no argument only in an injection context; pass a DestroyRef elsewhere.
>
> DestroyRef is the one tool for cleanup. Inject it, and onDestroy takes a function that runs when the component, directive or service that owns it is destroyed. Both exist since Angular 16.
> The big advantage over ngOnDestroy: you write the cleanup right next to the thing it cleans up, and you don't store the id in a field just to reach it later.
> One rule: register synchronously, when you create the thing. If you register after an await and the component was destroyed in the meantime, Angular throws NG0911.
> For RxJS there's takeUntilDestroyed. In a constructor or field initializer you call it with no argument; anywhere else, ngAfterViewInit for example, pass in the DestroyRef, or it throws because there's no injection context.
> In the exercise you do the first half for the footer and the same for the Leaflet map: after you create it, register a callback that calls remove on the map.

</details>

## 41. Exercise 4 - Find the leaks

`exercise-4-find-the-leaks.html` · type `exercise-step`

![exercise-4-find-the-leaks.html](slides/41-exercise-4-find-the-leaks.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> labs/performance/exercise-4 for a clean start. Memory, Heap snapshot, snapshot 1 on home; 5 rounds (select, Detaljer, Tilbage til kortet); snapshot 2.
>
> Helping a group: Detaljer is in the footer once a playground is selected; Tilbage til kortet is on the detail page. Make them count the rounds: the numbers only make sense with exactly five.

</details>

## 42. Exercise 4 - Read the snapshot

`exercise-4-read-the-snapshot.html` · type `exercise-step`

![exercise-4-read-the-snapshot.html](slides/42-exercise-4-read-the-snapshot.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Class filter: Detached <leaflet>, then FooterComponent. Count, write down. Then Retainers on one detached leaflet.
>
> Helping a group: there's no single Detached total, one row per tag; they read the leaflet row. A retainer chain ending in DevTools console is the trap on the slide: clear the console, fresh tab, again.

</details>

## 43. Exercise 4 - Fix the leaks

`exercise-4-fix-the-leaks.html` · type `exercise-step-code`

![exercise-4-fix-the-leaks.html](slides/43-exercise-4-fix-the-leaks.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Footer: const id = setInterval(...); inject(DestroyRef).onDestroy(() => clearInterval(id)). Leaflet: field destroyRef, onDestroy(() => _map.remove()) right after the map is created.
>
> Helping a group: register the callbacks right where the interval and the map are created, not in ngOnDestroy. NG0911 in the console means they registered after the component was destroyed, for example after an await.

</details>

## 44. Exercise 4 - Measure after

`exercise-4-measure-after.html` · type `exercise-step`

![exercise-4-measure-after.html](slides/44-exercise-4-measure-after.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> The same measurement as before the fix: snapshot, exactly 5 rounds, snapshot, the same two filters.
>
> Helping a group: a count that still grows? Retainers on one of them again; if it says DevTools console, clear the console and repeat from a fresh tab.

</details>

## 45. Exercise 4 - Bonus: takeUntilDestroyed

`exercise-4-bonus-take-until-destroyed.html` · type `exercise-step-code`

![exercise-4-bonus-take-until-destroyed.html](slides/45-exercise-4-bonus-take-until-destroyed.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Bonus, in the solution (step-5). takeUntilDestroyed from @angular/core/rxjs-interop, this.destroyRef in all three pipes. The subscriptions array, ngOnDestroy, OnDestroy and the Subscription import go.
>
> Helping a group: "takeUntilDestroyed() can only be used within an injection context" means they left out this.destroyRef. They can compare with the solution afterwards.

</details>

## 46. Exercise 4 - What we measured

`exercise-4-what-we-measured.html` · type `exercise-result`

![exercise-4-what-we-measured.html](slides/46-exercise-4-what-we-measured.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Ask for their counts first. Before, after 5 rounds (3 of 3 runs): Detached <leaflet> 10, FooterComponent 11 (1 live + 10), Detached <loop-sidebar-list-item> 1,330 (10 x 133); HomeComponent 1, LeafletComponent 1. After (step-5): no Detached <leaflet>, <loop-sidebar-list-item>, <loop-home>, <loop-footer> or <footer> rows; FooterComponent 1.
>
> Welcome back. Ask a group for their before and after counts.
> Ours: ten detached leaflet elements before, and the row is gone after. If you want a bigger number, Detached <loop-sidebar-list-item> said 1,330 before: ten old lists of 133 rows. After, gone too.
> Click. Eleven footers before: one on screen, ten that should have been gone. After, one.
> Click. Why ten, after five rounds? Look at app.routes.ts: the empty path and ':id' are two route entries with the same HomeComponent. Selecting a playground goes from one to the other, and the router builds a new Home. Tilbage til kortet goes back to the empty path: another new Home. Two per round, five rounds, ten.
> Ask the room: who found what held the map? Next slide.

</details>

## 47. What holds the old DOM

`what-holds-the-old-dom.html` · type `claim-image`

![what-holds-the-old-dom.html](slides/47-what-holds-the-old-dom.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Retainers pane on a Detached <leaflet>, step-4 after 5 rounds (real DevTools). Read bottom-up: Window._leaflet_events -> resize handler -> its closure -> the map (NewClass, _container) -> div.leaflet-container -> the detached tree.
> HomeComponent count stays 1: Angular keeps a numeric LView id on DOM nodes, not a pointer to the component, so the old DOM stays alive, not the old Home instance.
>
> Here's what the Retainers pane shows. Read it from the bottom: Window has a _leaflet_events object, Leaflet's own bookkeeping. In it a resize handler. The handler's closure has the map, the map has its container div, and a detached node keeps its whole tree, up through the leaflet element to the old page.
> Be precise about what leaks. It's the old DOM tree, all 133 rows of the old list included. The old HomeComponent object is gone: the snapshot has exactly one. Angular stores a number on DOM nodes to find its view, not the component itself, so the DOM doesn't drag the component along.
> The footer is different: its setInterval callback is an arrow function that uses this, so the browser's timer list holds the footer component itself. That's the eleven.
> Ask the room: who put a listener on window? We didn't. Leaflet did, and it only takes it off in map.remove(). That's why the fix was two onDestroy callbacks: map.remove() and clearInterval. Leave the interval running and the browser holds the footer; skip remove() and window holds the old page.

</details>

## 48. In your app: leaks

`exercise-4-in-your-app.html` · type `reveal-list`

![exercise-4-in-your-app.html](slides/48-exercise-4-in-your-app.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Monday homework for DestroyRef. Click through the five lines.
>
> Click. Pick the navigation your users do over and over: open a record, back to the list. Five rounds of it. Click. Snapshot before and after, filter on your page components and on Detached: if a count grows with the rounds, you've got a leak.
> Click. The Retainers pane tells you who holds it.
> Click. Then search for the usual suspects: setInterval, addEventListener, and subscribe calls without takeUntilDestroyed or other cleanup.
> Click. Clean up in DestroyRef.onDestroy, right next to what you started, and count again.

</details>

## 49. The fixes of the day

`wrap-the-fixes-of-the-day.html` · type `wrap`

![wrap-the-fixes-of-the-day.html](slides/49-wrap-the-fixes-of-the-day.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Four fixes, in the order they paid off in THIS app. Yours will differ: measure. Read the Monday line out. Click: the question.
>
> Here's the day on one slide, in the order they paid off in our app.
> One: load less. Our first download was 1.77 megabytes, and the biggest part wasn't the map, it was an icon library we registered in full. The analyzer showed it. Only the icon we use, a lazy route and a deferred map, and Initial total was 620 kilobytes. On a slow phone, first paint went from 4.4 to 2.3 seconds. @defer needs Angular 17.
> Two: the map's mouse events ran change detection for the whole app. Five seconds of mouse moves, about 300 Profiler bars, 229 milliseconds of change detection on a slow CPU. One runOutsideAngular, and it was 5 bars and 6 milliseconds. Works in every version that has zone.js.
> Three: every visit left the old page's DOM and a footer behind. After five rounds, ten detached maps in the heap snapshot. Two onDestroy callbacks, and it was 0. DestroyRef needs Angular 16.
> Four: zoneless and signals. When the footer ticks, the Profiler shows Angular checking the footer instead of all six components, and the list click went from 46 bars to 2. Stable from Angular 20. It pays more the bigger your component tree is.
> So on Monday: in your own app, start with the kind of slow your users complain about, not the fix you liked best today. Measure that first: Initial total from the build, bars in the Profiler, or counts across two heap snapshots. Write the number down, change one thing, measure again.
> Click. Ask the room: which one would you try at work, and what would you measure first? Let two or three people answer.

</details>

## 50. Time for questions 🤓

`time-for-questions.html` · type `statement`

![time-for-questions.html](slides/50-time-for-questions.jpg?v=1793524047)

<details><summary>Speaker notes</summary>

> Questions. If it's quiet, ask the Monday question.
>
> Any questions about today, or about your own app? If it's quiet, ask the room: what will you measure first in your own app on Monday? Build size, Profiler bars or a heap snapshot? Let one or two people say why.

</details>
