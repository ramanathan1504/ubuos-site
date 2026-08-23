---
title: Conversations
description: Starting a conversation about an issue, leaving it, and picking it up again.
---

`oss ask` with no question opens a conversation about the project you are
standing in. Every turn is written the moment it is said, so closing the window
is a pause rather than a loss, and <kbd>ctrl-c</kbd> costs nothing.

```bash
oss ask                       # a conversation, until you leave
oss ask --resume              # pick the last one up
oss ask --issue 4129          # about one issue, with everything known about it
oss history                   # browse them all, and resume the one you choose
```

**Every question starts with what you already worked out** — your notes, your
synced issues, and every question you have asked here with the answer it got. If
one of them already solved it, you are pointed at it before anything new is
proposed.

`oss chat <n>` is the older, issue-only form of the same thing. It still works
and takes the same flags; `ask --issue` covers it and is what `oss --help`
shows.

```bash
oss chat 4129          # still works
oss chat --continue    # carry on with the most recent
oss chat --resume 7    # a specific one, by id
```

## Finding the one you want

`oss history` is a list you move through with the arrow keys — or `j`/`k` — with
a preview of what each conversation was about and where it got to. <kbd>enter</kbd>
resumes the highlighted one.

Raw keyboard input needs a real terminal, which cron, CI, some remote shells and
Windows do not provide. There the same list is numbered and picked by typing a
number, and `oss chat --resume <id>` needs no list at all.

A `+` after the turn count means older turns have been folded into a summary, so
the number is what is still verbatim rather than everything that was ever said.

## Long conversations are folded, not truncated

Once a transcript outgrows the model's context, the older turns are summarised
into a running summary and the recent ones kept verbatim. The full transcript
stays readable in `oss history --show` either way.

With no generation model attached there is nothing to summarise *with*, so the
oldest turns are dropped instead — and that is printed. Quietly forgetting the
first half of a conversation while continuing to answer confidently is the
failure worth shouting about.

Two things you can type that are not questions:

| | |
|---|---|
| `/context` | How full the conversation is: characters against the budget, how many turns, how much the retrieved notes are taking, and whether anything has been folded already |
| `/compact` | Fold the older turns now, rather than waiting for it to happen mid-answer |

Neither becomes a turn, so neither reaches the model or the transcript.

:::note
The budget covers the **whole prompt**, not the transcript alone. Your retrieved
notes are charged against the same window. They used to be budgeted separately,
which meant two limits that could each be satisfied and still overflow together.
:::

## Every answer says what went into it

`review` has always closed with the layers it used. `chat` and `guide` do the
same now — because without it, an answer built from your whole corpus and one
built from the issue title alone print identically, and you are left guessing
which you got.

```
── What went into this answer ──
  ✔ The issue as filed              #4129 in apache/logging-log4j2
  ✔ Your own prior work             22 passages (~5750 tokens) of 32 that matched
        1 issue · 16 notes · 5 related issues
  ✔ Answered by                     Gemini
  ✗ Read back against your history  no local model — the API that wrote the
                                    answer cannot also check it

── What would make the next one better ──
  · attach a local model that fits — then a cloud answer is checked against your own work
```

Three things in order: **what you already had**, **what the model added**, and
**what would improve the next one**.

`22 of 32` is the honest number — ten of your own passages did not fit the
budget, and saying so is the whole point. Every absence carries its remedy;
an absence without one is a complaint.

:::note
The alignment line is the one worth watching. A cloud answer read back against
your own past work is a different object from one that was not, and only a
**local** model can do that check — sending your history to the same API that
wrote the answer would undo the reason the two steps are separate.
:::

## Several terminals at once

Each conversation is claimed by the terminal holding it. A second terminal that
opens the same conversation **forks a copy** rather than interleaving two people
into one transcript, and says so.

Turns stay private to their conversation while it is open. On `exit` the
transcript is filed and embedded, and from then on every terminal's `search`,
`prompt` and `review` can retrieve it.

## A model that does not fit is not loaded

Ollama does not refuse a model larger than the free memory. It loads it, the
machine swaps, and everything stops responding for minutes — measured at ten on
an 8 GB laptop running a 7B model with a browser open. That is worse than an
error: an error can be read, and a frozen laptop cannot even be cancelled.

So the size is checked against what is actually free, before anything loads.

- **At most half the free memory** is offered to a model. The other half is left
  for everything else you are running — fitting the model in and making the rest
  of the desktop unusable is the same freeze from where you sit.
- When it does not fit, the largest installed model that **would** is named.
  "Too big" is a complaint; "too big, use this one" is an instruction.
- `chat` falls back to whatever else is connected. `guide` says which cloud flag
  to pass instead.

```
⚠ Not running 'qwen2.5-coder:7b' locally — it does not fit in memory right now.
  'qwen2.5-coder:7b' needs about 5.4 GB and this machine has 1.9 GB free of 8.6 GB.
  Loading it would swap, and swapping locks the machine up for minutes rather than failing.
    At most half the free memory is used, so 1.0 GB is available to a model
    and 1.0 GB is left for everything else you are running.
    'qwen2.5:0.5b' is installed and fits. Set it with: oss setup
```

`oss doctor` reports it in advance, so the first you hear of it is not a
stalled machine:

```
[ warn ] guidance model — qwen3:4b does not fit in memory right now
[  ok  ] triage model — qwen2.5:0.5b — fits (1.5 GB free of 8.6 GB)
```

Because only half of what is free is ever used, a model needs roughly **twice
its own size free** to run. Nothing has to be reconfigured when memory frees up
— the check is taken each time, so the same model starts working again on its
own.

:::note
A machine whose memory cannot be read is never refused on. The check exists to
prevent a freeze, and refusing on no evidence would be its own kind of broken.
:::

## Settings

| Key | Meaning |
|---|---|
| `chat.context.chars` | The whole prompt budget — transcript and retrieved notes together. Default 32,000, roughly an 8k-token window |
| `ollama.timeout_seconds` | How long to wait for a local answer. Default 900 |
| `ollama.model.guidance` | The model that answers. Pick one that fits — see above |

:::caution
A 7B model on an Apple-silicon laptop was measured at **482 seconds** for a
realistic prompt. If `ollama.timeout_seconds` is stored below the default, a
request that is working will be cut off — `oss doctor` says so.
:::

## What it needs

Either a local model **or** a cloud key; both is best, neither refuses.

| Connected | What happens |
|---|---|
| Ollama and a key | The local model answers. `y` escalates the last question, and the cloud's answer is read back against your own past work |
| Ollama only | The local model answers. Nothing to escalate to, so `y` is not offered |
| A key only | The cloud answers every turn directly. Answers cannot be aligned against your history, and it says so each time |
| Neither | Refuses, naming both ways to fix it, and points at `oss prompt` — the same context, as a prompt you can paste anywhere |
