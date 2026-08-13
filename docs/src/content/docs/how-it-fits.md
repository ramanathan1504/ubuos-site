---
title: How it fits together
description: One rule decides what lives in oss and what lives in an extension. Everything else follows from it.
---

There is one rule, and the rest of this page is it applied.

> **`oss` ships every capability. An extension supplies only what `oss` cannot
> know: the tools on your machine, and how your project runs.**

## What that means when you install it

A fresh install has no extensions attached, and everything below already works:

```bash
oss search "rollover compression"    # your own data, no model needed
oss issue 4143 --repo owner/name
oss pr 4240 --repo owner/name
oss review 4240
oss followup                         # what moved on what you reviewed
oss hub                              # is anyone waiting on you
oss memory file notes.md             # remember something
oss memory search "keyspace"         # find it again
```

**Nothing is required.** No account, no model server, no second repository, no
Java. Attaching an extension makes things richer; not attaching one never takes
a capability away.

## What an extension is

A directory with one file in it.

```json
{
  "name": "kafka",
  "kind": "runner",
  "exec": "./kbench",
  "verbs": { "list": "list", "run": "run" }
}
```

```bash
oss ext add ~/my-kafka-bench
oss run --name kafka run payments
```

That is the entire contract. **A repository only matters if you want to share
it** — an extension is a folder, and a folder does not need a remote, a licence
or a CI pipeline to work on your own machine.

There are two kinds, because there are exactly two questions `oss` cannot answer
from the GitHub API alone:

| Kind | Answers | Why it cannot be built in |
|---|---|---|
| `runner` | *Does this actually run?* | Every project builds and runs differently. Nobody's CLI can execute your project for you |
| `memory` | *Where should this be kept?* | `oss` has a memory of its own; an extension points it at the archive you already use instead |

## Where the line falls, with real examples

| | Lives in `oss` | Lives in an extension |
|---|---|---|
| Reading a pull request, an issue, follow-up, the hub | ✅ one API read, works anywhere | |
| Search over your own backlog | ✅ term index built in, embeddings when a model is present | |
| Filing and searching notes | ✅ markdown in a folder | Putting them in DEVONthink instead |
| Running 19 applications across a version × config matrix | | ✅ 65 MB of real apps — that is a repository, not a command |

Follow-up is the clearest case, because it used to be on the wrong side. It
lived inside a Log4j bench, where it worked against any repository but could
only be reached by attaching that bench — a general capability held hostage by a
specific one. It needs one API read and a record; it forks no JVM. So it moved.

## A pack, worked through

[**log4j2-workout**](https://github.com/ramanathan1504/log4j2-workout) is a real
runner: Apache Log4j against nineteen applications, on real JVMs, across a
version × configuration × application matrix. It is the example to copy, and
**you never need to clone it** to use `oss`.

The part worth stealing is how it separates the engine from what it tests. The
engine forks JVMs and walks a matrix; none of that is Log4j-specific. What *is*
lives in one file:

```bash
BENCH_PACK=example ./bench list      # packs/example/ exists to be copied
```

Point the same machinery at Kafka, Spark, or your own service by writing the
axes for it — the versions, the applications, the module map — and leaving the
engine alone.

## Upstream is read-only

`oss` reads other people's projects. It has no command that posts, comments or
opens anything in a repository you do not own, and that is a design decision
rather than a missing feature.

Deciding to say something in someone else's project is a decision a person makes
in their own words. A tool that could do it on your behalf is a tool that
eventually does — and a GitHub delete does not reach the mailing-list archive or
an email that has already gone out.

See [Writing upstream](/docs/reference/upstream/) for the one narrow exception:
an *extension you attached yourself* may declare a verb that writes, and even
then it is refused unless you name the exact repository on the command line and
confirm at the terminal, every single time.
