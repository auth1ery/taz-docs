---
title: documentation
heading: how taz actually works
description: a growing reference for every module - what each command does, how the settings fit together, and what's free vs. taz plus.
---

a growing reference for every module - what each command does, how the settings fit together, and what's free vs. taz plus. this is still early, so a topic without its own page yet just isn't written up here - the [full command list](/commands) always has the raw, current details.

::: note
new server? every module's own menu - `/mod menu`, `/level menu`, `/ticket menu`, `/general menu` - walks through its settings interactively, with a button to create any channel it needs. a channel only taz posts in (level-ups, welcome, goodbye, the weekly digest, suggestions) is made read-only for everyone, and the mod log and antinuke alerts are hidden from everyone but admins - add your mod roles to them yourself. or configure everything from the [dashboard](/dashboard) instead.
:::

::: note
a command that asks for a channel - `/counting add`, `/general settings welcomechannel` and the rest - doesn't need one: run it in the channel you mean and taz uses that one (for a category, the category it's in). discord sometimes refuses a picked channel with *"A channel id specified is invalid"* before taz ever sees the command, and running it in the channel itself gets around that. if taz can't see or post in the channel, she says which permission she's missing.
:::
