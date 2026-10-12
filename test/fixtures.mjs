import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const INDEX = `---
title: documentation
heading: how taz actually works
description: the docs.
---

the intro.
`;

export function page(body, fields = {}) {
  const data = { title: 'leveling', description: 'xp and levels.', order: 1, icon: 'fa-star', card: 'xp.', ...fields };
  return `---\n${Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n')}\n---\n\n${body}\n`;
}

// A throwaway content folder holding index.md plus the given { 'slug.md': source }.
export function contentDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'taz-docs-'));
  fs.writeFileSync(path.join(dir, 'index.md'), INDEX);
  for (const [name, source] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), source);
  return dir;
}

export function commandsSection(html) {
  return html.slice(html.indexOf('<section class="commands-page'), html.indexOf('<x-cta>'));
}
