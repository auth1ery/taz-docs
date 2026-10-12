// Builds the docs and serves them roughly the way taz.bot does: partials
// inlined, the site's stylesheet and scripts, and docs search.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { DocsError } from '../src/render.mjs';
import { ROOT, build } from './build.mjs';
import { indexDocsPage } from './docsIndex.mjs';

const SITE = 'https://taz.bot';
const CACHE_DIR = path.join(ROOT, '.cache', 'site');
const PREVIEW_DIR = path.join(ROOT, 'out', 'preview');
const PORT = Number(process.env.PORT) || 4321;
const ASSETS = {
  css: 'styles/main.css',
  themeToggle: 'js/theme-toggle.js',
  docsSearch: 'js/docsSearch.js',
  nav: 'partials/nav.html',
  cta: 'partials/cta.html',
  footer: 'partials/footer.html'
};

function readAssets(dir) {
  const found = {};
  for (const [name, file] of Object.entries(ASSETS)) {
    const full = path.join(dir, file);
    if (fs.existsSync(full)) found[name] = fs.readFileSync(full, 'utf8');
  }
  return found;
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return response.text();
}

// taz.bot only serves finished pages with hashed asset names, so the
// partials are cut back out of a live page and the asset names read from it.
async function fetchAssets() {
  const page = await fetchText(`${SITE}/docs`);
  const found = {};
  const between = (start, end) => {
    const from = page.indexOf(start);
    const to = page.indexOf(end, from);
    return from === -1 || to === -1 ? null : page.slice(from, to + (end.startsWith('<section') ? 0 : end.length));
  };
  found.nav = between('<nav', '<section class="cmd-page-hero');
  found.cta = between('<section class="cta', '</section>');
  found.footer = between('<footer', '</footer>');
  const assetUrl = (pattern) => page.match(pattern)?.[1];
  for (const [name, pattern] of [['css', /href="(\/styles\/main[^"]*\.css)"/], ['themeToggle', /src="(\/js\/theme-toggle[^"]*\.js)"/], ['docsSearch', /src="(\/js\/docsSearch[^"]*\.js)"/]]) {
    const url = assetUrl(pattern);
    if (url) found[name] = await fetchText(SITE + url);
  }

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  for (const [name, text] of Object.entries(found)) {
    if (!text) continue;
    const file = path.join(CACHE_DIR, ASSETS[name]);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  }
  return readAssets(CACHE_DIR);
}

async function loadAssets(refresh) {
  if (refresh) fs.rmSync(CACHE_DIR, { recursive: true, force: true });
  const assets = readAssets(CACHE_DIR);
  if (assets.css) return assets;
  console.log(`fetching the site's stylesheet, scripts and partials from ${SITE} (cached in .cache/site/)...`);
  return fetchAssets();
}

function writePreview(pages, assets) {
  fs.rmSync(PREVIEW_DIR, { recursive: true, force: true });
  const write = (file, text) => {
    const full = path.join(PREVIEW_DIR, file);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, text);
  };

  const searchIndex = [];
  for (const page of pages) {
    const indexed = indexDocsPage(page.html, page.url);
    searchIndex.push(...indexed.entries);
    const html = indexed.html
      .replace('<x-nav></x-nav>', () => assets.nav || '')
      .replace('<x-cta></x-cta>', () => assets.cta || '')
      .replace('<x-footer></x-footer>', () => assets.footer || '');
    write(`docs/${page.slug}.html`, html);
  }
  write('docs/search-index.json', JSON.stringify(searchIndex));
  if (assets.css) write(ASSETS.css, assets.css);
  if (assets.themeToggle) write(ASSETS.themeToggle, assets.themeToggle);
  if (assets.docsSearch) write(ASSETS.docsSearch, assets.docsSearch);
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };

function serve() {
  const server = http.createServer((request, response) => {
    const { pathname } = new URL(request.url, 'http://localhost');
    let file = path.normalize(path.join(PREVIEW_DIR, decodeURIComponent(pathname)));
    if (pathname === '/') {
      response.writeHead(302, { location: '/docs' }).end();
      return;
    }
    if (pathname === '/docs' || pathname === '/docs/') file = path.join(PREVIEW_DIR, 'docs', 'index.html');
    else if (!path.extname(file)) file += '.html';

    if (!file.startsWith(PREVIEW_DIR) || !fs.existsSync(file)) {
      response.writeHead(404, { 'content-type': TYPES['.html'] });
      response.end(`<p>${pathname.replace(/[<>&"]/g, '')} isn't part of the docs preview - on the live site it's <a href="${SITE}${encodeURI(pathname)}">${SITE}${pathname.replace(/[<>&"]/g, '')}</a>.</p><p><a href="/docs">back to the docs</a></p>`);
      return;
    }
    response.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(file).pipe(response);
  });
  server.listen(PORT, () => console.log(`\npreview running at http://localhost:${PORT}/docs - ctrl+c to stop`));
}

try {
  const pages = build();
  const assets = await loadAssets(process.argv.includes('--refresh'));
  writePreview(pages, assets);

  console.log(`built ${pages.length} pages; site assets from ${SITE}, cached in .cache/site/ ("npm run preview -- --refresh" fetches them again)`);
  const missing = Object.keys(ASSETS).filter((name) => !assets[name]);
  if (missing.length) console.log(`taz.bot doesn't serve these yet, so they're left out: ${missing.map((m) => ASSETS[m]).join(', ')}`);
  if (!process.argv.includes('--no-serve')) serve();
} catch (error) {
  if (!(error instanceof DocsError)) throw error;
  console.error(error.message);
  process.exitCode = 1;
}
// i hate my life