import { DocsError, renderDocs } from '../src/render.mjs';
import { CONTENT_DIR } from './build.mjs';
import { findBrokenLinks } from './links.mjs';

try {
  const broken = findBrokenLinks(renderDocs({ contentDir: CONTENT_DIR }));
  if (broken.length) {
    console.error(`${broken.length} broken link${broken.length === 1 ? '' : 's'}:\n${broken.map((b) => `  ${b}`).join('\n')}`);
    process.exitCode = 1;
  } else {
    console.log('every internal link and #anchor points at something that exists');
  }
} catch (error) {
  if (!(error instanceof DocsError)) throw error;
  console.error(error.message);
  process.exitCode = 1;
}
