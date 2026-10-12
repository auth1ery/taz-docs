# taz docs

the docs for [taz](https://taz.bot), the discord bot - everything you see on
[taz.bot/docs](https://taz.bot/docs). every page is a markdown file in
[`content/`](content/), so if something's wrong, out of date or just confusing,
you can fix it yourself :>

## fixing something

1. find the page in `content/` - `leveling.md` is
   [taz.bot/docs/leveling](https://taz.bot/docs/leveling), and `index.md` is the
   landing page.
2. edit it. [CONTRIBUTING.md](CONTRIBUTING.md) has the voice and every building
   block (command lists, notes, heading ids), with examples.
3. open a pull request against the `staging` branch.

small fixes are generally fine straight from github's editor. for anything bigger,
check it locally first. 

## previewing locally

you'll need [node.js](https://nodejs.org) 22 or newer.

```sh
npm install
npm run preview
```

then open <http://localhost:4321/docs>. the preview wraps the pages in the
site's real nav, footer, stylesheet and scripts - the first run grabs those from
taz.bot and keeps them in `.cache/`. `npm run preview -- --refresh` grabs them
again, so do that if the site's changed since.

other commands:

- `npm run build` writes the finished pages to `out/docs/`.
- `npm test` runs the tests.
- `npm run check-links` makes sure every link between pages, and every
  `#anchor`, points at something real.

if a page uses something the docs don't support - raw html, an image, an
unknown block, or a link that isn't `https://`, a site path like
`/docs/leveling`, or `#an-anchor` - the build fails and tells you where.

## how a change gets onto taz.bot

pull requests go to the `staging` branch. i review every one before it's
merged, and CI runs the tests, the build and the link check on each one.
`staging` goes to `main` together with taz and the website whenever a version
of taz comes out, and taz.bot builds its docs from this repo, so a merged
change goes live with the next release.

## what's in here

- `content/` - the pages, one markdown file each.
- `src/render.mjs` - turns `content/` into the site's html. the website imports
  it.
- `tools/` - the build, preview and link-check scripts, plus a copy of the
  website's `docsIndex.mjs`, which gives headings their ids and builds the
  search index.
- `test/` - tests for all of the above.

## license

the docs in `content/` are [CC BY 4.0](content/LICENSE), and the renderer and
tooling are [MIT](LICENSE).
