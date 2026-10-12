import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DocsError, renderDocs } from '../src/render.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const CONTENT_DIR = path.join(ROOT, 'content');
export const OUT_DIR = path.join(ROOT, 'out', 'docs');

export function build() {
  const pages = renderDocs({ contentDir: CONTENT_DIR });
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const page of pages) fs.writeFileSync(path.join(OUT_DIR, `${page.slug}.html`), page.html);
  return pages;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const pages = build();
    console.log(`built ${pages.length} pages into ${path.relative(ROOT, OUT_DIR)}`);
  } catch (error) {
    if (!(error instanceof DocsError)) throw error;
    console.error(error.message);
    process.exitCode = 1;
  }
}
