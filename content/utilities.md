---
title: utilities
description: the small stuff - browsing commands, looking up a member or the server, ticket transcripts, and posting an embed you built on the dashboard.
order: 9
icon: fa-toolbox
card: /help, member and server lookups, ticket transcripts, posting an embed you built on the dashboard, vc stats, and analytics.
---

the small stuff that doesn't belong to a module - browsing commands, looking someone up, pulling a ticket transcript back, posting an embed you built on the dashboard, vc stats, and analytics.

## lookups {#lookups}

::: commands
- `/help` - browse every command taz has, by category, without leaving discord. posted publicly rather than just to you, so it's useful to point someone at - the dropdowns only respond to whoever ran it, and stop after five minutes.
- `/whois user:` - a member's ID, when their account was made, when they joined this server, their nickname, badges, roles, and how long they've been boosting. defaults to you. works on someone who isn't in the server, too - it just says so.
- `/serverinfo` - a snapshot of the server: owner, creation date, member count, boost tier and count, roles, and how many text and voice channels there are.
- `/info` - taz's own version and uptime, and how many servers and users she's currently across.
- `/misc ping` - latency, for when she feels slow and you want to know whether it's her or discord.
:::

all five are open to everyone - no permission or setup needed.

## ticket transcripts {#transcripts}

a closed ticket's messages are saved as a transcript. this is how you get one back afterwards, rather than digging through an archive category.

::: commands
- `/transcripts mine` - your own saved transcripts. anyone can run this on themselves.
- `/transcripts user target:` - a specific member's transcripts. staff only.
- `/transcripts all` - every member who has a saved transcript. staff only.
:::

ticket panels themselves are set up under [tickets & tools](/docs/tickets-and-tools).

## standalone embeds {#embed}

build an embed on the dashboard's embeds page - title, color, image, fields, footer, the lot - give it a short key, and post it into any channel whenever you want. rules posts, info panels, anything you'd otherwise be rebuilding by hand each time.

::: commands
- `/embed post key: channel:` - posts a saved embed. `key` autocompletes from what you've built, and `channel` defaults to the one you're in.
:::

::: note
the embed itself can only be built on the [dashboard](/dashboard) - there's no discord-side editor for it, because a twelve-option embed builder crammed into slash-command options would be miserable. posting needs Manage Server, Administrator, or an **edit** dashboard grant on embeds.
:::

## vc stats {#vc-stats}

taz keeps track of time spent in voice, for the dashboard's analytics page and for anyone who wants to see it in discord. it's on by default, and only counts time that passes this server's rules.

::: commands
- `/vcstats member user:` - someone's time in voice: all time, the last 30 days, their rank, and their top channels. defaults to you. open to everyone.
- `/vcstats leaderboard` - most time in voice, all time.
- `/vcstats channels` - the busiest voice channels over the last 30 days.
:::

what counts is a manager's call, with `/analytics vcstats rules` and `/analytics vcstats exclude`, or the settings tab on the dashboard's analytics page: time in the AFK channel, deafened, muted, or alone. by default muted time counts and the rest doesn't. bots never count. these rules are separate from [voice xp](/docs/leveling#voice-xp). members who turned off data collection with `/me` aren't tracked by name - their minutes still count toward the server's total, anonymously.

## analytics {#analytics}

the dashboard's analytics page splits into tabs - overview, members, messages, voice, moderation, community - so you're not scrolling past everything at once. it covers member growth, where joins came from, how old new accounts are (a spike of brand-new ones usually means a raid), whether new members stick around, busiest channels and posters, voice time, automod catches by filter, mod actions by type and by moderator, level distribution, tickets, giveaways and counting. free servers see the last 7 days; taz plus goes back 90.

::: commands
- `/analytics toggle` - turns analytics off (or back on) for the server. off means taz stops collecting stats here, and vc stats stop with it. what's already collected stays until it ages out, and the mod log keeps working either way.
- `/analytics vcstats toggle|rules|exclude` - vc stats on or off, and what counts (see above).
- `/analytics status` - the current settings.
:::

changing analytics settings needs Manage Server or Administrator. a dashboard grant for analytics is view-only.

## elsewhere {#elsewhere}

other member-facing commands are documented with the module they belong to:

::: commands
- [`/rank`, `/leaderboard` (`/lb`), `/prestige`](/docs/leveling) - leveling.
- [`/me`, `/afk`](/docs/profile) - your cross-server profile.
- [`/invites`](/docs/tickets-and-tools#invites) - invite tracking.
- [`/cats`, `/dogs`, `/rps`, `/caption`, `/imgfx`, `/ship`, `/pfp`, `/flip`, `/roll`](/docs/fun) - fun and image tools.
:::

and the [full command list](/commands) always has the current, raw details for all of them.
