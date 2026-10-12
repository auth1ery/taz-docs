---
title: fun
description: counting channels with strikes and bans, image tools like /caption and /imgfx, birthday announcements, a starboard, and the classics - cats, dogs, rock paper scissors, coinflips, dice, and fakeban.
order: 5
icon: fa-dice
card: counting channels, image tools, birthday announcements, a starboard, cats, dogs, rock paper scissors, coinflips, dice, and fakeban.
---

counting channels with strikes and bans, image tools, birthday announcements, a starboard, and the classics.

## counting {#counting}

members count up together, one number per message, one person - post twice in a row or get the number wrong, and it's a strike. a server can run several independent counting channels at once, each its own separate game - trailing chatter or an emoji after a valid number (`"52 lol"`) doesn't break it, taz just reads the leading number.

::: commands
- `/counting add channel: ban_role:` - adds a counting channel. free servers get 3, taz plus is unlimited.
- `/counting remove channel:` - removes one counting channel.
- `/counting list` - every counting channel in this server and its current progress.
- `/counting menu` - interactive panel: add/remove channels, toggle bans on/off, set the strike limit.
- `/counting status channel:` - current count, record, and last counter for one channel - open to everyone, not just staff. channel is optional if there's only one, or you're already in it.
- `/counting unban` / `clear-strikes` - undo a counting ban, or clear someone's strikes - bans are server-wide, across every counting channel. both the automatic ban and the pardon are written to your mod log (the **Counting Bans** logging toggle), so a quietly-applied ban isn't invisible after the fact.
- `/counting settings bans_enabled: ban_limit: math_enabled:` - configure the ban-on-too-many-mistakes behavior, and whether a math expression counts as the next number.
- `/counting settings delete_chatter: delete_after: chatter_message:` - what happens to messages that aren't counting - see below.
- `/counting disable` - removes every counting channel from this server.
:::

status/leaderboard resolve which channel you mean automatically when it's obvious (the channel the command was run in, or the server's only one) - no need to pick one every time. there's no manual reset - a mistake resets a channel's count on its own, and that's the only way it moves.

status is open to any member; everything else above needs Manage Server (or a dashboard staff grant).

bans-on-mistake are on by default (3 strikes) but fully configurable, or can be turned off completely if you just want the counting without consequences.

### messages that aren't counting {#counting-chatter}

by default taz tolerates a few non-counting messages in a row, then posts a warning and starts deleting until someone counts again - and deletes gifs and links straight away. every part of that is yours to change, with `/counting settings` or on the dashboard's fun page:

::: commands
- `delete_chatter:` - whether ordinary conversation gets deleted once the limit below is reached. turn it off to leave conversation completely alone - useful if your counting channel doubles as a chat channel.
- `delete_media:` - whether gifs, links, invites and attachments get deleted on sight, with no limit to reach first.
- `delete_after:` - how many non-counting messages in a row are tolerated before deleting starts. defaults to 5; set it to 1 to delete every one.
- `chatter_message:` - what taz says when deleting starts. `none` deletes silently, `reset` puts the default back.
:::

::: note
chatter and media are two independent switches, so **"delete gifs but leave conversation alone"** is a real setup - that's the point of splitting them. media gets deleted on sight rather than waiting for the limit because a gif pushes the current number off everyone's screen in a way "lol" doesn't. turning `delete_media` off doesn't make gifs exempt, it just makes them count as ordinary chatter like anything else.
:::

### global leaderboards {#counting-leaderboards}

two cross-server leaderboards, ranking every server taz is in against each other:

::: commands
- `/counting leaderboard channel channel:` - top counters in one of this server's own counting channels - the original per-channel view.
- `/counting leaderboard global` - top counters by person, across every server taz is in.
- `/counting leaderboard server` - servers ranked by their best single-channel record.
:::

