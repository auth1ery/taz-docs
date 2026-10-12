import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { renderDocs } from '../src/render.mjs';
import { findBrokenLinks } from '../tools/links.mjs';
import { contentDir, page } from './fixtures.mjs';

describe('findBrokenLinks', () => {
  it('finds nothing broken in the real docs', () => {
    assert.deepEqual(findBrokenLinks(renderDocs({ contentDir: path.join(import.meta.dirname, '..', 'content') })), []);
  });

  it('reports missing pages, missing anchors, anchors without an explicit id, and unknown site pages', () => {
    const dir = contentDir({
      'leveling.md': page('intro.\n\n## voice xp {#voice-xp}\n\n## setup\n\n[a](/docs/leveling#voice-xp) [b](#voice-xp) [c](/commands) [d](https://example.com)'),
      'fun.md': page('intro.\n\n[e](/docs/nope) [f](/docs/leveling#nope) [g](#setup) [h](/shop)', { title: 'fun', order: 2 })
    });
    assert.deepEqual(findBrokenLinks(renderDocs({ contentDir: dir })), [
      'content/fun.md: links to /docs/nope, but there\'s no /docs/nope page',
      'content/fun.md: links to /docs/leveling#nope, but leveling.md has no heading with {#nope}',
      'content/fun.md: links to #setup, but fun.md has no heading with {#setup}',
      'content/fun.md: links to /shop, which isn\'t a docs page or a known taz.bot page (tools/links.mjs lists those)'
    ]);
  });
});
