export const SITE_ORIGIN = 'https://taz.bot';
const IMAGE = 'https://cdn.tazldied.com/images/taz/taz-sitting.png';

export function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// JSON-LD sits inside a <script>, so a "<" in a description could end it early.
function jsonString(text) {
  return JSON.stringify(text).replace(/</g, '\\u003c');
}
// dont evne trip dawg
function head({ title, description, url }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t}</title>
  <meta name="description" content="${d}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="taz" />
  <meta property="og:title" content="${t}" />
  <meta property="og:description" content="${d}" />
  <meta property="og:image" content="${IMAGE}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${t}" />
  <meta name="twitter:description" content="${d}" />
  <meta name="twitter:image" content="${IMAGE}" />
  <meta name="theme-color" content="#e05585" />
  <link rel="icon" href="https://cdn.tazldied.com/images/taz/favicon.ico">
  <link rel="canonical" href="${url}" />
  <meta property="og:url" content="${url}" />
  <script>
    (function () {
      var stored = localStorage.getItem('theme');
      var dark = stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    })();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles/main.css" />
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": ${jsonString(title)},
  "description": ${jsonString(description)},
  "url": "${url}",
  "image": "${IMAGE}",
  "author": {
    "@type": "Organization",
    "name": "taz",
    "url": "https://taz.bot/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "taz",
    "url": "https://taz.bot/"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "${url}"
  }
}
  </script>
</head>
<body>

<x-nav></x-nav>
`;
}

const SEARCH = `    <div class="docs-search" role="search">
      <i class="fas fa-search docs-search-icon" aria-hidden="true"></i>
      <input type="search" class="docs-search-input" placeholder="search the docs (press /)" aria-label="search the docs" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="docs-search-results" />
      <div class="docs-search-results" id="docs-search-results" role="listbox" hidden></div>
    </div>`;

const TAIL = `
<x-cta></x-cta>

<x-footer></x-footer>

<script src="/js/theme-toggle.js"></script>
<script src="/js/docsSearch.js"></script>
<script>
  const revealEls = document.querySelectorAll('.reveal');
  // A threshold is a fraction of the element, which a section taller than the
  // screen may never reach; a margin works at any height.
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  revealEls.forEach(el => observer.observe(el));
</script>

</body>
</html>
`;

export function contentPage({ title, description, url, intro, body }) {
  return `${head({ title: `${title} docs - taz`, description, url })}
<section class="cmd-page-hero reveal">
  <div class="cmd-page-hero-inner">
    <p class="docs-breadcrumb"><a href="/docs">documentation</a> / ${escapeHtml(title)}</p>
    <h1 class="section-title">${escapeHtml(title)}</h1>
    <p class="section-body">${intro}</p>
${SEARCH}
  </div>
</section>

<section class="commands-page reveal">
  <div class="commands-inner docs-prose">
${body}  </div>
</section>
${TAIL}`;
}

export function indexPage({ title, heading, description, url, intro, body, cards }) {
  const grid = cards.map((card) => `      <a class="docs-index-card" href="${card.href}">
        <i class="fas ${card.icon}" aria-hidden="true"></i>
        <div class="docs-index-card-title">${escapeHtml(card.title)}</div>
        <div class="docs-index-card-desc">${escapeHtml(card.desc)}</div>
      </a>
`).join('');

  return `${head({ title: `${title} - taz`, description, url })}
<section class="cmd-page-hero reveal">
  <div class="cmd-page-hero-inner">
    <p class="section-label">${escapeHtml(title)}</p>
    <h1 class="section-title">${escapeHtml(heading)}</h1>
    <p class="section-body">${intro}</p>
${SEARCH}
  </div>
</section>

<section class="commands-page reveal">
  <div class="commands-inner">
${body}    <div class="docs-index-grid">
${grid}    </div>
  </div>
</section>
${TAIL}`;
}
