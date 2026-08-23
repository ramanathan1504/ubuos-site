---
title: What it is
description: One command that answers from your own machine first, and the layers you may add above it.
---

`oss` reads any repository through the GitHub API — no clone, any language, any
forge — keeps what it finds in local SQLite, and answers from that before it
asks anything else.

That last part is the whole design. Every other assistant you can install starts
by sending your question somewhere. This one starts by looking at what you
already have, and says so in the answer.

## The ladder

One question, and up to five places it can be answered from. You choose by
putting a name in front of the command; with no name, it takes the highest rung
that is actually connected.

| Rung | Typed as | What it costs | Where your question goes |
|---|---|---|---|
| Your own corpus | `oss ask …` | nothing | nowhere |
| A local model server | `oss llm ask …` | your own CPU | nowhere |
| A provider's CLI, already signed in | `oss claude --cli review 812` | whatever that CLI costs you | that provider |
| A provider's API key | `oss claude review 812` | metered | that provider |
| Nothing connected | — | — | it says which two fixes would work, and offers `oss prompt` |

`llm` is a local model server. `claude`, `gemini`, `codex` and `junie` are the
four cloud providers. **A prefix works in front of any command**, so the
question of who answers is separate from the question of what you asked.

Nothing is refused for having only one of them. A machine with a key and no
local model works; a machine with a local model and no key works; the pair is
better than either and neither is mandatory.

## Nothing is required

| With | You get |
|---|---|
| Just `oss` | Facts from the API: diffs, commits, CI, review threads, conventions |
| + the built-in model | Search by meaning — `oss model --fetch`, 22 MB, in-process |
| + a local model server | Answers, verdicts, triage and conversation, on your own hardware |
| + a cloud key or a signed-in CLI | The same, from a bigger model, when the local rung falls short |
| + a runner | Execution against real applications |
| + a memory extension | Your notes kept wherever you already keep them |

The storing half needs **no AI whatsoever** — filing, the topic map and the
digests are deterministic. Only *finding by meaning* needs a model, and only
*writing prose* needs one that generates.

## Two things it cannot do alone

Reading a repository through an API is a deliberate boundary, and it is why the
tool generalises. The cost is two questions:

- **Does this actually run?** Reading a diff cannot settle it.
- **Have I worked this out before, somewhere that is not GitHub?** 

Those are **extensions**. A **runner** executes something real; a **memory**
remembers. Each is a directory containing one JSON file, run as a child process —
so it can be bash, Python, Go, or a binary somebody handed you.

## The rule that does not bend

Reading a public repository is free to get wrong. Writing to one is not: a
comment reaches every watcher and the mailing list the instant it is sent, and
deleting it afterwards reaches neither.

So **every outward write is refused by default, everywhere, and there is no
setting that changes it.** See [Writing upstream](/docs/reference/upstream/).

The same rule holds one level down. `oss ask --allow-edit` proposes a change to
a file on your own disk, shows it as a diff, and waits. `--allow-run` runs the
project's own build or test command and nothing else. Neither flag is on unless
you type it.
