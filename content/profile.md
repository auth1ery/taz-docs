---
title: profile
description: /me - one profile that follows you across every server taz is in: birthday, timezone, pronouns, DM opt-out, and leaderboard visibility.
order: 8
icon: fa-id-badge
card: /me - birthday, timezone, pronouns, DM opt-out, and leaderboard visibility, shared across every server. plus /afk, optionally global.
---

one profile that follows you across every server taz is in, instead of re-entering the same details on each one.

## /me {#me}

birthday, timezone, pronouns, DM opt-out, and cross-server leaderboard visibility all live in one place, shared everywhere taz is. not a per-server setting.

::: commands
- `/me view` - your current profile, ephemeral.
- `/me birthday day: month: year: clear_year: visible: age_visible:` - day and month are plain numbers picked from the list - no date format to get wrong or guess the order of. `year` is entirely optional; without one, only the month and day are ever stored or shown, and `clear_year:true` removes one you'd previously set. `visible` and `age_visible` are the two privacy toggles, set right here alongside the date.
- `/me timezone timezone:` - an autocompleting list of real timezones (`America/New_York` and friends), so there's nothing to spell from memory. `none` clears it.
- `/me pronouns pronouns:` - free text - "she/her", "they/them", whatever you use. `none` clears it.
- `/me leaderboards state:` - visible or hidden on cross-server (global) leaderboards - [counting's global leaderboard](/docs/fun#counting-leaderboards) today.
- `/me dms state:` - allow or block DMs from taz - moderation notices and the like.
- `/me delete-data include_levels:` - delete what taz keeps about you, in every server - see [your data](#your-data) below.
- `/me data-collection state:` - turn data collection off (not recommended) or back on - see [your data](#your-data) below.
:::

one subcommand per thing, rather than a single `/me set` with eight options on it, so each one asks you for exactly what it needs and nothing else.

birthday and age visibility both default to hidden - setting either doesn't announce anything until you turn the matching toggle on. a server with your birthday visible can still have your age hidden, or the reverse - they're independent. the dashboard has an equivalent "me" page for all of this too.

## your data {#your-data}

`/me delete-data` deletes the data taz keeps about you, in every server at once: your profile, afk statuses, reminders, suggestion votes, giveaway entries, activity stats and invite tracking. add `include_levels:true` to delete your levels and counting scores too - that part can't be undone, so it's off unless you ask. it shows you what it found and asks before deleting anything. a "block DMs" choice is kept.

it doesn't touch a server's own records about you - warns, bans, ticket bans, tickets and their transcripts. those belong to that server's moderation, and anyone being able to wipe their own record would defeat the point of having one. if you need those removed, ask in the [support server](https://discord.com/invite/CrDKkkxHVy).

`/me data-collection state:off` deletes the same things (levels included) and stops taz keeping anything new about you. **not recommended** - everything that has to remember something about you stops working for you, in every server: levels and xp (staff can't give you any by hand either), counting scores, `/afk`, `/remindme`, your profile and birthday, suggestions and votes, giveaway entries, ticket ratings and activity stats. you still count toward a server's totals (a message is a message), just not as you. server moderation still applies. `state:on` turns it back on, starting fresh.

separately: when taz is removed from a server, everything she stored for that server is deleted 90 days later, unless she's added back before then.

## per-server birthday & age visibility {#birthday-override}

the `visible`/`age_visible` toggles on `/me birthday` are the global defaults, but any one server can override either one without touching those defaults - handy if you want your birthday (or just your age) visible everywhere except one rowdy server, or the reverse. those overrides live on [`/birthday hide|show|reset`](/docs/fun#birthdays) and `/birthday hideage|showage|resetage`, run in the server you want to override - birthday and age are overridden independently of each other.

::: note
this is deliberately separate from leveling's own xp exemptions, which stay a per-server admin setting (`/level`) - nothing here ever opts you out of leveling anywhere.
:::

## /afk {#afk}

::: commands
- `/afk reason:` - go afk in this server. anyone who pings you gets told you're away (and why), and posting anything at all clears it automatically.
- `/afk reason: global:true` - go afk everywhere at once, instead of just this one server - handy if you're active across several of your own servers and don't want to set it in each.
:::

an afk reason can't contain a link - a plain URL or a bare discord invite both get refused. an afk reason is shown to anyone who pings you, in any channel, which makes it a lovely place to put an advert if taz let you.

a per-server afk always takes priority over a global one for the same person - going afk in one specific server for a specific reason is more specific than "i'm gone everywhere," so that's the one anyone pinging you sees. posting in a server only ever clears *that* server's own afk, never a different one - but a global afk has no single server to belong to, so posting anywhere at all clears it.
