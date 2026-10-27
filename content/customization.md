---
title: customization
description: every server runs its own rules - branding, welcome/leave messages, sticky messages, scheduled announcements, and custom commands all live under /general.
order: 6
icon: fa-palette
card: branding, welcome/leave messages, sticky messages, scheduled announcements, custom commands, and join-to-create voice hubs.
---

every server runs its own rules. branding, welcome/leave messages, sticky messages, scheduled announcements, and custom commands all live under `/general`, or the dashboard's general settings page.

## branding {#branding}

::: commands
- `/general settings embedcolor | clearembedcolor` - taz's brand color in every menu/status embed - taz plus. free servers get the default pink.
- `/general settings nickname | clearnickname` - how taz is named in your server. free.
- `/general profile avatar | clearavatar` - a per-server avatar for taz. free.
- `/general profile banner | clearbanner | bio | clearbio` - a per-server banner and bio - taz plus.
:::

a new avatar or banner is checked against taz's image rules before it's saved: no nudity or sexually explicit content (suggestive is fine), nothing graphic or gory, no hate symbols, and nothing about known sex offenders. if an image breaks one, it isn't saved. a link is saved as the image itself, so changing what's at the link later doesn't change taz's avatar.

## welcome & leave messages {#welcome-leave}

::: commands
- `/general settings welcomechannel | welcomemessage` - where and what taz posts when someone joins.
- `/general settings leavechannel | leavemessage` - same, for when someone leaves.
:::

bots that join or leave are skipped by default. turn on "welcome bots too" or "announce bots too" with `/general toggle`, in `/general menu`, or on the dashboard if you want them announced as well.

both support `{user}`, `{username}`, `{server}`, and `{memberCount}` placeholders, and can be sent as plain text or a full embed (title, color, image, fields) - the embed builder is dashboard-only. in any message box on the dashboard, typing `@` opens a dropdown of your roles (plus `@everyone` and `@here`) and `#` one of your channels, and the mention is inserted wherever your cursor is. `/general menu` has its own welcome/leave screens too, each with a "create a channel for this" button next to the channel picker - the dashboard's welcome/leave channel pickers have the same button.

## sticky messages {#sticky-messages}

::: commands
- `/general sticky set | remove | list` - a message that stays pinned to the bottom of a channel, reposting itself whenever someone else posts.
:::

## suggestions {#suggestions}

