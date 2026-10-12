---
title: auto-moderation
description: scam links, invites, spam, mass mentions, and message flooding get caught automatically, on top of your own custom keyword filters - plus antinuke, for when the threat is a compromised admin rather than a member.
order: 2
icon: fa-robot
card: keyword filters, spam/link filters, the warn ladder, bot detection, a minimum account-age gate, and antinuke.
---

scam links, invites, spam, mass mentions, and message flooding get caught automatically, on top of your own custom keyword filters - plus antinuke, for when the threat is a compromised admin rather than a member. an escalating warn ladder and a bot-detection system round it out, and antinuke covers the other direction entirely - a compromised admin or bot destroying the server from the inside. the filters are set up with `/automod`, the rest with `/mod` (and `/antinuke`), and all of it on the dashboard's moderation page.

## keyword filters

define your own blocked words and phrases, grouped into named categories (e.g. "advertising", "slurs") so you can tune each one independently.

every catch on this page - keyword, spam, link, mass mention - posts to your mod log and is searchable afterwards in `/mod modlogs` and the dashboard's audit log, gated behind the **Filters** logging toggle. a nickname the filter had to replace is logged too, with the nickname it took away, since taz can't put that back for you.

a blocked nickname gets *replaced*, not cleared - clearing falls back to the member's real username, which is usually what tripped the filter in the first place. it becomes `username` by default; set your own with `/automod settings nicknameplaceholder`, the "nickname placeholder" button under `/mod menu` → filters, or the nickname filter panel on the dashboard's moderation page. taz won't accept a placeholder your own word list blocks, since it would just get caught again the moment it was applied.

::: commands
- `/automod wordlist create` - start a new filter category.
- `/automod wordlist config` - add or remove phrases, and tune a category's action (delete, warn, timeout).
- `/automod wordlist list` - see every category and what's in it.
- `/automod wordlist exempt | unexempt key: channel: role:` - skip one list for messages in a channel (or a whole category) or from a role, like profanity in an 18+ channel, while your other lists still apply there. nicknames are always checked. on the dashboard it's in the list's own settings.
:::

## spam & link filters

::: commands
- `/automod spamfilter massmention` - catches messages pinging too many users at once.
- `/automod spamfilter linkflood` - catches a burst of links posted too quickly.
- `/automod spamfilter repeat` - catches the same message spammed repeatedly.
- `/automod linkfilter toggle|adddomain|removedomain|addroledomain|removeroledomain` - blocks links outright, with an allowlist for approved domains - and per-role domain allowances on top of the global list.
:::

::: note
uploaded gifs aren't links, so the domain list can't catch them. turn on **block gif uploads** (`/automod linkfilter toggle check:block gif uploads`, or the link filter panel on the dashboard) and pick the roles that can still upload them with `/automod exempt filter:gif uploads role:` or the "can upload gifs" picker. other image uploads aren't affected.
:::

::: note
discord invite links get their own role exemption, separate from the domain allowlist above - the dashboard's moderation page has an "invite-exempt roles" picker under the invite block toggle, for a role (like "partners") that should be able to post other servers' invites without turning off the block, or opening up link restrictions generally.
:::

## automod settings {#automod-settings}

::: commands
- `/automod settings charlimit value: | clearcharlimit` - a max message length, enforced automatically. off by default for new servers, and it works even with the moderation master switch off.
- `/automod settings addcharlimitbypassrole | removecharlimitbypassrole` - roles the length limit doesn't apply to. separate from the bypass role below, so a role can skip the length limit without skipping the filters.
- `/automod settings addbypassrole | removebypassrole` - roles exempt from every filter on this page.
- `/automod settings nicknameplaceholder value:` - what a blocked nickname gets renamed to (defaults to `username`). leave the value off to reset it.
:::

## what happens on a catch {#on-a-catch}

every filter above, plus the message length limit, safeguards and gif uploads, deletes the message. on top of that, each one has its own settings for what else happens and where it doesn't apply: whether it warns (which counts toward the [warn ladder](#warn-ladder)), a timeout, a message to the member (like "gifs unlock at level 20"), and channels, categories or roles it skips. a category covers every channel in it, and threads follow their channel.

out of the box, invites, malicious links, mass mentions, link floods and repeated messages warn; links not on the allowed list, gif uploads, safeguards and the length limit just delete. a repeated message is deleted every time, but only warned or timed out once it hits the repeat count. if a catch both times out and warns, the timeout happens first, so a warn ladder punishment for that same warn wins.

::: commands
- `/automod status [filter:]` - what every filter (or one filter) does on a catch, and where it's skipped.
- `/automod punish filter: warn: timeout_amount: timeout_unit:` - turn the warn on or off, and set a timeout. a timeout of 0 turns it off; discord caps timeouts at 28 days.
- `/automod message filter: text: off:` - what taz tells the member. `off:` posts nothing, and leaving both out goes back to the default. `{limit}` in the length limit's message becomes your character limit.
- `/automod exempt | unexempt filter: channel: role:` - skip a filter in a channel or category, or for a role. for invites, the length limit and gif uploads, the role goes on that feature's own role list.
- `/automod reset filter:` - put a filter back to its defaults.
:::

on the dashboard's moderation page, each check has an "on a catch" box right under it with the same settings.

## warn ladder {#warn-ladder}

an escalation policy you build: reaching a set number of warns automatically triggers a punishment, instead of relying on a mod to notice and act every time. add as many steps as you want. a step applies from its warn count up, until a later step takes over - so with a kick at 3 and a ban at 5, a 4th warn kicks again.

each step can:

