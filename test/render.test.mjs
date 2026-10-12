import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { DocsError, docsUrls, renderDocs } from '../src/render.mjs';
import { commandsSection, contentDir, page } from './fixtures.mjs';

const CONTENT = path.join(import.meta.dirname, '..', 'content');

function renderOne(body, fields) {
  const pages = renderDocs({ contentDir: contentDir({ 'leveling.md': page(body, fields) }) });
  return pages.find((p) => p.slug === 'leveling').html;
}

function problemsFor(body, fields) {
  try {
    renderOne(body, fields);
  } catch (error) {
    if (error instanceof DocsError) return error.problems.join('\n');
    throw error;
  }
  assert.fail('expected the build to fail');
}

describe('the real docs', () => {
  const pages = renderDocs({ contentDir: CONTENT });

  it('render the index first, then every page in frontmatter order', () => {
    assert.deepEqual(pages.map((p) => p.url), [
      '/docs', '/docs/moderation', '/docs/auto-moderation', '/docs/leveling', '/docs/tickets-and-tools',
      '/docs/fun', '/docs/customization', '/docs/announcements', '/docs/profile', '/docs/utilities'
    ]);
  });

  it('keep the nav, cta and footer as custom elements for the website to fill in', () => {
    for (const { slug, html } of pages) {
      for (const tag of ['x-nav', 'x-cta', 'x-footer']) assert.ok(html.includes(`<${tag}></${tag}>`), `${slug} ${tag}`);
      assert.ok(!html.includes('<nav') && !html.includes('<footer'), slug);
    }
  });

  it('give the sitemap an absolute url for every page', () => {
    const urls = docsUrls({ contentDir: CONTENT });
    assert.equal(urls.length, 10);
    assert.equal(urls[0], 'https://taz.bot/docs');
    assert.ok(urls.every((url) => url.startsWith('https://taz.bot/docs')));
  });

  it('build the index grid from every other page\'s frontmatter', () => {
    const index = pages[0].html;
    const cards = [...index.matchAll(/<a class="docs-index-card" href="([^"]+)">/g)].map((m) => m[1]);
    assert.deepEqual(cards, pages.slice(1).map((p) => p.url));
    assert.ok(index.includes('<div class="docs-index-card-title">tickets &amp; tools</div>'));
  });
});

describe('page shape', () => {
  it('uses the frontmatter for the head and the first paragraph as the hero intro', () => {
    const html = renderOne('every message earns **xp**.\n\n## for members\n\ntext.', { description: 'meta "text" & more' });
    assert.ok(html.includes('<title>leveling docs - taz</title>'));
    assert.ok(html.includes('<meta name="description" content="meta &quot;text&quot; &amp; more" />'));
    assert.ok(html.includes('"description": "meta \\"text\\" & more"'));
    assert.ok(html.includes('<link rel="canonical" href="https://taz.bot/docs/leveling" />'));
    assert.ok(html.includes('<p class="section-body">every message earns <strong>xp</strong>.</p>'));
    assert.ok(!commandsSection(html).includes('every message earns'));
  });

  it('keeps an explicit heading id and leaves the others for the website to fill in', () => {
    const html = renderOne('intro.\n\n## fake permissions {#fake-permissions}\n\n### for members\n\ntext.');
    assert.ok(html.includes('<h2 id="fake-permissions">fake permissions</h2>'));
    assert.ok(html.includes('<h3>for members</h3>'));
  });

  it('renders command entries with a code, plain-text or linked title', () => {
    const html = renderOne(`intro.

::: commands
- \`/level xpchannel set|remove|list\` - an xp multiplier - per channel.
- level-up message (dashboard only) - what's posted.
- [\`/me\`, \`/afk\`](/docs/profile) - your profile.
- \`/leaderboard\` (or \`/lb\`) - the top members.
:::`);
    const section = commandsSection(html);
    assert.ok(section.includes('<div class="docs-cmd-list">'));
    assert.ok(section.includes('<div class="docs-cmd"><code>/level xpchannel set|remove|list</code><div class="docs-cmd-desc">an xp multiplier - per channel.</div></div>'));
    assert.ok(section.includes('<div class="docs-cmd">level-up message (dashboard only)<div class="docs-cmd-desc">what\'s posted.</div></div>'));
    assert.ok(section.includes('<div class="docs-cmd"><a href="/docs/profile"><code>/me</code>, <code>/afk</code></a><div class="docs-cmd-desc">your profile.</div></div>'));
    assert.ok(section.includes('<div class="docs-cmd"><code>/leaderboard</code> (or <code>/lb</code>)<div class="docs-cmd-desc">the top members.</div></div>'));
  });

  it('renders a note with the info icon unless another kind is named', () => {
    const html = renderOne('intro.\n\n::: note\nplain.\n:::\n\n::: note warning\ncareful.\n:::');
    assert.ok(html.includes('<i class="fas fa-info-circle" aria-hidden="true"></i>\n<span>plain.</span>'));
    assert.ok(html.includes('<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>\n<span>careful.</span>'));
  });
});