members post an idea with `/suggest post`, everyone votes with 👍 / 👎 buttons (one vote each, and you can change or take it back), and staff mark it approved, denied, under consideration or implemented. the message recolors itself to match, voting closes once staff have decided, and the author gets a dm (unless they've opted out of dms in `/me`).

::: commands
- `/suggest post idea: anonymous:` - open to everyone once suggestions are set up. `anonymous` only works where the server allows it. suggestions up to 1000 characters.
- `/suggest approve | deny | consider | implement suggestion: reason:` - staff only - see below for who. the suggestion autofills as you type - search by number or by what it says - and leaves out ones already in that state. the reason is optional and shows on the suggestion and in the author's dm.
- `/suggest reopen suggestion:` - staff only. puts a decided suggestion back to pending, which reopens voting.
- `/suggest info suggestion:` - staff only. who posted it, the votes, what staff decided and a link to it. this is how staff see who wrote an anonymous suggestion - anonymous hides the name from the channel, not from staff.
- `/general suggestions channel | clearchannel` - where suggestions are posted. setting a channel turns suggestions on, and nothing works until one is set. `/general toggle feature:suggestions` turns it off again.
- `/general suggestions options` - `allow_anonymous` (off by default), `create_threads` to open a discussion thread on each one (off), `notify_author` to dm the author on a decision (on), and `cooldown_seconds` between one member's suggestions (60, or 0 for none).
- `/general suggestions status` - the current setup.
:::

who counts as staff is the same [fake permissions](/docs/moderation#fake-permissions) system as `/ban` and `/lockdown`: anyone with Manage Server or Administrator, or any role or member you grant the `suggest` command to (`/mod fakeperms grant command:suggest`, or the dashboard's moderation page). one grant covers approve, deny, consider, implement, reopen and info. ordinary moderators aren't staff here unless you grant it - who decides on suggestions is its own question, and you get the same audit trail as any other grant. the staff commands are visible to everyone in discord's command list - like `/ban` - but only staff can use them, and the autofill shows nobody else anything. a suggestion containing a phrase from your [word filter](/docs/auto-moderation) is refused while the word filter is on, so taz can't be used to post something the filter would have caught. suggestions never ping anyone. decisions are written to your mod log (the **Suggestions** logging toggle on the moderation page), and the settings above are also on the dashboard's general settings page.

## scheduled announcements {#scheduled-announcements}

::: commands
- `/announcements scheduled add | edit | remove | list` - write it once, taz posts it on a schedule - once (the default), daily, weekly, or monthly. no cap, free and taz plus alike.
:::

these live under their own command rather than `/general`, alongside youtube notifications - see the [announcements page](/docs/announcements) for the full write-up. the dashboard has a section for them too, same shape as sticky messages and custom commands.

## auto-responses {#auto-responses}

::: commands
- `/general autoresponse add phrase: response: enabled:` - taz replies to a phrase automatically, with no prefix and no slash command - somebody just says the thing and she answers.
- `/general autoresponse edit phrase:` - change the reply, or switch one off without deleting it.
- `/general autoresponse remove | list` - delete one, or see every auto-response in this server.
:::

a phrase matches as a whole word, so "hi" doesn't fire on "this". the reply takes the same `{user}`, `{username}`, `{server}` and `{memberCount}` placeholders as everything else here. free servers get 10, taz plus is unlimited - and the dashboard's auto-responses section can exempt specific members or roles from them - nobody is exempt by default, Administrator and mod-bypass roles included.

## custom commands {#custom-commands}

::: commands
- `/general custom add | edit | remove | list` - your own trigger → response pairs, with the same templated placeholders as welcome/leave.
:::

always usable with your server's prefix (`{prefix}trigger`); optionally also registered as a real `/trigger` slash command. free servers get 25 slash-registered custom commands, taz plus gets 75 - prefix-triggered ones are effectively unlimited.

## voice hubs {#voice-hubs}

a hub is a voice channel that hands out voice channels: join it and taz makes you your own, moves you into it, and deletes it once everyone's left. she waits 10 seconds before deleting, so dropping out and straight back in doesn't cost you the channel. free servers get 1 hub, taz plus is unlimited. set them up with `/voice hub`, or under "join-to-create" on the dashboard's general page, which can also create the hub channel for you.

::: commands
- `/voice hub add channel: category: name_template: user_limit:` - turns a voice channel into a hub. new channels go in `category` (the hub's own by default), get their name from `name_template` (`{username}'s channel` by default - `{username}` and `{displayname}` work), and hold up to `user_limit` people (0, the default, means no limit; the most is 99). adding a hub turns join-to-create on.
- `/voice hub edit channel:` - change any of those on an existing hub.
- `/voice hub remove channel:` - stops a channel being a hub. channels it already made stay until they empty out.
- `/voice hub list` - every hub and how it's set up.
- `/voice toggle state:` - pause join-to-create without losing your hubs.
:::

`/voice hub` and `/voice toggle` need Manage Server (or a dashboard grant on general - `hub list` only needs view access).

### owning a channel {#voice-hub-owners}

whoever joined the hub owns the channel it made. by default the owner can rename it and change its settings (bitrate, user limit and so on) and move, server-mute and server-deafen people in it, all from discord's own channel settings and right-click menu, and only in their own channel. each of those can be turned off per hub with the `owner_` options on `add` and `edit`. an owner can't edit the channel's permissions in discord, so the only say they get over who joins is `/voice lock`.

::: commands
- `/voice lock` / `unlock` - stop new people joining your channel, or let them in again. whoever's already in can stay.
- `/voice kick user:` - disconnect someone from your channel.
- `/voice transfer user:` - hand your channel to someone else in it.
- `/voice claim` - take over a channel whose owner has left. anyone still in it can.
:::

these are open to every member, but only work on a channel you own (or, for `claim`, one whose owner has left).

new channels copy their category's permissions, so whoever can't see or join that category can't see or join them either. taz needs Manage Channels, Manage Roles and Move Members to make channels, set them up and move people in - without those, joining a hub does nothing - and discord only lets her give an owner permissions she has herself. a server can have at most 50 of these channels open at once, a safety net well under discord's 500-channel limit. making and deleting them stays out of your mod log, so a busy evening doesn't bury everything else.

## other settings

::: commands
- `/general settings prefix` - the text-command prefix, shared with moderation's prefix commands.
- `/general settings extraprefixes prefixes:` - up to 5 more prefixes that also work, separated by spaces (`none` clears them) - handy while a server moves from one prefix to another. the main prefix is the one taz shows in examples. also on the dashboard's general page, under "other prefixes".
- `/general settings addautorole | removeautorole` - roles granted automatically to every new member.
- `/general settings prefixpermissions` - off by default. turn it on to hold text commands to the same per-channel permissions as slash commands, instead of letting them run anywhere the member can type.
- `/general toggle feature: state:` - switch welcome messages, leave messages, or auto-roles off without clearing what you configured for them.
- `/general status` - everything on this page as it currently stands, in one embed.
:::

::: note
almost everything here also has an equivalent on the [dashboard](/dashboard)'s general settings page, including a live preview for embed-based messages.
:::

## mentions in messages {#mentions}

a mention you put in a message taz sends now actually pings, instead of rendering as a chip that notifies nobody. that includes `{user}` - a welcome message using it will ping the member who just joined.

only mentions *you* typed count. anything a placeholder fills in is inert, so a member who renames themselves to `@everyone` can't turn your welcome message into a mass ping.

::: note
discord never sends a notification for a mention inside an **embed** - that's discord's own behaviour, not a taz setting. if you want a message to actually ping, it has to be in plain text mode. the mention still renders as a proper chip either way.
:::
