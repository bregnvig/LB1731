import { test as base } from '@playwright/test';
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import type { Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** Editor tests write files, so each test gets its own server on a copy of the fixture. */
export const test = base.extend<{ root: string; editor: string }>({
  root: async ({}, use) => {
    const root = mkdtempSync(join(tmpdir(), 'slides-'));
    cpSync(join(__dirname, 'fixture'), root, { recursive: true });
    await use(root);
    rmSync(root, { recursive: true, force: true });
  },
  editor: async ({ root }, use) => {
    // @ts-expect-error plain JS module (dynamic: the server is an ES module, this file compiles to CommonJS)
    const { createServer } = await import('../server/server.mjs');
    const server: Server = createServer({ root, dist: join(__dirname, '../dist/slides/browser') });
    await new Promise<void>(ok => server.listen(0, ok));
    await use(`http://localhost:${(server.address() as { port: number }).port}`);
    server.close();
  },
});
export { expect } from '@playwright/test';
