---
title: Conversations
description: Starting a conversation about an issue, leaving it, and picking it up again.
---

`oss chat` is a conversation about one issue that survives the terminal it was
typed in. Every turn is written the moment it is said, so closing the window is
a pause rather than a loss, and <kbd>ctrl-c</kbd> costs nothing.

```bash
oss chat 4129          # start on an issue
oss chat --continue    # carry on with the most recent
oss chat --resume 7    # a specific one, by id
oss chat --resume      # pick one from the list
oss history            # browse them all, and resume the one you choose
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

## Several terminals at once

Each conversation is claimed by the terminal holding it. A second terminal that
opens the same conversation **forks a copy** rather than interleaving two people
into one transcript, and says so.

Turns stay private to their conversation while it is open. On `exit` the
transcript is filed and embedded, and from then on every terminal's `search`,
`prompt` and `review` can retrieve it.

## Settings

| Key | Meaning |
|---|---|
| `chat.context.chars` | The whole prompt budget — transcript and retrieved notes together. Default 32,000, roughly an 8k-token window |
| `ollama.timeout_seconds` | How long to wait for a local answer. Default 900 |
| `ollama.model.guidance` | The model that answers |

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