you can hide yourself from the global leaderboard with [`/me leaderboards state:hidden`](/docs/profile#me); a server can hide itself entirely from the dashboard's counting settings.

## image tools {#image-tools}

captions, filters, and a compatibility card, all built to work on animated (GIF/WebP) avatars, not just static ones - a captioned or filtered animated avatar stays animated.

::: commands
- `/caption text: position: image: user:` - a white caption bar with bold text across the top or bottom of an image or someone's avatar - the classic "screenshot with a caption slapped on it" look.
- `/imgfx effect: effect2: effect3: image: user:` - grayscale, invert, blur, pixelate, sepia, or deepfry - stack up to 3 at once, applied in the order given.
- `/ship user1: user2:` - a compatibility card for two members - both avatars, a percent that's always the same for a given pair, and a flavor line that varies each time you run it.
:::

`image:` and `user:` are both optional on every one of these - upload your own image, mention someone to use their avatar, or leave both blank to use your own.

## birthdays {#birthdays}

members set their own birthday on [`/me`](/docs/profile) - a cross-server profile, so it only has to be entered once. a birth year is optional; without one, only the month/day is ever known. a server with a birthday channel configured announces it automatically on the day, for any member whose birthday is visible to that server.

::: commands
- `/birthday channel:` / `clearchannel` - where (and whether) birthday announcements post. staff only.
- `/birthday message value:` - the announcement template - defaults to plain text, "happy birthday {user}!"; a full embed version is available from the dashboard. supports `{age}` too - it fills in for members who've set a birth year and turned age visibility on, and is left blank for everyone else. staff only.
- `/birthday role:` / `clearrole` - an optional role granted for the day, removed automatically the next. staff only.
- `/birthday status` - this server's current birthday settings, plus whether your own birthday and age are currently visible here.
- `/birthday hide` / `show` / `reset` - override your birthday's visibility for just this server, on top of your global `/me` default - visible everywhere except one server, or the reverse. anyone can run these on themselves.
- `/birthday hideage` / `showage` / `resetage` - the same override, but for your age specifically - independent of your birthday's own visibility, so "birthday visible, age hidden" (or the reverse) both work.
:::

## starboard {#starboard}

a message that gets enough of a chosen reaction gets reposted to a channel of your choice, with a live-updating count - the classic "best of the server" board. configurable from Discord or the dashboard's fun page; either way edits the same settings.

::: commands
- `/starboard channel channel:` - sets the repost channel - this is what turns the starboard on.
- `/starboard disable` - turns it off without losing the rest of the configuration.
- `/starboard emoji emoji:` - which reaction counts - defaults to ⭐. any unicode or server emoji works.
- `/starboard threshold count:` - how many reactions a message needs - defaults to 3.
- `/starboard color hex:` - the repost embed's color - defaults to gold.
- `/starboard message template:` - customize the line posted above the embed - supports `{stars}` `{emoji}` `{channel}` `{jump}` `{user}` `{username}` `{server}`. leave it blank to reset to the default.
- `/starboard removebelowthreshold enabled:` - off by default - once posted, a repost stays up regardless of a later drop in reaction count. turn this on to take it back down instead.
- `/starboard exclude` / `include channel:` - stop (or resume) a specific channel feeding the starboard.
- `/starboard status` - the current configuration at a glance - channel, emoji, threshold, color, message, and excluded channels.
:::

self-reactions never count toward the threshold - starring your own message doesn't do anything.

## just for fun

::: commands
- `/cats` / `/dogs` - a random cat or dog picture.
- `/flip` - flips a coin.
- `/roll` - rolls a six-sided die.
- `/rps opponent:` - rock paper scissors - instant against taz, or challenge another member (they get an accept/decline first, then both of you pick in secret).
- `/pfp user:` - pulls up someone's profile picture, full size.
- `/fakeban target: reason:` - posts a convincing ban message without actually banning anyone. lives under moderation commands, but let's be honest about what it's for.
:::

::: note
this list grows when there's a specific request, not for its own sake. want something added? the [support server](https://discord.com/invite/CrDKkkxHVy) is the place to ask.
:::
