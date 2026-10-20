---
title: announcements
description: scheduled announcements taz posts on a timer, and youtube notifications that post the moment a channel you watch uploads or goes live.
order: 7
icon: fa-bullhorn
card: announcements taz posts on a schedule, and youtube notifications for channels you watch - uploads and live streams.
---

two kinds of thing taz posts without being asked: an announcement you wrote once and put on a timer, and a notification for a youtube channel you're watching. both live under `/announcements`, and on the dashboard's announcements page.

## scheduled announcements {#scheduled}

write it once, taz posts it on a schedule - a weekly event reminder, a daily rules nudge, a one-off you'd rather not stay up for. each one gets a name you refer to it by afterwards.

::: commands
- `/announcements scheduled add name: message: datetime: channel: recurrence:` - `datetime` is the first fire time as `YYYY-MM-DD HH:MM`, in UTC. `channel` is where it posts, the channel you run it in if you leave it out. `recurrence` is once (the default), daily, weekly, or monthly.
- `/announcements scheduled edit name:` - change the channel, message, next fire time, recurrence, or enabled state of an existing one. a disabled announcement keeps its settings and just stops firing.
- `/announcements scheduled remove name:` - delete one for good.
- `/announcements scheduled list` - every scheduled announcement in this server, with its channel, next fire time, and recurrence.
:::

the message can be plain text or a full embed, and supports `{server}` and `{memberCount}`. the member placeholders `{user}` and `{username}` are accepted for consistency with every other message box, but nobody triggers a scheduled announcement - there's no member for them to point at, so they both come out as "someone". there's no cap on how many you can have, free and taz plus alike.

::: note clock
times are UTC, deliberately - a server with staff in four countries shouldn't have its announcements silently shift because of whose timezone taz guessed. work out the UTC time once when you set it up and it stays put, daylight saving included.
:::

## youtube notifications {#youtube}

taz watches a youtube channel and posts in your server when a new video goes up or a stream goes live. add the channel by `@handle`, by URL, or by its raw channel ID - whichever you have to hand.

::: commands
- `/announcements youtube add youtube: channel: mention: role: message: livemessage:` - start watching a channel. `channel` is where the announcement posts; `mention` is none (the default), `@everyone`, `@here`, or a role.
- `/announcements youtube edit youtube:` - change the post channel, mention, either message, or whether this watch is active.
- `/announcements youtube addmentionrole` / `removementionrole` - ping more than one role on an upload - add them one at a time.
- `/announcements youtube remove youtube:` - stop watching a channel.
- `/announcements youtube list` - every channel this server watches, and where each one posts.
:::

every subcommand that takes a `youtube:` accepts the channel's name as well as the ID or handle you originally added it with, so you don't have to go looking for the ID again to edit something.

each watch has two messages: `message` for a new video, defaulting to *"{channelTitle} just posted **{title}**!"*, and `livemessage` for a live stream, defaulting to *"{channelTitle} is live: **{title}**"* - both followed by the link. they support `{channelTitle}`, `{title}`, `{url}` and `{server}`. as everywhere else, they can be plain text or an embed - but a mention inside an embed doesn't notify anyone ([discord's rule, not taz's](/docs/customization#mentions)), so a watch that pings a role wants plain text.

::: commands
- free - 3 watched channels per server.
- taz plus - unlimited watched channels.
:::

::: note check
a channel is checked against its real upload feed *before* it's saved, so a typo'd handle is rejected at the point you add it rather than silently never posting anything. if you're watching a channel that a lot of other servers also watch, taz checks it once and fans the result out - you're not each costing youtube a separate request.
:::

::: note warning
taz needs permission to send messages (and embed links, for the embed version) in the channel you pick. youtube tells taz about new uploads as they happen, so most post within a minute or so; if that notice goes missing, a regular check catches it a little later.
:::

### live streams and premieres {#youtube-live}

youtube lists a stream as soon as it's scheduled - including the one OBS makes for you when you set up a broadcast - long before anyone can watch it. taz doesn't post it then. she checks back about once a minute around the scheduled time (every few minutes otherwise) and posts the live message once the stream has actually started. a scheduled premiere works the same way, but posts with the new video message, since it's a video. a stream that's never started is forgotten after a week, and one that's deleted or made private before it starts isn't posted at all.

## announcements that live elsewhere {#elsewhere}

a few other things taz posts on her own are configured under the module they belong to rather than here:

::: commands
- [welcome & leave messages](/docs/customization#welcome-leave) - posted when someone joins or leaves - `/general settings`.
- [sticky messages](/docs/customization#sticky-messages) - a message that reposts itself to stay at the bottom of a channel - `/general sticky`.
- [birthday announcements](/docs/fun#birthdays) - posted on the day, for members whose birthday is visible to your server - `/birthday`.
- [level-up messages](/docs/leveling) - posted when someone levels up - `/level settings`.
- [standalone embeds](/docs/utilities#embed) - a one-off embed built on the dashboard and posted on demand - `/embed post`.
:::
