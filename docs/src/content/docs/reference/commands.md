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
| `chat <n>` | Work through one issue in conversation, saved as you go |
| `history` | Which conversations do I have, and where did each get to |
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

## When something goes wrong

The console shows what you need while you work. The full record is on disk:

```
~/.oss-cli/logs/oss-cli.log
```

Everything the console printed, plus `DEBUG` — the calls that were made, the
values that were read, the reason a step was skipped. When a command did
something you did not expect, that file says why and the screen usually does
not.

| | |
|---|---|
| Level | `DEBUG` on disk, `INFO` on screen |
| Rolls at | 10 MB, or daily |
| Keeps | 10 files, gzipped |

`oss doctor` is the first thing to run; the log is the second.

:::note
Writes to that file happen on a background thread, so logging never sits between
you and an answer. It is flushed when the command exits, so the last line of a
run is always there — including the last line of a run that failed.

The console is deliberately **not** written that way. In this program the
console output *is* the interface, and an interface that arrives a moment late
lands after the prompt you are already typing into.
:::

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
oss followup --record 4234 --repo owner/name --verdict blocked \
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

## With no connection

Seven of the thirty-six reach the network. Flip the switch and watch which ones
go quiet — the same board, and the same claim, as the front page.

<div class="cable" id="cable">
  <div class="cable-bar">
    <button class="cable-switch" id="cable-switch" type="button" aria-pressed="false">
      <span class="knob" aria-hidden="true"></span>
      <span class="cable-label">Pull the cable</span>
    </button>
    <p class="cable-read"><span class="cable-num" id="cable-num">36</span> <span class="cable-of">of 36 commands still work</span></p>
  </div>
  <ul class="cmd-board"><li class="cmd net" style="--i:0">sync</li><li class="cmd net" style="--i:1">issue</li><li class="cmd net" style="--i:2">pr</li><li class="cmd net" style="--i:3">hub</li><li class="cmd net" style="--i:4">followup</li><li class="cmd net" style="--i:5">review</li><li class="cmd net" style="--i:6">model --fetch</li><li class="cmd" style="--i:7">search</li><li class="cmd" style="--i:8">prompt</li><li class="cmd" style="--i:9">inspect</li><li class="cmd" style="--i:10">history</li><li class="cmd" style="--i:11">chat</li><li class="cmd" style="--i:12">critical</li><li class="cmd" style="--i:13">duplicates</li><li class="cmd" style="--i:14">triage</li><li class="cmd" style="--i:15">guide</li><li class="cmd" style="--i:16">profile</li><li class="cmd" style="--i:17">onboard</li><li class="cmd" style="--i:18">report</li><li class="cmd" style="--i:19">trend</li><li class="cmd" style="--i:20">analyze</li><li class="cmd" style="--i:21">backlog</li><li class="cmd" style="--i:22">pick</li><li class="cmd" style="--i:23">hidden-critical</li><li class="cmd" style="--i:24">prs</li><li class="cmd" style="--i:25">serve</li><li class="cmd" style="--i:26">backup</li><li class="cmd" style="--i:27">restore</li><li class="cmd" style="--i:28">doctor</li><li class="cmd" style="--i:29">alias</li><li class="cmd" style="--i:30">ext</li><li class="cmd" style="--i:31">setup</li><li class="cmd" style="--i:32">run</li><li class="cmd" style="--i:33">memory</li><li class="cmd" style="--i:34">bench</li><li class="cmd" style="--i:35">kb</li></ul>
</div>

Six of the seven fetch one thing you asked for by number; `model --fetch`
downloads the embedder once in the life of the install. Everything else reads a
file on your disk — including search by meaning, because the model doing the
arithmetic runs inside the process rather than behind an API.

The ones that do need it refuse in a sentence naming the cause, and point at what
still answers:

```
$ oss issue 4143 --repo owner/name
error  no network — api.github.com could not be resolved.
       Everything already synced still works offline: oss search, oss inspect, oss prompt.
```

A cause is only ever named when there is evidence for it. `hub` reports
`17 unreachable (no network — GitHub was not reachable)` when the machine is
offline, and keeps saying `private, deleted, or no token` when it is not — because
then that genuinely is the list.

Two commands have a shape worth knowing:

- **`setup` needs a terminal.** It asks eleven questions. Run without one — a
  script, a pipe, CI — it refuses and changes nothing, rather than answering its
  own questions with silence and reporting success.
- **`backlog` passes its arguments through** to the report, flags included:
  `oss backlog owner/name --no-ai --dry-run`.

See [Finding things](/docs/search/) for what runs without a connection at all.

## Pasting from these pages

Every example here is written with its explanation on the same line:

```bash
oss followup                 # every recorded PR, one line each
```

zsh does not strip that — `interactive_comments` is off in an interactive shell,
so `#` and everything after it arrive as arguments. `oss` discards them itself,
so the line above runs as written whichever shell you paste it into. Only a bare
`#` counts, so `oss pr #4240` still means 4240.