- **time them out** for up to 28 days
- **kick** them
- **ban them for a while** - taz unbans them automatically when it's up
- **ban** them - this works even if they've already left the server
- **give them a role** - optionally for a set time, after which it comes back off
- **take a role away** - optionally for a set time, after which they get it back
- **jail** them, using your jail role - optionally for a set time
- **take some xp** - a number of levels, or a percent of their xp
- **just alert staff** in your mod log, optionally pinging a role
- do **nothing else**, if you want a count with no punishment attached

any step can also **clear their messages** from the last few minutes, up to 30. taz only remembers messages for about that long, so it can't reach further back.

::: commands
- `/mod warnladder view` - see the current ladder.
- `/mod warnladder set count: action: duration_amount: duration_unit: role: xp_amount: xp_unit: clear_minutes:` - set what happens at a given warn count. a timeout or a ban-for-a-while needs a duration; giving or taking a role, or a jail, can have one or last for good. `role:` is the role to give or take away, or the role to ping for an alert. `xp_amount:` and `xp_unit:` are for taking xp, and `clear_minutes:` clears their recent messages on top of any action.
- `/mod warnladder remove | reset` - remove one step, or go back to the default ladder.
:::

the dashboard's moderation page builds the same ladder as a list - add a step, pick what happens and for how long, and save. the "add / edit rule" button on `/mod menu` handles the rest, except giving or taking a role and taking xp - use the dashboard or `/mod warnladder set` for those.

## when warns fall off

only warns that haven't fallen off count toward the ladder. by default a warn falls off 30 days after it's given; change that (or set it to never) on the dashboard's **warns** tab. the new length applies to warns given from then on.

staff can also change a single warn on the warns tab: click "falls off" on it to put it back on the server default, make it never fall off, set it to a number of days from now, or remove just that warn.

## bot detection

scores new joins for bot-like signals (account age, avatar, username patterns, join behavior) and can quarantine or gate suspicious accounts behind a verification channel.

::: commands
- `/mod botdetection threshold` - how suspicious a join has to look before action is taken.
- `/mod botdetection weight` - how many points a specific signal (account age, avatar, username pattern) adds when it fires - set your own, or leave it at the shipped default.
- `/mod botdetection quarantinerole | clearquarantinerole` - the role applied to a flagged join, if any.
- `/mod botdetection verifychannel | clearverifychannel` - where a quarantined member is pointed to verify themselves. automod runs in there like anywhere else, answers included.
- `/mod botdetection verifypurge enabled: minutes:` - auto-clear the verification channel: questions, answers and replies are deleted once they're older than the time you pick (5 minutes by default, up to a day). pinned messages stay, so you can pin instructions. off by default, and taz needs Manage Messages in the channel. also on the dashboard, under bot detection.
- `/mod botdetection check` / `status` - manually check a specific member, or see the current configuration.
:::

## minimum account age {#account-age}

a hard join gate: an account younger than the age you set doesn't get in at all. this is separate from bot detection's own account-age *signal*, which only nudges a score and can be outweighed by a normal-looking avatar and username - the gate never scores anything, it just checks the date the account was made. under the line means removed, no exceptions.

::: commands
- `/mod accountage minimum amount: unit:` - the age an account has to be to join - anything from minutes to years.
- `/mod accountage clearminimum` - removes the limit entirely.
- `/mod accountage status` - the current minimum, if there is one.
:::

::: note
a blocked join is a **kick**, not a ban - the member is DM'd why, told how old their account needs to be, and invited to come back once it is. it never applies to bots (that's bot detection's job), and it runs before bot detection so a too-new account is gone before anything else evaluates it. the removal lands in your mod log as an ordinary **Member Kicked** entry.
:::

## antinuke

everything else on this page is about members misbehaving. antinuke is about *staff* - a compromised admin account, a hijacked bot, or a malicious insider mass-deleting channels, mass-banning members, or minting themselves an administrator role. it watches the audit log in real time and punishes the **account**, not the individual actions, because by the time a human notices, the channels are already gone.

::: commands
- `/antinuke enable | disable` - turn it on. every rule starts watching by default.
- `/antinuke status` - the whole configuration at a glance, plus a warning if taz is missing a permission antinuke needs.
- `/antinuke punishment` - what happens to an account that trips a rule: strip its roles (the default), ban, kick, or just alert staff.
- `/antinuke rule` - tune one rule - how many actions, inside how many seconds, and optionally its own punishment.
- `/antinuke trust add | remove | list` - accounts and roles antinuke never acts on. put your own automation here.
- `/antinuke alerts` - where alerts go and who gets pinged. defaults to your mod-log channel - run it with nothing to go back to that, or `clear:` to drop just the channel or just the ping.
- `/antinuke bots` - whether other bots are watched too. on by default - taz herself is always exempt.
- `/antinuke managers add | remove | list` - who besides you may configure antinuke. owner only.
- `/antinuke history` - every time antinuke acted on its own, and whether it worked.
- `/antinuke restore` - hand back the exact roles antinuke stripped from someone.
:::

::: note shield
**only the server owner can configure antinuke** - not Administrator, not a dashboard grant, not a fake permission. that's deliberate: Administrator is exactly what a compromised account already has, so an admin-gated off-switch would let an attacker turn off the thing watching them before starting. the owner can name specific people with `/antinuke managers add`.
:::

::: note undo
the default punishment strips every role taz can remove, which actually stops an attack in progress - and taz records exactly which roles she took, so a false positive is one `/antinuke restore` (or one dashboard button) away rather than a manual permissions rebuild. antinuke also needs **View Audit Log** to work at all; `/antinuke status` will tell you if it's missing.
:::

::: note
roles added via `/automod settings addbypassrole` are exempt from every filter on this page - useful for staff or trusted bots that would otherwise trip the same rules as everyone else. antinuke is the exception: it has its own separate trusted list (`/antinuke trust add`), so a mod-bypass role doesn't quietly become a licence to nuke.
:::
