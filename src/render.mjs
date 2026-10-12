import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { createMarkdown } from './markdown.mjs';
import { SITE_ORIGIN, contentPage, indexPage } from './template.mjs';

export { SITE_ORIGIN } from './template.mjs';
export { isAllowedHref } from './markdown.mjs';

const PAGE_FIELDS = ['title', 'description', 'order', 'icon', 'card'];
const INDEX_FIELDS = ['title', 'heading', 'description'];

export class DocsError extends Error {
  constructor(problems) {
    super(`the docs have ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n${problems.map((p) => `  ${p}`).join('\n')}`);
    this.problems = problems;
  }
}

export function urlFor(slug) {
  return slug === 'index' ? '/docs' : `/docs/${slug}`;
}

// Renders every page in contentDir. Returns [{ slug, url, html }], the index
// first and the rest in `order`; throws a DocsError listing every problem found.
export function renderDocs({ contentDir }) {
  const md = createMarkdown();
  const problems = [];
  const pages = loadPages(contentDir, md, problems);
  const index = pages.find((page) => page.slug === 'index');
  const rest = pages.filter((page) => page.slug !== 'index').sort((a, b) => a.data.order - b.data.order);

  if (!index) problems.push(`${path.join(contentDir, 'index.md')}: missing - it holds the docs landing page's hero text`);
  const orders = new Map();
  for (const page of rest) {
    const clash = orders.get(page.data.order);
    if (clash) problems.push(`${page.file}: order ${page.data.order} is also used by ${clash.file}`);
    orders.set(page.data.order, page);
  }
  if (problems.length) throw new DocsError(problems);

  const cards = rest.map((page) => ({ href: page.url, icon: page.data.icon, title: page.data.title, desc: page.data.card }));
  const rendered = [index, ...rest].map((page) => {
    const fields = { ...page.data, url: SITE_ORIGIN + page.url, intro: page.intro, body: page.body };
    const html = page.slug === 'index' ? indexPage({ ...fields, cards }) : contentPage(fields);
    return { slug: page.slug, url: page.url, html };
  });
  return rendered;
}

// just straight bullshit
export function docsUrls({ contentDir }) {
  return renderDocs({ contentDir }).map((page) => SITE_ORIGIN + page.url);
}

function loadPages(contentDir, md, problems) {
  const files = fs.readdirSync(contentDir).filter((name) => name.endsWith('.md')).sort();
  return files.map((name) => {
    const file = path.join(contentDir, name);
    const slug = name.slice(0, -3);
    const source = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
    const fail = (line, message) => problems.push(`${file}${line ? `:${line}` : ''}: ${message}`);

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(null, 'file names are lowercase words joined by dashes, like tickets-and-tools.md');

    const { data, body, bodyLine, errors } = parseFrontmatter(source);
    errors.forEach((e) => fail(e.line, e.message));
    checkFields(data, slug === 'index' ? INDEX_FIELDS : PAGE_FIELDS, (message) => fail(2, message));
    if ('order' in data) {
      if (/^\d+$/.test(data.order)) data.order = Number(data.order);
      else fail(2, `order has to be a whole number, not "${data.order}"`);
    }
    if (data.icon && !/^fa-[a-z0-9]+(-[a-z0-9]+)*$/.test(data.icon)) fail(2, `icon has to be a Font Awesome 5 class like fa-star, not "${data.icon}"`);

    const env = { errors: [], ids: new Set(), noteStyle: slug === 'index' ? 'margin-bottom: 2rem;' : null };
    const tokens = md.parse(body, env);
    const toFileLine = (line) => (line ? line + bodyLine - 1 : null);
    env.errors.forEach((e) => fail(toFileLine(e.line), e.message));

    let intro = '';
    if (tokens[0]?.type === 'paragraph_open') {
      intro = md.renderer.renderInline(tokens[1].children, md.options, env);
      tokens.splice(0, 3);
    } else {
      fail(bodyLine, 'the text after the frontmatter has to start with a paragraph - it becomes the intro under the page title');
    }

    return { file, slug, url: urlFor(slug), data, intro, body: md.renderer.render(tokens, md.options, env) };
  });
}

function checkFields(data, fields, fail) {
  for (const field of fields) {
    if (!data[field]) fail(`frontmatter needs "${field}"`);
  }
  for (const key of Object.keys(data)) {
    if (!fields.includes(key)) fail(`"${key}" isn't a frontmatter field here - the fields are ${fields.join(', ')}`);
  }
}
