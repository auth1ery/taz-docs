const SECTION_TEXT_LIMIT = 1500;

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };

export function htmlToText(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#?\w+);/g, (match, name) => {
      if (ENTITIES[name]) return ENTITIES[name];
      if (name.startsWith('#x')) return String.fromCodePoint(Number.parseInt(name.slice(2), 16));
      if (name.startsWith('#')) return String.fromCodePoint(Number(name.slice(1)));
      return match;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
}

const HEADING = /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi;

// Returns the page's HTML with an id on every h2/h3, and its search entries.
export function indexDocsPage(html, url) {
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const pageTitle = titleMatch ? htmlToText(titleMatch[1]) : url;
  const introMatch = html.match(/<p class="section-body">([\s\S]*?)<\/p>/i);

  const usedIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  const withIds = html.replace(HEADING, (match, tag, attrs, inner) => {
    const existing = attrs.match(/\bid="([^"]+)"/);
    let id = existing?.[1];
    if (!id) {
      const base = slugify(htmlToText(inner));
      id = base;
      for (let n = 2; usedIds.has(id); n += 1) id = `${base}-${n}`;
      usedIds.add(id);
    }
    return existing ? match : `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });

  const entries = [];
  if (introMatch) {
    entries.push({ url, pageTitle, heading: null, anchor: null, text: htmlToText(introMatch[1]) });
  }

  // Each section is everything from its heading to the next one (or the end of
  // the page's content).
  const body = withIds.slice(withIds.search(/<section class="commands-page/i));
  const contentEnd = body.search(/<x-cta>|<x-footer>|<script/i);
  const content = contentEnd >= 0 ? body.slice(0, contentEnd) : body;
  const parts = content.split(/(?=<h[23][^>]*>)/i);
  for (const part of parts) {
    const headingMatch = part.match(/^<h[23]([^>]*)>([\s\S]*?)<\/h[23]>/i);
    if (!headingMatch) continue;
    const anchor = headingMatch[1].match(/\bid="([^"]+)"/)[1];
    const text = htmlToText(part.slice(headingMatch[0].length));
    entries.push({ url, pageTitle, heading: htmlToText(headingMatch[2]), anchor, text: text.slice(0, SECTION_TEXT_LIMIT) });
  }

  return { html: withIds, entries };
}
