# Contributing

Thank you for contributing!!! this is the general rules for writing and updating the docs :>

## where to send changes

open pull requests against the `staging` branch, not `main`. new docs land on
`staging` alongside the matching changes to taz and the website, and go live on
taz.bot once `staging` is merged into `main`. so the docs always match the taz
people are actually running.

if you're writing about something that's out right now, `staging` is still the
right place - it goes live the next time `staging` is merged into `main`.

## the voice

read a page or two before you write anything, and try to sound like them:

- **lowercase.** sentences and headings start lowercase. names keep their
  capitals where discord shows them that way - Manage Server, Administrator,
  View Audit Log.
- **casual and dry.** write it like you're explaining it to a friend who runs a
  server. a joke's fine. hype isn't - no "simply", "easily" or
  "powerful".
- **"us" for us, "she" for taz.** "if a bot is missing that you'd like taz to
  read, tell us." "taz warns you whenever a level role is one she can't grant."
- **say why.** if something works in a way that'd surprise someone, give the
  reason right there: "times are UTC, deliberately - a server with staff in four
  countries shouldn't have its announcements shift around."
- **free vs. taz plus.** if it depends on the plan, just say so: "free servers
  get 3, taz plus is unlimited."

## name what people can see

the docs are for server admins, so talk about the things they actually touch:
commands, options, dashboard pages, buttons and toggles.

- yes: `/level voicexp rules`, "the dashboard's leveling page, under voice xp",
  the `unit:` option
- no: discord developer words (intents, interactions, webhooks, the gateway).
  say what it means for the server instead.
- no: guesses at how taz does something behind the scenes. if you noticed new
  uploads show up a few minutes late, write "expect a few minutes' delay", not
  your theory about why.

## the building blocks

every page is a markdown file in `content/`. raw html doesn't work (it just
shows up as text), so it's all plain markdown plus two `:::` blocks.

### frontmatter

every page starts with this:

```md
---
title: leveling
description: every message earns xp, level roles unlock automatically, and boosters climb faster - rank cards are visual, not just a number.
order: 3
icon: fa-star
card: xp, level roles, booster bonuses, channels that cost xp, voice xp, prestige, decay, and rank cards.
---
```

- `title` - the page title, the breadcrumb and the browser tab.
- `description` - what google and link previews show. one sentence.
- `order`, `icon`, `card` - the page's card on the docs landing page: where it
  sits, a [font awesome 5](https://fontawesome.com/v5/search?m=free) icon, and a
  one-line summary.

`index.md` (the landing page) has `title`, `heading` and `description`
instead. its cards come from the other pages.

### the intro

the first paragraph after the frontmatter is the intro under the page title.
every page needs one.

### headings

`##` for sections, `###` for bits inside them. the page title is the only `#`,
and that comes from the frontmatter.

if a section might get linked to, give it an id:

```md
## voice xp {#voice-xp}
```

that makes it `taz.bot/docs/leveling#voice-xp`, and the link keeps working even
if the heading gets reworded later. ids are lowercase words joined by dashes.
**please never change or remove an id that's already there** - other pages (and
people out in the world) link to them. if you really think one has to go, search
`content/` for `#the-id` first and tell me in the pull request.

### command lists

commands and settings go in a `::: commands` block. each item is the command,
then ` - `, then what it does:

```md
::: commands
- `/rank` - your level, rank, and progress to next level, rendered as an image card.
- `/leaderboard` (or `/lb`) - the server's top members by level/xp.
- `/level xpchannel set|remove|list` - an xp multiplier for a specific channel.
:::
```

the first ` - ` outside of backticks and links is where the name ends, so the
description can have dashes of its own. the name doesn't have to be code - it
can be plain text or a link too:

```md
::: commands
- level-up message (dashboard only) - customize what's posted on level-up.
- [welcome & leave messages](/docs/customization#welcome-leave) - posted when someone joins or leaves.
:::
```

write options the way discord shows them (`/ban target: reason: duration:
unit:`), and use `|` between subcommands.

### notes

a note is the highlighted box, for the thing people miss or get wrong:

```md
::: note
importing doesn't hand out level roles on its own. run `/level syncroles` afterwards.
:::
```

a note is one paragraph, and it gets the info icon unless you pick another kind
after `note`:

| kind | icon | for |
|---|---|---|
| `info` (default) | circled i | most notes |
| `warning` | triangle | a permission or delay that'll trip people up |
| `check` | circled tick | a safeguard that's already there |
| `clock` | clock | timing and timezones |
| `undo` | undo arrow | how to take something back |
| `shield` | user with a shield | who's allowed to use something |

```md
::: note warning
taz needs permission to send messages in the channel you pick.
:::
```

### everything else

- `**bold**` for a button, toggle or option someone's looking for (the
  **Levels** logging toggle). `*italics*` for stress.
- `` `code` `` for anything you type into discord: commands, options, values,
  placeholders like `{user}`.
- normal bullet lists (`-`) for anything that isn't a command list.
- links: `[text](/docs/leveling#voice-xp)` for another docs page,
  `[text](#voice-xp)` for the same page, `[text](https://...)` for anywhere
  else. only link to a heading through its `{#id}`.

the build fails (and tells you the file and line) on anything else: raw html,
images, quotes, code blocks, tables, horizontal rules, and headings that aren't
`##` or `###`.

## what i check

i read every pull request before it goes in, and look for:

- **if it's true.** the command exists, takes those options, and does what you
  said in the current version of taz. not sure? say so in the pull request and
  i'll check.
- **it sounds like the rest.** lowercase, plain, talks about what admins see.
- **links and ids still work.** CI runs the build, the tests and the link check
  for you. existing ids stay put.
- **it's in the right place.** a command lives on its module's page. other
  pages link to it instead of repeating it.

have a look at your change with `npm run preview` before opening the pull
request (the [README](README.md) has the details).

by contributing, you're agreeing that your changes to `content/` are under
[CC BY 4.0](content/LICENSE), and changes to everything else are under
[MIT](LICENSE).
