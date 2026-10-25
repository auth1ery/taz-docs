---
title: tickets & tools
description: a one-click ticket panel routes support requests, reaction roles let members opt in with an emoji, giveaways can be gated to certain roles or levels, and invite tracking shows who invited who.
order: 4
icon: fa-ticket-alt
card: support ticket panels, modmail, reaction roles, giveaways, and invite tracking.
---

a one-click ticket panel routes support requests, reaction roles let members opt in with an emoji, giveaways can be gated to certain roles, levels, or prestige tiers, and invite tracking shows who invited who.

## tickets {#tickets}

`/ticket menu` is the fastest way in - builds and edits panels, buttons, and bans interactively. its front page has the open/archive ticket category pickers, each with a "create a category for this" button - previously these two categories were only settable via `/mod settings ticketcategory`/`ticketarchivecategory`, which still works too. the dashboard's tickets page has the same two category pickers and create-category buttons. the pieces it wraps:

::: commands
- `/ticket panel create` - start a new panel.
- `/ticket panel addbutton | set-button* | togglebutton | removebutton` - each button on a panel opens its own ticket category, with its own embed, cooldown, and optional intake question.
- `/ticket panel send` - posts the panel to a channel.
- `/ticket panel edit | set-mode | delete | list` - manage existing panels.
- `/ticket ban add | remove | list` - block a specific member from opening tickets. adding and removing a ticket ban is logged to your mod log with who did it (the **Ticket Bans** logging toggle).
- `/transcripts mine | user | all` - pull a closed ticket's transcript back up - your own, a specific member's (staff only), or a list of everyone who has one (staff only). see [utilities](/docs/utilities#transcripts).
- `/purge-archives` - deletes the closed tickets in your archive category, after listing them and asking. open tickets and any other channel in the category are left alone, and transcripts are kept. admins only.
:::

support roles are optional. a ticket is always visible to whoever opened it and to your admins; add support roles with `/mod settings addsupportrole` (or per button) so your staff can see them too and get pinged when one opens. admins count as support either way, so they can claim and close tickets.

the dashboard's tickets page covers the same ground with a proper builder UI, if you'd rather not do it all from Discord.

## modmail {#modmail}

members DM taz, and she opens a private channel for your staff to answer in - so nobody on your team has to DM a member from their own account, and every conversation is kept. it's a natural place for appeals too: "if you think this was a mistake, DM taz."

when someone DMs taz, she asks which server it's for (only servers they're in that have modmail on), then opens a channel in your modmail category that only your support roles and admins can see. the member never sees the channel: everything they send in DMs is copied into it, and staff answer from it.

::: commands
- `/modmail reply message: attachment: anonymous:` - answer the member, from inside their modmail channel. anything typed in the channel without this stays between staff, so you can talk it over first. `anonymous` hides your name for that reply.
- `/modmail close reason:` - ends the conversation, tells the member (with your reason, if you give one) and saves a transcript. the channel moves to your ticket archive category if you have one.
- `/modmail open user: message:` - start a conversation with a member yourself.
- `/modmail settings enabled: category: anonymous_replies: greeting: clear_greeting:` - turn it on and set it up. with no options it shows the current setup. needs Manage Server or a tickets 'edit' dashboard grant.
:::

- **who answers:** your [support roles](#tickets) (`/mod settings addsupportrole`), plus anyone with Manage Server or a tickets 'edit' grant. support roles get pinged when a conversation opens.
- **where:** your modmail category, or the ticket category if you don't pick one.
- **one at a time:** a member has at most one open conversation per server. messaging taz again adds to it. if they have conversations open with more than one server, taz asks which one each message is for.
- **blocking someone:** a [ticket ban](#tickets) (`/ticket ban add`) stops them opening modmail too.
- **transcripts:** closed conversations are saved like ticket transcripts, so the member can find theirs with `/transcripts mine` and staff with `/transcripts user`.
- **anonymous replies:** off by default, so members know who they're talking to. turn them on with `anonymous_replies` to make every reply show as "staff" instead. the channel always shows which staff member sent what.
- **logging:** opening and closing a conversation is written to your mod log (the **Modmail** logging toggle).
- **slowing down:** taz passes on up to 5 DMs every 10 seconds per person; anything faster gets a ⏳ and isn't sent.

modmail is off until you turn it on, from `/modmail settings` or the dashboard's tickets page.

## reaction roles {#reaction-roles}

::: commands
- `/reactionroles` - creates a new panel - posts the message and adds the reactions itself.
:::

editing an existing panel's title, description, or role pairs is dashboard-only, under the general settings page.

## giveaways {#giveaways}

::: commands
- `/giveaway create name: duration: unit: required_level: required_roles: required_prestige: min_account_age_days: winners: exclude_admins:` - requirements are independent and combinable - a giveaway can need a role *and* a level, for example. required\_level's choices include "server booster only". `winners` draws up to 20 at once. administrators can enter like anyone else unless you set `exclude_admins`.
- `/giveaway menu` - interactive panel for creating/ending/rerolling giveaways without remembering the full syntax. its requirement box also takes `noadmins`.
- `/giveaway list | end | reroll` - see running/recent giveaways, end one early, or draw again - every winner, or just one with `reroll winner:` (say they never claimed it). a reroll never hands the prize back to anyone who already won it.
- `/giveaway winmessage` - customize what taz says when she announces the winners, per server, instead of the stock line. with several winners, `{user}` becomes all of them.
:::

entering checks every requirement straight away and tells the member exactly what they're missing, so nobody enters a giveaway they could never win. the winners are drawn fairly from everyone who still qualifies when it ends. the dashboard (fun → giveaways) does all of this too, with a running/ended view, entry counts, and a reroll button on each winner.

## invites {#invites}

off by default - a staff member turns it on with `/invites enable` (dashboard: general → invites) before any of this starts recording. discord never actually says which invite a join used - this is a best-effort match against invite use counts, not a guarantee. joins through OAuth2, server discovery, or the widget can't be attributed to anyone and won't count toward either command below.

::: commands
- `/invites enable` / `/invites disable` - staff only - turn invite tracking on or off. past records are kept when you turn it off.
- `/invites count user:` - how many members someone's invited to this server - defaults to yourself.
- `/invites leaderboard` - top inviters in this server.
- `/invites who member:` - staff only - who invited a specific member, and when they joined.
:::

::: note
free servers get 5 active ticket panels and 10 active giveaways at once - taz plus removes the ceiling entirely. neither limit applies retroactively to what you've already created.
:::
