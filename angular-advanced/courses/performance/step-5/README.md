# Performance

The playground app from the signals course, with a few performance problems to find and fix.

## Run it

```bash
npm install
npm start
```

Open `http://localhost:4200/`. Clicking a playground selects it; the footer's `Detaljer` link opens its detail page.

## Build

`npm run build` (or `npx ng build`) builds to `dist/performance` and prints the initial and lazy chunk sizes.

## Watching `@defer` load

The dev server's hot module replacement loads every `@defer` chunk up front. To see the chunks load lazily in the Network tab, start without it:

```bash
npm start -- --no-hmr
```
