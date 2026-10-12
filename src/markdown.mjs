import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';

export const NOTE_ICONS = {
  info: 'fa-info-circle',
  warning: 'fa-exclamation-triangle',
  check: 'fa-check-circle',
  clock: 'fa-clock',
  undo: 'fa-undo-alt',
  shield: 'fa-user-shield'
};

const ALLOWED_BLOCKS = new Set([
  'paragraph_open', 'paragraph_close', 'inline',
  'heading_open', 'heading_close',
  'bullet_list_open', 'bullet_list_close', 'ordered_list_open', 'ordered_list_close',
  'list_item_open', 'list_item_close'
]);

const ALLOWED_INLINE = new Set([
  'text', 'code_inline', 'softbreak', 'hardbreak',
  'strong_open', 'strong_close', 'em_open', 'em_close', 'link_open', 'link_close'
]);

const BLOCK_NAMES = {
  blockquote_open: 'a quote (lines starting with >)',
  code_block: 'an indented code block',
  fence: 'a ``` code block',
  hr: 'a horizontal rule (---)'
};

const HEADING_ID = /\s*\{#([^}]*)\}\s*$/;
const VALID_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isAllowedHref(href) {
  return /^https?:\/\/[^\s]+$/i.test(href) || /^\/(?!\/)\S*$/.test(href) || /^#[a-z0-9-]+$/.test(href);
}

export function createMarkdown() {
  const md = new MarkdownIt('commonmark', { html: false });
  md.validateLink = () => true;
  md.use(container, 'block', { validate: () => true });
  md.core.ruler.push('taz_docs', (state) => {
    checkInline(state);
    state.tokens = restructure(state);
  });

  md.renderer.rules.docs_cmd_list_open = () => '<div class="docs-cmd-list">\n';
  md.renderer.rules.docs_cmd_list_close = () => '</div>\n';
  md.renderer.rules.docs_cmd = (tokens, idx, options, env, self) => {
    const { title, desc } = tokens[idx].meta;
    return `<div class="docs-cmd">${self.renderInline(title, options, env)}<div class="docs-cmd-desc">${self.renderInline(desc, options, env)}</div></div>\n`;
  };
  md.renderer.rules.docs_note = (tokens, idx, options, env, self) => {
    const { icon, children } = tokens[idx].meta;
    const style = env.noteStyle ? ` style="${env.noteStyle}"` : '';
    return `<div class="docs-note"${style}>\n<i class="fas ${icon}" aria-hidden="true"></i>\n<span>${self.renderInline(children, options, env)}</span>\n</div>\n`;
  };
  return md;
}

function report(state, token, message) {
  state.env.errors.push({ line: token?.map ? token.map[0] + 1 : null, message });
}

function checkInline(state) {
  for (const block of state.tokens) {
    if (block.type !== 'inline') continue;
    for (const token of block.children) {
      if (token.type === 'image') {
        report(state, block, 'images aren\'t supported in the docs');
      } else if (!ALLOWED_INLINE.has(token.type)) {
        report(state, block, `"${token.markup || token.type}" isn't supported here`);
      } else if (token.type === 'link_open' && !isAllowedHref(token.attrGet('href'))) {
        report(state, block, `link "${token.attrGet('href')}" isn't allowed - use https://..., a site path like /docs/leveling, or #an-anchor`);
      }
    }
  }
}

function restructure(state) {
  const { tokens } = state;
  const out = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    if (token.type === 'container_block_open') {
      const close = findClose(tokens, i);
      if (token.level > 0) report(state, token, '::: blocks can\'t go inside a list or another ::: block');
      else out.push(...containerTokens(state, token, tokens.slice(i + 1, close)));
      i = close;
      continue;
    }

    if (!ALLOWED_BLOCKS.has(token.type)) {
      if (!token.type.endsWith('_close')) report(state, token, `${BLOCK_NAMES[token.type] || token.type} isn't supported in the docs`);
      continue;
    }

    if (token.type === 'heading_open') checkHeading(state, token, tokens[i + 1]);
    out.push(token);
  }
  return out;
}

function findClose(tokens, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < tokens.length; i += 1) {
    if (tokens[i].type === 'container_block_open') depth += 1;
    if (tokens[i].type === 'container_block_close') depth -= 1;
    if (depth === 0) return i;
  }
  return tokens.length - 1;
}

