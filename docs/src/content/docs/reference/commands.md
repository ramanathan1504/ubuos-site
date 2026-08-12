---
title: Commands
description: What each command is for.
---

`oss --help` lists everything; this is what each is *for*.

## Reading

| Command | Answers |
|---|---|
| `review <n>` | Is this pull request right, against what the project actually expects |
| `search <words>` | Have I seen this before |
| `inspect <n>` | What context sits behind one result |
| `critical` | What arrived that matters most |
| `duplicates` | Is this the same as something already open |
| `report` | What changed, and what is waiting on me |
| `pr <n> --repo owner/name` | Every mechanical fact about a pull request |
| `issue <n> --repo owner/name` | The report, as filed |
| `followup` | What moved on a pull request since you reviewed it |
| `hub` | Is anyone waiting on you — every project you follow, in one list |
| `memory` | File, index and search your notes. Built in; an extension takes over |
| `pick` | What to work on next, scored against what you have already reviewed and written |
| `backlog` | The whole backlog as one page: clusters, mergeable, one fix away |
| `run` | Run a pack — `oss run --pack <dir> matrix …`. The engine ships with `oss` |
| `model` | The optional local model that upgrades search from words to meaning |
| `backup` / `restore` | Everything that cannot be re-derived, into one zip — `--to` a synced folder for off-machine copies |

## Extensions

| Command | Does |
|---|---|
| `ext add <path>` | Attach a runner or a memory |
| `ext list` | What is attached, and is it still reachable |
| `ext refresh <name>` | Re-read a manifest after editing it |
| `run <verb> …` | Dispatch to a runner |
| `memory <verb> …` | Dispatch to a memory |

## Setup

| Command | Does |
|---|---|
| `setup` | Models, tokens, note folders — every prompt skippable |
| `doctor` | Every prerequisite at once, with the fix for each |
| `alias <name>` | Give the command your own name |
| `serve --install` | Keep the service running at login (macOS, Linux, Windows) |
| `serve` | The local page on `:1504` |
| `backup` / `restore` | Your database and palette |

:::note
`doctor` exits non-zero when an **optional** prerequisite is missing. It is a
report, not a failure.
:::

## Following a review

`pr` is a snapshot: it says what something looks like now. It cannot say whether
the author pushed after you commented — it has nothing to compare against.

```bash
oss followup --record 4234 --repo apache/logging-log4j2 --verdict blocked \
             --note "compressionLevel=0 throws in the rollover"
oss followup                 # every recorded PR, one line each
oss followup --changed       # only the ones that moved
```

The record carries the repository, so one list covers every project you follow.
It lives in `~/.oss-cli/reviews/`, outside any clone, because it outlives every
checkout it describes.

:::caution
Recording is deliberately manual, and only correct after you have actually
re-read the pull request at its new head. Doing it automatically would erase the
one signal it exists to show.
:::
