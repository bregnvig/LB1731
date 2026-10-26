// Serves the built slides app and a small file API over the slide content.
// Usage: node server/server.mjs [--root <angular-advanced dir>] [--port 4300]
import http from 'node:http';
import { readFile, writeFile, unlink, mkdir } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { isAllowedPath, etagOf, loadDeck } from './files.mjs';

const here = dirname(fileURLToPath(import.meta.url));

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf',
};

const readBody = req => new Promise((ok, fail) => {
  const chunks = [];
  req.on('data', c => chunks.push(c)).on('end', () => ok(Buffer.concat(chunks))).on('error', fail);
});

async function readOrNull(file) {
  try { return await readFile(file); } catch { return null; }
}

export function createServer({ root, dist, routes = {} }) {
  return http.createServer(async (req, res) => {
    const send = (status, body = '', headers = {}) => { res.writeHead(status, headers); res.end(body); };
    try {
      // URL parsing would quietly resolve "../"; refuse such requests outright instead.
      if (/(^|\/)\.\.(\/|$)/.test(decodeURIComponent(req.url.split('?')[0]))) return send(400, 'path not allowed');
      const url = new URL(req.url, 'http://localhost');
      const path = decodeURIComponent(url.pathname);

      if (routes[`${req.method} ${path}`]) return await routes[`${req.method} ${path}`](req, res);

      if (path === '/api/deck' && req.method === 'GET') {
        return send(200, JSON.stringify(await loadDeck(root)), { 'Content-Type': TYPES['.json'] });
      }

      for (const prefix of ['/api/files/', '/content/']) {
        if (!path.startsWith(prefix)) continue;
        const rel = path.slice(prefix.length);
        if (!isAllowedPath(rel)) return send(400, 'path not allowed');
        const file = join(root, rel);
        const current = await readOrNull(file);
        if (req.method === 'GET') {
          return current ? send(200, current, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream', ETag: etagOf(current) }) : send(404);
        }
        if (prefix !== '/api/files/') return send(405);
        if (req.method === 'DELETE') {
          if (!current) return send(404);
          await unlink(file);
          return send(204);
        }
        if (req.method === 'PUT') {
          const ifMatch = req.headers['if-match'];
          if (ifMatch && (!current || ifMatch !== etagOf(current))) return send(409, 'changed on disk');
          const body = await readBody(req);
          await mkdir(dirname(file), { recursive: true });
          await writeFile(file, body);
          return send(200, '', { ETag: etagOf(body) });
        }
        return send(405);
      }

      // The Angular app: static files, falling back to index.html for client routes.
      const asset = path !== '/' && !path.includes('..') ? await readOrNull(join(dist, path)) : null;
      if (asset) return send(200, asset, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' });
      const index = await readOrNull(join(dist, 'index.html'));
      return index ? send(200, index, { 'Content-Type': TYPES['.html'] }) : send(404, 'app not built: run ng build');
    } catch (e) {
      send(500, String(e?.message ?? e));
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { root: { type: 'string', default: join(here, '../..') }, port: { type: 'string', default: '4300' } } });
  const root = resolve(values.root);
  const port = Number(values.port);
  const routes = {
    // The editor's Export PDF button.
    'POST /api/pdf': async (req, res) => {
      const { exportPdf } = await import('../scripts/pdf.mjs');
      const path = await exportPdf({ root, url: `http://localhost:${port}` });
      res.writeHead(200, { 'Content-Type': TYPES['.json'] }).end(JSON.stringify({ path }));
    },
  };
  createServer({ root, dist: join(here, '../dist/slides/browser'), routes }).listen(port, () => {
    console.log(`Slides: http://localhost:${values.port}/present  (editor: /edit, presenter: /presenter)`);
  });
}