describe('what contributors can\'t do', () => {
  it('shows raw html as text instead of rendering it', () => {
    const html = renderOne('intro <script>alert(1)</script>.\n\n<div onclick="x()">hi</div>\n\n- <img src=x onerror=alert(1)>');
    assert.ok(!html.includes('<script>alert'));
    assert.ok(!html.includes('<img'));
    assert.ok(!html.includes('<div onclick'));
    assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  });

  for (const href of ['javascript:alert(1)', 'data:text/html,hi', '//evil.example', 'mailto:a@b.c', 'ftp://example.com', 'docs/leveling']) {
    it(`fails the build on a link to ${href}`, () => {
      assert.match(problemsFor(`intro.\n\nsee [this](${href}).`), /isn't allowed/);
    });
  }

  it('allows https, site-relative and #anchor links', () => {
    const html = renderOne('intro.\n\n[a](https://discord.com/invite/x) [b](/docs/fun#birthdays) [c](#voice-xp)');
    assert.ok(html.includes('href="https://discord.com/invite/x"') && html.includes('href="/docs/fun#birthdays"') && html.includes('href="#voice-xp"'));
  });

  it('fails the build on images, quotes, code blocks, rules and other heading levels', () => {
    assert.match(problemsFor('intro.\n\n![x](https://example.com/x.png)'), /images aren't supported/);
    assert.match(problemsFor('intro.\n\n> quoted'), /a quote/);
    assert.match(problemsFor('intro.\n\n```\ncode\n```'), /code block/);
    assert.match(problemsFor('intro.\n\n***'), /horizontal rule/);
    assert.match(problemsFor('intro.\n\n# title'), /only ## and ###/);
    assert.match(problemsFor('intro.\n\n#### small'), /only ## and ###/);
  });

  it('fails the build on unknown blocks and note kinds', () => {
    assert.match(problemsFor('intro.\n\n::: tip\nhi\n:::'), /unknown block "::: tip"/);
    assert.match(problemsFor('intro.\n\n::: note danger\nhi\n:::'), /isn't a note type - use one of: info, warning/);
  });

  it('fails the build on a command entry without " - " or a note with more than one paragraph', () => {
    assert.match(problemsFor('intro.\n\n::: commands\n- `/rank` your card\n:::'), /needs " - " between the command and what it does/);
    assert.match(problemsFor('intro.\n\n::: commands\nnot a list\n:::'), /holds one list/);
    assert.match(problemsFor('intro.\n\n::: note\none.\n\ntwo.\n:::'), /single paragraph/);
  });

  it('fails the build on bad or repeated heading ids', () => {
    assert.match(problemsFor('intro.\n\n## a {#Bad_Id}'), /lowercase letters/);
    assert.match(problemsFor('intro.\n\n## a {#same}\n\n## b {#same}'), /two headings on this page have the id "same"/);
  });

  it('fails the build on missing or unknown frontmatter, and a body that doesn\'t open with a paragraph', () => {
    assert.match(problemsFor('intro.', { card: '' }), /frontmatter needs "card"/);
    assert.match(problemsFor('intro.', { colour: 'pink' }), /"colour" isn't a frontmatter field/);
    assert.match(problemsFor('intro.', { order: 'first' }), /order has to be a whole number/);
    assert.match(problemsFor('## heading first'), /has to start with a paragraph/);
  });

  it('points each problem at its file and line', () => {
    const problems = problemsFor('intro.\n\nfine.\n\nsee [x](javascript:alert(1)).');
    assert.match(problems, /leveling\.md:13: link "javascript:alert\(1\)"/);
  });
});
