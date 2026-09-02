#!/usr/bin/env node
/**
 * Export the Angular Foundation deck (index.html) to PDF.
 *
 * The deck is a slides.com/reveal.js export, so this drives reveal's built-in
 * `?print-pdf` mode in headless Chrome and prints to PDF at the deck's own
 * 1280x720 slide size.
 *
 * Usage:
 *   node export-pdf.mjs                        # -> exercises-angular-foundation.pdf
 *   node export-pdf.mjs --out deck.pdf
 *   node export-pdf.mjs --fragments            # one page per build step
 *   node export-pdf.mjs --input other.html
 *
 * Requires Puppeteer. If it isn't installed, the script falls back to any
 * Chrome/Chromium it can find on the system and tells you what to do.
 */

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { access, mkdir, readFile, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

// Deck geometry, matching Reveal.initialize() in index.html.
const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;

// ---------------------------------------------------------------- arguments

function parseArgs(argv) {
  const opts = {
    input: 'index.html',
    out: 'exercises-angular-foundation.pdf',
    fragments: false,
    port: 0,
    timeout: 120_000,
    scale: 1,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) {
        throw new Error(`Option ${arg} needs a value`);
      }
      i += 1;
      return value;
    };

    switch (arg) {
      case '--input': case '-i': opts.input = next(); break;
      case '--out': case '-o': opts.out = next(); break;
      case '--fragments': case '-f': opts.fragments = true; break;
      case '--port': case '-p': opts.port = Number(next()); break;
      case '--timeout': opts.timeout = Number(next()) * 1000; break;
      case '--scale': opts.scale = Number(next()); break;
      case '--help': case '-h': opts.help = true; break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }
  return opts;
}

const HELP = `
Export the reveal.js deck to PDF.

  --input,  -i <file>   HTML deck to export        (default: index.html)
  --out,    -o <file>   Output PDF path            (default: exercises-angular-foundation.pdf)
  --fragments, -f       One page per fragment/build step (reveal's
                        pdfSeparateFragments). Progressive code highlights
                        written as data-line-numbers="7-9|3" then get a page
                        per step instead of only their final state.
  --port,   -p <n>      Port for the local static server (default: random free)
  --timeout <seconds>   Page load timeout          (default: 120)
  --scale   <n>         Render scale factor        (default: 1)
  --help,   -h          Show this message
`;

// ------------------------------------------------------------ static server

// reveal loads lib/*.js, fonts and images by relative path. file:// URLs trip
// over cross-origin rules for some of that, so serve the folder over HTTP.
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
};

function startServer(root, port) {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const decoded = decodeURIComponent(url.pathname);
      const filePath = resolve(root, `.${decoded}`);

      // Never serve outside the deck folder.
      if (filePath !== root && !filePath.startsWith(root + sep)) {
        res.writeHead(403).end('Forbidden');
        return;
      }

      const body = await readFile(filePath);
      res.writeHead(200, {
        'Content-Type': MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
        'Content-Length': body.length,
      });
      res.end(body);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });

  return new Promise((resolvePromise, reject) => {
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => resolvePromise(server));
  });
}

// -------------------------------------------------------------- browser glue

// Either package works: `puppeteer` bundles its own Chromium, `puppeteer-core`
// drives a Chrome already on the machine.
async function loadPuppeteer() {
  for (const pkg of ['puppeteer', 'puppeteer-core']) {
    try {
      const mod = await import(pkg);
      return { api: mod.default ?? mod, pkg };
    } catch { /* try the next one */ }
  }
  return null;
}

async function findSystemChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch { /* keep looking */ }
  }
  return null;
}

// ---------------------------------------------------------------------- main

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(HELP);
    return;
  }

  const root = resolve(HERE);
  const inputPath = resolve(root, opts.input);
  const outPath = resolve(root, opts.out);

  try {
    await access(inputPath, constants.R_OK);
  } catch {
    throw new Error(`Cannot read deck: ${inputPath}`);
  }

  const loaded = await loadPuppeteer();
  const systemChrome = await findSystemChrome();

  if (!loaded) {
    const hint = systemChrome
      ? `\nFound Chrome at ${systemChrome}. Install puppeteer-core to drive it:\n  npm i -D puppeteer-core\nor install the full package (downloads its own Chromium):\n  npm i -D puppeteer`
      : '\nInstall Puppeteer first:\n  npm i -D puppeteer';
    throw new Error(`Puppeteer is not installed.${hint}`);
  }

  const { api: puppeteer, pkg } = loaded;

  // puppeteer-core has no bundled browser, so it must be told where Chrome is.
  if (pkg === 'puppeteer-core' && !systemChrome) {
    throw new Error(
      'puppeteer-core is installed but no Chrome/Chromium was found.\n'
      + 'Set CHROME_PATH=/path/to/chrome, or install the full package: npm i -D puppeteer',
    );
  }

  await mkdir(dirname(outPath), { recursive: true });

  const server = await startServer(root, opts.port);
  const { port } = server.address();

  // reveal switches to its print layout when it sees `print-pdf` in the query
  // string, and gives each fragment its own page when pdfSeparateFragments is
  // true. It reads both from the URL, so no edit to index.html is needed.
  const relative = inputPath.slice(root.length).split(sep).join('/');
  const query = `print-pdf&pdfSeparateFragments=${opts.fragments}`;
  const url = `http://127.0.0.1:${port}${relative}?${query}`;

  const launchOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  };
  // Let full `puppeteer` use its own Chromium unless the user pinned CHROME_PATH.
  if (systemChrome && (pkg === 'puppeteer-core' || process.env.CHROME_PATH)) {
    launchOptions.executablePath = systemChrome;
  }

  let browser;
  try {
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    page.on('pageerror', (err) => console.warn('  page error:', err.message));

    console.log(`Loading ${relative}${opts.fragments ? ' (fragments expanded)' : ''} ...`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: opts.timeout });

    // Wait until reveal has actually laid out the print view, rather than
    // trusting a fixed sleep.
    // reveal marks the print layout on <html>, not <body>.
    await page.waitForFunction(
      () => document.querySelectorAll('.reveal .slides section').length > 0
        && document.documentElement.classList.contains('print-pdf'),
      { timeout: opts.timeout },
    ).catch(() => {
      console.warn('  reveal print-pdf layout not detected; exporting anyway');
    });

    // Let webfonts settle so code blocks measure correctly.
    await page.evaluate(() => document.fonts?.ready);

    const pages = await page.evaluate(
      () => document.querySelectorAll('.reveal .slides section').length,
    );
    console.log(`Rendering ${pages} slide${pages === 1 ? '' : 's'} ...`);

    await page.pdf({
      path: outPath,
      width: `${SLIDE_WIDTH}px`,
      height: `${SLIDE_HEIGHT}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: false,
      scale: opts.scale,
      timeout: opts.timeout,
    });

    const { size } = await stat(outPath);
    console.log(`\nWrote ${outPath} (${(size / 1024 / 1024).toFixed(1)} MB)`);
  } finally {
    await browser?.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(`\nExport failed: ${err.message}`);
  process.exitCode = 1;
});
