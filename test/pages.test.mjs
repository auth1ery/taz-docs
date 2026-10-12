import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { renderDocs } from '../src/render.mjs';
import { indexDocsPage } from '../tools/docsIndex.mjs';
import { commandsSection } from './fixtures.mjs';

const pages = renderDocs({ contentDir: path.join(import.meta.dirname, '..', 'content') }).filter((p) => p.slug !== 'index');

// The website's search indexes a page's intro plus one entry per h2/h3 in its
// commands section, so a page with no heading there would be one blob.
describe('every real page indexes more than one section', () => {
  it('has an intro and at least one heading in its commands section', () => {
    for (const { slug, html } of pages) {
      assert.match(html, /<p class="section-body">[^<\s][\s\S]*?<\/p>/, slug);
      assert.match(commandsSection(html), /<h[23][\s>]/, slug);
    }
  });

  it('gets more than one search entry from docsIndex.mjs', () => {
    for (const { slug, url, html } of pages) {
      assert.ok(indexDocsPage(html, url).entries.length > 1, slug);
    }
  });
});
