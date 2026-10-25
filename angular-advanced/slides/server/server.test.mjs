import { test, before, after } from 'node:test';
import http from 'node:http';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from './server.mjs';

let root, server, base;

before(async () => {
  root = await mkdtemp(join(tmpdir(), 'slides-'));
  await mkdir(join(root, 'slides/intro'), { recursive: true });
  await mkdir(join(root, 'courses/demo/slides'), { recursive: true });
  await writeFile(join(root, 'slides/deck.json'), JSON.stringify({ title: 'T', slides: [{ file: 'a.html' }], courses: ['demo'] }));
  await writeFile(join(root, 'slides/intro/a.html'), '<section>a</section>');
  await writeFile(join(root, 'courses/demo/slides/deck.json'), JSON.stringify({ title: 'Demo', slides: [{ file: 'one.html' }, { file: 'two.html', hidden: true }] }));
  await writeFile(join(root, 'courses/demo/slides/one.html'), '<section>one</section>');
  await writeFile(join(root, 'courses/demo/slides/two.html'), '<section>two</section>');
  server = createServer({ root, dist: join(root, 'nodist') });
  await new Promise(r => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
});

after(async () => {
  server.close();
  await rm(root, { recursive: true });
});

// fetch() normalizes "../" away; send the raw path like a hostile client would.
const raw = (method, path, body = '') => new Promise((ok, fail) => {
  const req = http.request({ host: 'localhost', port: server.address().port, method, path }, res => { res.resume(); ok(res.statusCode); });
  req.on('error', fail);
  req.end(body);
});

const deck = () => fetch(`${base}/api/deck`).then(r => r.json());

test('GET /api/deck returns intro and courses with html and etags', async () => {
  const d = await deck();
  assert.equal(d.title, 'T');
  assert.equal(d.slides[0].path, 'slides/intro/a.html');
  assert.equal(d.slides[0].hidden, false);
  assert.equal(d.slides[0].html, '<section>a</section>');
  assert.equal(d.courses[0].id, 'demo');
  assert.equal(d.courses[0].title, 'Demo');
  assert.equal(d.courses[0].slides[1].hidden, true);
  assert.match(d.courses[0].slides[0].etag, /^[0-9a-f]{40}$/);
});

test('PUT with the current etag replaces the file and returns a new ETag', async () => {
  const etag = (await deck()).courses[0].slides[0].etag;
  const r = await fetch(`${base}/api/files/courses/demo/slides/one.html`, { method: 'PUT', headers: { 'If-Match': etag }, body: '<section>new</section>' });
  assert.equal(r.status, 200);
  assert.equal(await readFile(join(root, 'courses/demo/slides/one.html'), 'utf8'), '<section>new</section>');
  assert.notEqual(r.headers.get('etag'), etag);
});

test('PUT with a stale If-Match answers 409 and leaves the file alone', async () => {
  const r = await fetch(`${base}/api/files/courses/demo/slides/two.html`, { method: 'PUT', headers: { 'If-Match': 'stale' }, body: 'x' });
  assert.equal(r.status, 409);
  assert.equal(await readFile(join(root, 'courses/demo/slides/two.html'), 'utf8'), '<section>two</section>');
});

test('paths outside the slide folders are rejected with 400', async () => {
  for (const p of ['../package.json', 'courses/demo/slides/../../x.html', 'courses/demo/other/x.html', 'courses/demo/slides/%2e%2e/x.html']) {
    assert.equal(await raw('PUT', `/api/files/${p}`, 'x'), 400, p);
  }
  await assert.rejects(readFile(join(root, 'courses/demo/x.html')));
});

test('DELETE of an allowed missing file answers 404', async () => {
  const r = await fetch(`${base}/api/files/courses/demo/slides/missing.html`, { method: 'DELETE' });
  assert.equal(r.status, 404);
});

test('GET /content serves allowed files only', async () => {
  assert.equal((await fetch(`${base}/content/slides/intro/a.html`)).status, 200);
  assert.equal(await raw('GET', '/content/slides/deck.json/../../secret'), 400);
});
