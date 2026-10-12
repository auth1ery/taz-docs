export const SITE_PATHS = ['/', '/commands', '/dashboard', '/invite', '/plus', '/roadmap', '/status'];

function bodyLinks(html) {
  const body = html.slice(html.indexOf('<body>'));
  return [...body.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
}

function ids(html) {
  return new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
}

export function findBrokenLinks(pages) {
  const byUrl = new Map(pages.map((page) => [page.url, { page, ids: ids(page.html) }]));
  const broken = [];
  for (const page of pages) {
    for (const href of bodyLinks(page.html)) {
      if (/^https?:\/\//i.test(href)) continue;
      const [pathPart, anchor] = href.split('#');
      const targetUrl = pathPart || page.url;
      const target = byUrl.get(targetUrl);
      const where = `content/${page.slug}.md`;

      if (targetUrl.startsWith('/docs')) {
        if (!target) broken.push(`${where}: links to ${href}, but there's no ${targetUrl} page`);
        else if (anchor !== undefined && !target.ids.has(anchor)) {
          broken.push(`${where}: links to ${href}, but ${target.page.slug}.md has no heading with {#${anchor}}`);
        }
      } else if (!SITE_PATHS.includes(pathPart.split('?')[0])) {
        broken.push(`${where}: links to ${href}, which isn't a docs page or a known taz.bot page (tools/links.mjs lists those)`);
      }
    }
  }
  return broken;
}
