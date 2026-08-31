#!/usr/bin/env node
/**
 * Serve the slide deck locally with live reload.
 *
 * Watches index.html and the deck's assets, and reloads the browser whenever
 * one is saved, so you can edit a slide and see the result immediately.
 *
 * Reload works by appending a tiny <script> to index.html as it is served; the
 * script listens on a Server-Sent Events endpoint and calls location.reload()
 * when a file changes. Only the in-memory response is modified - the file on
 * disk is never touched, which matters because index.html is a slides.com
 * export that has to stay byte-identical for re-import.
 *
 * Usage:
 *   npm start                    # serve on :3000 and open a browser
 *   node serve.mjs --port 4000
 *   node serve.mjs --no-open     # don't launch a browser
 *   node serve.mjs --print       # open reveal's print-pdf view
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- arguments

function parseArgs(argv) {
  const opts = { port: 3000, open: true, print: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '--port': case '-p': {
        const value = argv[i + 1];
        if (!value || value.startsWith('--')) throw new Error(`${arg} needs a port number`);
        opts.port = Number(value);
        if (!Number.isInteger(opts.port) || opts.port < 1 || opts.port > 65535) {
          throw new Error(`invalid port: ${value}`);
        }
        i += 1;
        break;
      }
      case '--no-open': opts.open = false; break;
      case '--print': opts.print = true; break;
      case '--help': case '-h': opts.help = true; break;
      default: throw new Error(`Unknown option: ${arg}`);
    }
  }
  return opts;
}

const HELP = `
Serve the slide deck with live reload.

  --port, -p <n>   Port to serve on          (default: 3000)
  --no-open        Don't open a browser
  --print          Open reveal's ?print-pdf view (what the PDF export renders)
  --help, -h       Show this message
`;

// ------------------------------------------------------------------- assets

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
};

// Injected before </body>. Reconnects on its own if the server restarts.
const RELOAD_SNIPPET = `
<script>
(() => {
  let source;
  const connect = () => {
    source = new EventSource('/__livereload');
    source.onmessage = (e) => { if (e.data === 'reload') location.reload(); };
    source.onerror = () => { source.close(); setTimeout(connect, 1000); };
  };
  connect();
})();
</script>
`;

// ---------------------------------------------------------------------- main

let opts;
try {
  opts = parseArgs(process.argv.slice(2));
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

if (opts.help) {
  console.log(HELP);
  process.exit(0);
}

/** Open SSE connections, one per browser tab. */
const clients = new Set();

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

  // Live-reload event stream.
  if (url.pathname === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('retry: 1000\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  try {
    const decoded = decodeURIComponent(url.pathname);
    let filePath = resolve(HERE, `.${decoded}`);

    // Never serve outside the slides folder.
    if (filePath !== HERE && !filePath.startsWith(HERE + sep)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    let info = await stat(filePath).catch(() => null);
    if (info?.isDirectory()) {
      filePath = join(filePath, 'index.html');
      info = await stat(filePath).catch(() => null);
    }
    if (!info) {
      res.writeHead(404).end('Not found');
      return;
    }

    const ext = extname(filePath).toLowerCase();
    const type = MIME[ext] ?? 'application/octet-stream';

    // Only HTML gets the reload snippet; everything else is served untouched.
    if (ext === '.html') {
      const html = await readFile(filePath, 'utf8');
      const body = html.includes('</body>')
        ? html.replace('</body>', `${RELOAD_SNIPPET}</body>`)
        : html + RELOAD_SNIPPET;
      const buf = Buffer.from(body, 'utf8');
      res.writeHead(200, {
        'Content-Type': type,
        'Content-Length': buf.length,
        'Cache-Control': 'no-store',
      });
      res.end(buf);
      return;
    }

    const buf = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': buf.length,
      'Cache-Control': 'no-cache',
    });
    res.end(buf);
  } catch {
    res.writeHead(500).end('Server error');
  }
});

// ------------------------------------------------------------------ watching

const WATCH_DIRS = ['.', 'angular-foundation', 'lib'];
const WATCHED_EXT = new Set(['.html', '.css', '.js', '.mjs', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp']);

let reloadTimer;
function scheduleReload(filename) {
  // Editors often fire several events per save; collapse them.
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    console.log(`[slides] changed: ${filename} - reloading ${clients.size} client${clients.size === 1 ? '' : 's'}`);
    for (const client of clients) client.write('data: reload\n\n');
  }, 100);
}

function startWatching() {
  for (const dir of WATCH_DIRS) {
    const target = resolve(HERE, dir);
    try {
      watch(target, { recursive: true }, (_event, filename) => {
        if (!filename) return;
        const name = filename.toString();
        if (name.includes('node_modules') || name.startsWith('.')) return;
        if (!WATCHED_EXT.has(extname(name).toLowerCase())) return;
        scheduleReload(dir === '.' ? name : `${dir}/${name}`);
      });
    } catch (err) {
      console.warn(`[slides] cannot watch ${dir}: ${err.message}`);
    }
  }
}

// --------------------------------------------------------------------- boot

function openBrowser(url) {
  const cmd = process.platform === 'darwin' ? 'open'
    : process.platform === 'win32' ? 'start'
    : 'xdg-open';
  spawn(cmd, [url], { stdio: 'ignore', detached: true }).unref();
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${opts.port} is already in use. Try: node serve.mjs --port ${opts.port + 1}`);
  } else {
    console.error(err.message);
  }
  process.exit(1);
});

server.listen(opts.port, () => {
  const path = opts.print ? '/index.html?print-pdf' : '/index.html';
  const url = `http://localhost:${opts.port}${path}`;
  console.log(`[slides] serving ${HERE}`);
  console.log(`[slides] ${url}`);
  console.log('[slides] watching for changes - Ctrl+C to stop');
  startWatching();
  if (opts.open) openBrowser(url);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    for (const client of clients) client.end();
    server.close(() => process.exit(0));
  });
}
