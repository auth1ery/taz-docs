---
title: leveling
description: every message earns xp, level roles unlock automatically, and boosters climb faster - rank cards are visual, not just a number.
order: 3
icon: fa-star
card: xp, level roles, booster bonuses, channels that cost xp, voice xp, prestige, decay, and rank cards.
---

every message earns xp, level roles unlock automatically, and boosters climb faster. members can prestige once they hit a threshold, and rank cards are visual - not just a number.

## for members

::: commands
- `/rank` - your level, rank, and progress to next level, rendered as an image card.
- `/leaderboard` (or `/lb`) - the server's top members by level/xp.
- `/prestige` - reset your level and xp for a permanent prestige tier, once you reach the required level. destructive and irreversible - asks for confirmation first.
:::

## setup

everything below lives under `/level settings`, the dashboard's leveling page, or `/level menu` - the level-up channel picker has a "create a channel for this" button if you'd rather taz just make one, on both the interactive panel and the dashboard.

::: commands
- `channel` / `clearchannel` - where level-up announcements post - optional. with no channel set, taz posts in whichever channel the member actually leveled up in, instead of staying silent.
- level-up message (dashboard only) - customize what's posted on level-up - plain text, a full embed, or a dedicated "level up" image card styled like the rank card (not a copy of `/rank`'s card - built around the old->new level transition instead). text supports `{user}`/`{username}`/`{server}`/`{memberCount}` plus `{level}`/`{oldLevel}`/`{newLevel}`.
- `curve` / `xppermessage` - how much xp a message earns (7-15 by default, up to 1,000 before boosts), and how the level curve scales.
- `rolestackmode` - whether level roles stack or replace the previous tier.
- `prestige` - the level required to prestige. unset means prestige is disabled - there's no sane default.
- `decay` - opt-in weekly xp decay for inactive members. off by default.
- `rankcardpattern` - pick one of nine built-in gradient themes for `/rank` cards, free.
- `rankcardimage` - upload a fully custom rank card background - taz plus.
:::

## importing levels {#import}

switching from another bot and don't want to lose everyone's levels? `/level import` writes them into taz, either straight from mee6's public leaderboard (no file needed) or from a file. there's no shared export format between bots, so taz reads the simplest thing every bot (or a spreadsheet) can produce - a csv with a user id and an xp or level for each person - and recognises the json layouts a few bots publish.

::: commands
- `/level import file: source: mode: unit:` - upload a `.csv`, `.tsv`, `.txt` or `.json` file (up to 5MB, 100,000 people), or leave the file empty and set `source` to mee6. taz shows you exactly what would change - how many people are added, raised or lowered, the highest few in the result, and any lines it couldn't read - and nothing is written until you confirm. also on the dashboard's leveling page, under "import levels".
:::

### what taz can read {#import-sources}

- **mee6, live** - `source: mee6` (or "preview import from mee6" on the dashboard) reads mee6's public leaderboard for your server. the leaderboard has to be set to public in mee6's dashboard. it's an unofficial page mee6 could change or close at any time, and mee6 is strict about repeated requests, so taz only runs one of these at a time and reuses a server's result for ten minutes. if it stops working, use a file instead.
- **mee6 leaderboard json** - the `players` list mee6's leaderboard page returns (`id`, `xp`, `level`).
- **lurkr's "download leveling data"** - the `levels` list from lurkr's dashboard export (`userId`, `xp`, `level`).
- **a plain list of `uid` / `current_xp`** - the names some migration tools use. polaris data as a csv of member id and xp works too.
- **amari's api json** - a `data` list with `id` and `exp` (amari's own xp name).
- **taz's own export** - csv or json, so you can move levels between servers or restore a backup.
- **tatsu** - a column called `score` is read as xp. tatsu's score isn't the same as xp on every bot's curve, so check the preview.
- **anything else** - a csv, or json with a list of people (or an object keyed by user id, or one json object per line, like a database export) that has a user id plus `xp`/`exp`/`score` and/or `level`. arcane has no download button, but any file that lists user ids with xp will work.

the preview always shows what it understood - if everyone shows up as level 0, the wrong column was read. xp must be *total* xp, not progress into the current level. if a bot is missing that you'd like taz to read, tell us.

the file needs a header row naming the columns - `user_id` (or `id`), plus `xp` and/or `level` - then one person per line, like `user_id,xp` followed by `123456789012345678,5400`. semicolon- and tab-separated files work too.

