---
title: moderation
description: bans, kicks, mutes, warns, purges, jail, and lockdowns - each available as its own slash command, or from the interactive /mod menu panel.
order: 1
icon: fa-shield-alt
card: bans, kicks, mutes, warns, purges, lockdowns, and the mod-log that tracks all of it.
---

bans, kicks, mutes, warns, purges, jail, and lockdowns - each available as its own slash command, or from the interactive `/mod menu` panel. every action is logged automatically once a mod-log channel is set.

## core actions

these are standalone commands - use them directly, no menu required.

### punishments

::: commands
- `/ban target: reason: duration: unit:` - permanent by default; add a duration + unit for a temporary ban that auto-lifts.
- `/kick target: reason:` - removes a member; they can rejoin with a new invite.
- `/mute target: duration: unit: reason: add_warn:` - Discord timeout - can't send messages, react, or speak until it expires.
- `/warn add|list|remove|clear` - add a warn, list a user's (or the server's) warns, remove the most recent one, or clear all of them. warns count toward the [warn ladder](/docs/auto-moderation#warn-ladder) until they fall off - 30 days by default, adjustable per server and per warn on the dashboard's warns tab.
- `/softban target: reason: days:` - bans then immediately unbans - bulk-deletes recent messages without a lasting ban.
- `/massban ids: reason: delete_days:` - bans up to 200 users at once by ID.
- `/jail target: reason: duration: unit:` / `/unjail target: reason:` - hands someone a jail role that hides the rest of the server from them - see below. add a duration to release them automatically. needs the role configured first.
- `/fakeban target: reason:` - posts a convincing ban message without actually banning anyone - for a laugh, not real enforcement.
:::

### reversals and adjustments

::: commands
- `/unban user: reason:` - lifts a ban - takes a user ID or a username, so it works on someone who isn't in the server to pick from a list.
- `/unmute target: reason:` - lifts an active timeout early.
- `/duration target: duration: unit: reason:` - extends or shortens an already-active mute or ban without lifting and re-issuing it.
- `/temprole add|remove|list` - give someone a role that removes itself after a set time - see [temporary roles](#temporary-roles).
:::

### cleanup

::: commands
- `/purge amount: user: contains: has_attachment:` - bulk-deletes recent messages, optionally filtered by author, text, or attachments.
- `/clean amount:` - deletes taz's own recent messages in a channel, without touching anyone else's.
- `/snipe public:` - shows you the last message deleted in the current channel, and who sent it, for up to 10 minutes after it's gone. only you see it unless you set `public` to true. messages removed by `/purge` or by taz's own filters, and bot messages, aren't kept. needs Manage Messages or a `/snipe` [fake permission](#fake-permissions) grant. it's on by default; turn it off with `/mod toggle feature:snipe` or on the dashboard's moderation page.
:::

### channel control

::: commands
- `/lockdown scope: channel: reason:` / `/unlock` - locks a channel, its whole category, or the entire server from sending messages - unlock restores the exact prior state.
- `/slowmode seconds:` - sets slowmode on the current channel.
:::

### records

::: commands
- `/case view|reason|note|delete` - look up a case, fix its reason, leave a private staff note on someone, or delete a case - see [moderation history](#cases).
:::

## moderation history (cases) {#cases}

every warn, mute, kick, ban, softban and jail - and the reversals - gets a numbered case: #1, #2 and up, per server. that includes things done in discord's own right-click menus or by another bot (taz reads the audit log to see who did it, if she has View Audit Log), and everything automatic: automod warns, the warn ladder, antinuke, bot detection, and temp bans running out. cases are kept whether or not you've set up a mod-log channel - the log is the notification, the case is the record.

mod-log posts and taz's replies say which case an action became, so "see case #12" means something.

::: commands
- `/mod modlogs user:` - someone's whole history, newest first, with a count of each kind of action at the top.
- `/case view number:` - one case in full - who, by whom, why, how long, and how it happened.
- `/case reason number: reason:` - fix a case's reason after the fact (a ban done in a hurry, a typo). the change is logged.
- `/case note user: note:` - a private staff note on someone's history - context for whoever handles them next. it gets a case number too.
- `/case delete number:` - remove a case that shouldn't be there. Manage Server only, logged, and it doesn't undo the action itself.
:::

the dashboard's moderation page has a **cases** tab for all of this - filter by person or action, click a name to see just theirs, edit reasons and add notes. the **audit log** tab next to it shows everything taz has logged; click any name there to filter to that person, and export what you're looking at as a CSV.

## temporary roles {#temporary-roles}

a role that takes itself back off after a while - a "muted in voice" role for an hour, an event role for the weekend, a probation role for a week. you can only hand out roles below your own highest role (same rule as discord's own role menu), and taz only ones below hers.

::: commands
- `/temprole add user: role: duration: unit: reason:` - give the role until the time's up. giving it again just moves the end time.
- `/temprole remove user: role:` - take it off now instead of waiting.
- `/temprole list user:` - what's active and when each one ends.
:::

a temporary jail (`/jail` with a duration) works the same way, and when it ends taz records it as an unjail. if someone leaves and rejoins before a temporary role or a jail is over - including a jail with no end date - they get it back, so leaving isn't a way out. taking the role off by hand (or `/unjail`) ends it for good. jails from before v0.0.23 aren't covered until they're re-jailed.

## raid mode {#raid-mode}

a panic switch for when a raid is happening *right now*. one command tightens the server for a while, then it switches itself off - so nobody has to remember to undo it, and a server can't stay locked down by accident. it's different from [auto-moderation](/docs/auto-moderation), which reacts after the fact: this is you saying "I can see it happening, lock it down."

while raid mode is on:

- **minimum account age** - joins from accounts younger than the limit (a week by default) are removed. if your server already has its own minimum account age, the stricter of the two applies - raid mode never loosens anything.
- **bot detection** is forced on (even if you normally have it off) with a stricter threshold (60 by default). again, if your own threshold is stricter, yours is used.
- **slowmode** goes on every text channel (30 seconds by default). channels that are already slower are left alone, and when raid mode ends every channel goes back to exactly the slowmode it had before - unless someone changed it by hand in the meantime, in which case taz leaves it as they set it.

it always ends: after an hour by default (you choose the length, from 5 minutes to 7 days - there's deliberately no "forever"). turning it on again while it's already on extends it. it works even with the moderation master switch off.

::: commands
- `/mod raidmode on duration: unit: reason:` - turn it on. duration and unit are optional (your server's default otherwise). open to any moderator, because the person who sees a raid first usually isn't the one with Manage Server. also a button on `/mod menu`, and on the dashboard.
- `/mod raidmode off reason:` - turn it off now and put slowmode back.
- `/mod raidmode status` - whether it's on, when it ends, and what it does.
- `/mod raidmode config` - change what it does: the default `duration`, `min_account_age`, `force_bot_detection` and `bot_detection_threshold`, `slowmode_seconds`, and a `notify_role` to ping in the mod log whenever it turns on or off. needs Manage Server or a moderation 'edit' dashboard grant. `/mod raidmode reset` puts everything back to the defaults.
- `/mod toggle feature:raidMode` - turn the whole feature off for servers that don't want it (it's on by default, but does nothing until a moderator starts it). `modLogRaidMode` controls whether starting, extending and ending it are written to the mod log.
:::

settings are also on the dashboard's moderation page under "raid mode". a raid mode that's already on keeps the settings it started with, so editing them mid-raid can't change the rules halfway through.

## jail {#jail}

a middle ground between a timeout and a ban: instead of silencing someone everywhere, jail gives them a role that hides every channel except one you've set aside, so you can actually talk to them about whatever they did. the role and the channel are both yours to pick - jail does nothing at all until a role is set.

::: commands
- `/mod jail guidedsetup` - the fastest way in - creates the jail role and channel if they're missing, and hides the role from every other channel in the server for you. that last part is the fiddly bit if you do it by hand.
- `/mod jail role role:` / `clearrole` - use a role you already have instead. this is the one required setting.
- `/mod jail channel channel:` / `clearchannel` - the one channel a jailed member can still see - optional, but without it jail is just a silent room with nobody in it.
- `/mod jail status` - the current jail role, channel, and logging setup - and whether it's actually usable yet.
:::

all of the above is on `/mod menu` and the dashboard's moderation page too, jail tab included. jailing and unjailing are ordinary mod actions: both are logged, both show up in `/mod modlogs`, and both can be handed out as a [fake permission](#fake-permissions) without granting anything else.

## the mod menu

`/mod menu` opens an interactive panel covering most of the above plus server status, modlogs for a specific user, mod-stats for a specific moderator, and fake permissions - useful when you'd rather click through options than remember every command's exact syntax. the mod-log channel picker has a "create a channel for this" button if you'd rather taz just make one than dig through your channel list - the dashboard's mod-log channel picker has the same button.

::: commands
- `/mod status` - a snapshot of the current moderation configuration.
- `/mod modlogs user:` - one member's [moderation history](#cases), page by page.
- `/mod modstats moderator: days:` - how many of each action a moderator has handled over a lookback window.
:::

## setup

everything below lives under `/mod settings`, or the dashboard's moderation page:

- `logging channel: event: state:` - set where mod-log embeds get posted and/or turn a specific logged event on or off (bans, kicks, message edits, and 22 others) - provide at least one of channel/event. nothing is logged until a channel is set. not to be confused with `/mod modlogs`, which looks up one member's own history instead.
- `prefix` - the text-command prefix (defaults to `t!`), for servers that prefer typing over slash commands.
- `ticketcategory` / `ticketarchivecategory` / `addsupportrole` / `removesupportrole` - shared setup used by the tickets module too.

the message length limit, the automod bypass role and the nickname placeholder are under `/automod settings` - see [auto-moderation](/docs/auto-moderation#automod-settings).

::: note
who can use these: anyone with the matching natural Discord permission (Ban Members, Kick Members, Moderate Members, or Manage Messages), anyone with Manage Server/Administrator, or a staff member individually granted that specific command below. no separate setup needed if your mod roles already have the right permissions.
:::

## fake permissions {#fake-permissions}

lets you grant a role or member access to individual commands above - `/ban`, `/warn`, whichever ones you pick - *without* handing out the matching real Discord permission. that means a compromised mod account - a leaked token, a hijacked session - can't reach Discord's own moderation API directly to mass-ban or nuke; it can only go through the specific taz commands you granted, which are logged and revocable in one click. manage it from whichever surface you prefer - the dashboard's moderation page, `/mod fakeperms`, or the "fake permissions" button on `/mod menu` - they all read and write the exact same grants.

the same underlying grants also control plain dashboard access (which settings pages a role/member can view or edit) - the two are independent: a role can get command access with no dashboard access, dashboard access with no commands, or both.

::: commands
- `/mod fakeperms grant command: user: role:` - grant a specific command to a user or role - pick exactly one target.
- `/mod fakeperms revoke command: user: role:` - take a specific command back.
- `/mod fakeperms list user: role:` - show current grants - for everyone, or filtered to one user/role.
:::

for the security benefit to actually apply, remove Ban Members/Kick Members/Moderate Members/Manage Messages from that role in Discord's own role settings after granting it command access - taz can't see or change a role's real Discord permissions, so that part stays a manual step on your end.

::: note
managing fake permissions - via the dashboard, `/mod fakeperms`, or `/mod menu` - always requires a real Manage Server or Administrator holder, with no exceptions. a role granted access to one command can never use that access to grant itself (or anyone else) more.
:::

every grant change is written to your mod log (the **Fake Perms** logging toggle) with who changed it, which commands were added or taken away, and which surface it came from - so handing somebody moderation power leaves the same trail as using it does.

::: note
a few of the grants aren't moderation commands at all. three are listed separately because they're the ones ordinary module access deliberately doesn't carry: **wipe all levels** (clears a server's whole leaderboard, irreversibly), **import levels from a file** (can overwrite a whole leaderboard) and **modify your own level** (lets someone change their own level/xp rather than only other people's) - all three are treated as high-risk in the presets. `/reactionroles`, `/starboard`, `/invites`, `/snipe` and `/suggest` (deciding on [suggestions](/docs/customization#suggestions)) are in the list too, so a staff member can be given one of those without any of the moderation commands beside it.
:::

because these commands are visible to every member by default (not just ones with a fake-permission grant), you might notice someone without access can still see e.g. `/ban` in their command list. trying to actually use it still gets rejected instantly, every time - taz checks permissions before doing anything, regardless of what shows up in the picker.

if that still bugs you: Discord lets a server admin restrict who can even *see* a given command, per server - Server Settings > Integrations > taz > find the command > limit it to specific roles. this is entirely optional and, to be clear, overkill from a security standpoint - it's cosmetic on top of enforcement taz is already doing, not a replacement for it. taz can't set this for you (Discord only allows a human admin to configure it), so it's a manual, one-time-per-command step if you want it.