function checkHeading(state, open, inline) {
  if (open.tag !== 'h2' && open.tag !== 'h3') {
    report(state, open, `only ## and ### headings are used in the docs (the page title comes from the frontmatter), not ${open.markup}`);
    return;
  }
  const last = inline.children[inline.children.length - 1];
  const match = last?.type === 'text' && last.content.match(HEADING_ID);
  if (!match) return;
  const id = match[1];
  if (!VALID_ID.test(id)) {
    report(state, open, `heading id "{#${id}}" can only use lowercase letters, digits and single dashes`);
    return;
  }
  if (state.env.ids.has(id)) report(state, open, `two headings on this page have the id "${id}"`);
  state.env.ids.add(id);
  open.attrSet('id', id);
  last.content = last.content.slice(0, match.index);
  if (!last.content) inline.children.pop();
}

function containerTokens(state, open, inner) {
  const [kind, ...args] = open.info.trim().split(/\s+/);
  if (kind === 'commands' && args.length === 0) return commandTokens(state, open, inner);
  if (kind === 'note' && args.length <= 1) return noteTokens(state, open, inner, args[0] || 'info');
  report(state, open, `unknown block "::: ${open.info.trim()}" - the blocks are "::: commands" and "::: note" (optionally "::: note warning" and so on)`);
  return [];
}

function commandTokens(state, open, inner) {
  const items = [];
  const shapeError = () => report(state, open, 'a ::: commands block holds one list, where each item is "`/command` - what it does"');
  if (inner[0]?.type !== 'bullet_list_open' || inner[inner.length - 1]?.type !== 'bullet_list_close') {
    shapeError();
    return [];
  }
  for (let i = 1; i < inner.length - 1; i += 5) {
    const [itemOpen, paraOpen, inline, paraClose, itemClose] = inner.slice(i, i + 5);
    if (itemOpen?.type !== 'list_item_open' || paraOpen?.type !== 'paragraph_open' || inline?.type !== 'inline'
      || paraClose?.type !== 'paragraph_close' || itemClose?.type !== 'list_item_close') {
      shapeError();
      return [];
    }
    const split = splitCommand(inline.children);
    if (!split) {
      report(state, itemOpen, `"${inline.content}" needs " - " between the command and what it does`);
      continue;
    }
    const token = new state.Token('docs_cmd', 'div', 0);
    token.map = itemOpen.map;
    token.meta = split;
    items.push(token);
  }

  const listOpen = new state.Token('docs_cmd_list_open', 'div', 1);
  const listClose = new state.Token('docs_cmd_list_close', 'div', -1);
  return [listOpen, ...items, listClose];
}

// do NOT sell maraujhana to my husband
function splitCommand(children) {
  let linkDepth = 0;
  for (let i = 0; i < children.length; i += 1) {
    const token = children[i];
    if (token.type === 'link_open') linkDepth += 1;
    if (token.type === 'link_close') linkDepth -= 1;
    if (token.type !== 'text' || linkDepth > 0) continue;
    const at = token.content.indexOf(' - ');
    if (at === -1) continue;

    const title = children.slice(0, i);
    const desc = children.slice(i + 1);
    const before = token.content.slice(0, at).trimEnd();
    const after = token.content.slice(at + 3).trimStart();
    if (before) title.push(textLike(token, before));
    if (after) desc.unshift(textLike(token, after));
    if (!title.length || !desc.length) return null;
    return { title, desc };
  }
  return null;
}

function textLike(token, content) {
  const copy = Object.assign(Object.create(Object.getPrototypeOf(token)), token);
  copy.content = content;
  return copy;
}

function noteTokens(state, open, inner, kind) {
  if (!NOTE_ICONS[kind]) {
    report(state, open, `"::: note ${kind}" isn't a note type - use one of: ${Object.keys(NOTE_ICONS).join(', ')}`);
    return [];
  }
  if (inner.length !== 3 || inner[0].type !== 'paragraph_open' || inner[1].type !== 'inline') {
    report(state, open, 'a ::: note holds a single paragraph - no lists, headings or blank lines inside it');
    return [];
  }
  const token = new state.Token('docs_note', 'div', 0);
  token.map = open.map;
  token.meta = { icon: NOTE_ICONS[kind], children: inner[1].children };
  return [token];
}
