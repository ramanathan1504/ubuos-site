---
title: Where an answer comes from
description: Asking, choosing which rung answers, and reading what went into it.
---

`oss ask` is a conversation that survives the terminal it was typed in. Every
turn is written the moment it is said, so closing the window is a pause rather
than a loss, and <kbd>ctrl-c</kbd> costs nothing.

```bash
oss ask                              # keep asking; ctrl-d leaves
oss ask "why is the retry loop giving up early?"
oss ask --issue 4129 -r owner/name   # about one issue, with what is already known
oss ask --resume                     # continue the last one in this directory
oss history                          # browse them all, and resume the one you choose
```

## At the prompt

The line you type is a real one: arrow keys, <kbd>ctrl-a</kbd> and
<kbd>ctrl-e</kbd>, and <kbd>↑</kbd> for what you asked last time — history is
kept across sessions, because a question worth asking again is usually worth
asking about a different repository. <kbd>Tab</kbd> completes a command name,
and offers the choices when more than one matches.

<kbd>ctrl-d</kbd> and <kbd>ctrl-c</kbd> both leave. Neither is an error and
neither loses anything: every turn was written when it was said.

Where there is no terminal — under `cron`, in CI, or with input piped in — the
editing quietly stops being offered and the prompt still reads a line.

## Nothing waits in silence

Anything that takes more than a moment says what it is doing, how long it has
been, and — when a model is answering — how much of the answer has arrived:

```
⠹ asking claude — 18420 characters — claude is answering, 10 KB so far   3.1s
```

A command that shows nothing cannot be told from one that has hung. This is the
difference between waiting and wondering, and it is why `oss claude review` on a
large pull request no longer looks broken while it thinks.

Set `NO_COLOR` to turn the colour off. It is off automatically when the output
is not a terminal, so `oss review 4129 > review.md` gives you a file to read
rather than one full of escape codes.

`ask` can look while it answers. It reads your corpus, opens files under the
directory you started it in, and — only when you say so — runs the project's own
build and proposes edits:

| Flag | What it permits |
|---|---|
| `--allow-run` | the project's own build or test command. Never an arbitrary one |
| `--allow-edit` | a change to one file, shown as a diff and confirmed by you before it is written |
| `--steps <n>` | how many times it may look before it must answer |

Neither permission is on unless you type it, and both are per-invocation: there
is no setting that leaves them on.

:::note
`oss chat <n>` is still here and still works — `oss --help-all` lists it. It is
`ask` narrowed to one issue and nothing else. Everything below about folding,
sources and model fit applies to both.
:::

## Which rung answers

With nothing in front of the command, `ask` takes the highest rung that is
actually connected — your own corpus, then a local model server, then a signed-in
provider CLI, then a cloud key. Name one to override it:

```bash
oss ask "…"              # whatever is connected, local first
oss llm ask "…"          # the local model server, and nothing leaves the machine
oss claude ask "…"       # Anthropic's API
oss claude --cli ask "…" # the claude CLI you are already signed in to
oss gemini ask "…"       # Google
oss codex ask "…"        # OpenAI
oss junie ask "…"        # JetBrains
```

With none of them connected it refuses, names **both** ways to fix it, and
points at `oss prompt` — the same assembled context, as a prompt you can paste
anywhere.

## Finding the one you want

`oss history` is a list you move through with the arrow keys — or `j`/`k` — with
a preview of what each conversation was about and where it got to. <kbd>enter</kbd>
resumes the highlighted one.

Raw keyboard input needs a real terminal, which cron, CI, some remote shells and
Windows do not provide. There the same list is numbered and picked by typing a
number, and `oss ask --resume` needs no list at all.

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

`review` has always closed with the layers it used. `ask` and `chat` do the
same — because without it, an answer built from your whole corpus and one
built from the issue title alone print identically, and you are left guessing
which you got.

```
── What went into this answer ──
  ✔ The issue as filed              #4129 in owner/name
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
- `ask` falls back to whatever else is connected, and says which rung it moved
  to rather than going quiet.

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
| `chat.context.chars` | The whole prompt budget, for `ask` and `chat` alike — transcript and retrieved notes together. Default 32,000, roughly an 8k-token window |
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