a plain two-column file with no header is read as user id, then xp (pick `unit: levels` if the second column is levels instead). if a row only has a level, taz turns it into xp using *this server's* xp curve - the member lands at the very start of that level. if a row has both, the xp is used. xp is always the *total* xp, not progress into the current level.

what to do about members who already have a level here:

- **keep whichever is higher** (the default) - nobody is ever lowered, so it's safe to run on a server that's already been collecting xp.
- **overwrite** - everyone in the file is set to exactly what it says. the preview tells you how many people that lowers.
- **only add people with no level yet** - anyone who already has a level is left alone.

if an error interrupts an import part-way, taz tells you how many members were already written; on the dashboard, press import again and it finishes only the rest (that still works after taz restarts, for as long as the preview would have lasted). with `/level import`, run it again with **keep whichever is higher** (or **only add people with no level yet**), which is safe to repeat; running it again in **overwrite** sets everyone in the file back to the file's values, so anyone who earned xp since would lose it. if taz herself restarts in the middle of an import, she finishes it when she's back and says so in your mod log.

taz checks your preview again when you confirm. if someone earns more xp in between, taz leaves them alone rather than lower them or overwrite what they've got now, and tells you how many it skipped (except in overwrite mode, which sets everyone to exactly what you confirmed). anyone added to your xp exemption list in between is skipped too. if the server's xp curve changed in between, nothing is written and you're asked to preview again, since the levels in the preview were worked out on the old curve. members on your xp exemption list are skipped, members who've left the server are imported anyway (they get their level back if they return), and prestige is never touched. importing needs Manage Server, Administrator, or the separate "import levels from a file" [fake permission](/docs/moderation#fake-permissions) - it can overwrite a whole leaderboard, so it's kept apart from ordinary leveling access - and it's logged in your mod log (the **Levels** toggle).

::: note
importing doesn't hand out level roles on its own, since giving thousands of people roles at once should be your call. run `/level syncroles` afterwards (or "sync roles now" on the dashboard) to grant the roles everyone has earned.
:::

## exporting levels {#export}

get everyone's xp and level out as a file - a backup before an overwrite import, a spreadsheet, or a move to another bot. nothing is changed or removed.

::: commands
- `/level export format:` - sends you the file (only you see it). needs Manage Server or Administrator, and it's logged in your mod log (the **Levels** toggle). also on the dashboard's leveling page under "export levels", which has no upload size limit - a very large server's file is too big to send in discord.
:::

- **csv** - `user_id,xp,level,prestige`, highest first. opens in any spreadsheet.
- **json (taz)** - the same, with the server id and export time.
- **mee6 / lurkr / amari layouts** - the same people in the shape those bots publish their own data in (mee6's `players` with `detailed_xp`, lurkr's `levels`, amari's `data` with `exp`). the lurkr layout is the one most likely to be accepted elsewhere - atom's docs describe a lurkr-export import. these are for scripts and tools that read those layouts; they carry xp and level but not prestige, and taz can't promise a particular bot's importer will take the file. member names appear only for people taz currently has in memory.

csv and taz's json load straight back in with `/level import`.

## copying settings {#settings}

save every leveling setting to a file and load it back later, or into another server: the level-up channel and message, the xp curve, xp per message and cooldown, level roles, booster roles, channel multipliers, exemptions, rank card, decay, prestige, losing xp, voice xp, and whether leveling and voice xp are on. members' levels aren't in it - that's [exporting levels](#export).

::: commands
- `/level exportsettings` - sends you the file (only you see it).
- `/level importsettings file:` - shows which settings the file would replace, and changes nothing until you confirm. it's logged in your mod log (the **Levels** toggle).
:::

both are also on the dashboard's leveling page, under "copy settings", and need Manage Server, Administrator, or edit access to leveling.

the file names channels and roles by their discord ids, so when you load it into a different server, anything that server doesn't have is left out (the preview says how many). if none of a setting's channels or roles exist there - say, every level role is from the old server - the server keeps its own for that setting instead of losing it. members named in the xp exemption list are kept, since a person is the same everywhere.

## level roles & booster bonus

::: commands
- `/level levelrole set|remove|list` - a role granted automatically at a given level.
- `/level boosterrole set|remove|list` - an xp multiplier for a specific role (usually the server booster role), up to 100x. `0` means that role earns nothing. a booster role in a boosted channel still tops out at 100x.
- `/level boosterrole stacking mode:` - what a member with more than one booster role gets: only the highest multiplier (the default), or all of them multiplied together (2x and 1.5x make 3x). also on the dashboard, under booster bonus.
- `/level xpchannel set|remove|list` - an xp multiplier for a specific channel: above 1 boosts it (up to 100x), 0 turns xp off there, and anything below 0 (down to -10) makes talking there *cost* xp. also on the dashboard under "channel xp". see [losing xp](#losing-xp) for what a loss can do.
- `/level user modify|delete` - manually adjust or wipe a specific member's level/xp. adjusting *your own* needs the separate "modify your own level" fake permission on top of leveling access - see [fake permissions](/docs/moderation#fake-permissions). every hand edit, delete and wipe lands in your mod log with the before and after numbers (the **Levels** logging toggle).
- `/level syncroles` - retroactively grants level roles to every member who's earned one but is missing it - fixes members whose level/xp was set some other way (a migration from another bot, an admin edit) and so never actually got the role. also on the dashboard, as a "sync roles now" button.
- `/level settings topranker` / `cleartopranker` - a role that auto-grants to whoever currently tops the server's own level leaderboard, and gets taken away the moment someone else overtakes them - a single, always-current crown rather than a cumulative level role.
- `/level ignoreprefix add|remove|list` - register another bot's command prefix (e.g. `.` for Dyno, `g!` for a giveaway bot) so a member typing a command *at* that bot doesn't earn xp for it - taz can't otherwise tell that message apart from a real one.
:::

## losing xp {#losing-xp}

a channel with a negative multiplier takes xp away for each message, on the same cooldown as earning it (otherwise every message in there would cost something). boosters and the active-chat bonus only ever make gains bigger, never losses. what happens next is up to you, under `/level settings leveldown` or "losing xp" on the dashboard:

::: commands
- `allow` - whether losing xp can drop someone a level. off by default: xp stops at the start of their current level, so nobody ever goes down one.
- `remove_roles` - with level drops allowed, take away level roles the member is no longer high enough for. on by default.
- `announce` / `message` - post a message when someone drops a level, in the level-up channel (or where it happened if none is set). off by default - nobody gets roasted unless you want them to. `{user}`, `{level}` and `{oldLevel}` work in the message.
:::

xp never goes below 0. decay and hand edits with `/level user modify` work the way they always have.

## voice xp {#voice-xp}

members can earn xp for time in voice too. it's off by default, since it changes how fast people level - turn it on with `/level voicexp toggle` or "voice xp" on the dashboard (leveling itself has to be on as well). every minute, everyone in voice who counts gets that minute's xp; level-ups post in the level-up channel, or the voice channel's own chat if none is set.

::: commands
- `/level voicexp settings` - xp per minute (5 by default, up to 100), and whether channel multipliers and booster roles apply to voice xp. both apply by default, so a voice channel with a negative multiplier costs xp to sit in.
- `/level voicexp rules` - what counts: time in the AFK channel, time deafened, time muted, and time alone in a channel. by default muted time counts and the other three don't. deafening mutes you too, so with muted time off, deafened time is off as well.
- `/level voicexp exclude` - voice channels that never earn voice xp, up to 50.
- `/level voicexp status` - everything above at a glance.
:::

bots never earn voice xp, and a bot doesn't count as company for the "alone" rule. these rules are separate from [vc stats](/docs/utilities#vc-stats), so a server can, say, track AFK time in its stats without paying xp for it.

::: note
taz's own role has to sit above a level role in your server's role list to actually grant it - Discord enforces this regardless of Administrator. taz checks for this and warns you (in `/level levelrole set`, the level panel, and the dashboard) whenever a configured level role is one she can't grant; a level-up that crosses a blocked role also gets a note in the level-up message itself ("i would give you a role, but i can't :<"). the same check and warning applies to the top-ranker role.
:::

::: note
prestige outranks level everywhere rank is shown - the leaderboard, `/rank`, and sort order all put a higher prestige tier ahead of raw level.
:::

::: note
the dashboard's leveling page has a "channel XP" section to boost, reduce, or fully mute xp for a specific channel (a grind or event channel to encourage chatting, a counting channel or bot-commands to discourage it) - every channel earns normal xp unless you set one there.
:::
